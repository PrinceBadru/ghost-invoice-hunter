import * as XLSX from "xlsx";
import Decimal from "decimal.js";

export interface ParsedRow {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ParsedDocument {
  rows: ParsedRow[];
  total: number;
  errors: string[];
}

/**
 * Parses an uploaded .xlsx or .csv file into normalized line items.
 * Enforces strict column mapping, decimal accuracy, and row validation.
 */
export function parseSpreadsheet(buffer: Buffer): ParsedDocument {
  const errors: string[] = [];
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { rows: [], total: 0, errors: ["Spreadsheet is empty"] };

  const sheet = workbook.Sheets[sheetName];
  const json: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });

  const pick = (row: Record<string, unknown>, keys: string[]): unknown => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== "") return row[key];
    }
    return undefined;
  };

  const rows: ParsedRow[] = [];
  let totalAmount = new Decimal(0);

  json.forEach((row, index) => {
    const rowNum = index + 2; // Assuming header is row 1
    
    const description = String(
      pick(row, ["description", "Description", "item", "Item", "Item Description"]) ?? "",
    ).trim();

    if (!description) {
      errors.push(`Row ${rowNum}: Missing description or item name.`);
      return;
    }

    const rawQty = pick(row, ["quantity", "Quantity", "qty", "Qty"]);
    let quantity = Number(rawQty);
    if (isNaN(quantity) || quantity <= 0) {
      errors.push(`Row ${rowNum}: Missing or invalid quantity.`);
      return;
    }

    const rawPrice = pick(row, ["unitPrice", "Unit Price", "unit_price", "price", "Price"]);
    const unitPriceStr = rawPrice !== undefined ? String(rawPrice).replace(/,/g, '') : null;
    let unitPrice = unitPriceStr ? Number(unitPriceStr) : null;

    const rawAmount = pick(row, ["amount", "Amount", "total", "Total", "Line Total"]);
    const amountStr = rawAmount !== undefined ? String(rawAmount).replace(/,/g, '') : null;
    let amount = amountStr ? Number(amountStr) : null;

    // Strict validation: we must be able to derive amount or unit price
    if (amount === null && unitPrice !== null) {
      amount = new Decimal(quantity).times(unitPrice).toNumber();
    } else if (unitPrice === null && amount !== null) {
      unitPrice = new Decimal(amount).dividedBy(quantity).toNumber();
    }

    if (amount === null || isNaN(amount) || unitPrice === null || isNaN(unitPrice)) {
      errors.push(`Row ${rowNum}: Missing or invalid price/amount.`);
      return;
    }

    const preciseAmount = new Decimal(amount).toDecimalPlaces(2).toNumber();
    const preciseUnitPrice = new Decimal(unitPrice).toDecimalPlaces(2).toNumber();

    rows.push({
      description,
      quantity,
      unitPrice: preciseUnitPrice,
      amount: preciseAmount,
    });

    totalAmount = totalAmount.plus(preciseAmount);
  });

  return { rows, total: totalAmount.toNumber(), errors };
}
