import * as XLSX from "xlsx";

export interface ParsedRow {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ParsedDocument {
  rows: ParsedRow[];
  total: number;
}

/**
 * Parses an uploaded .xlsx or .csv file into normalized line items.
 *
 * Businesses rarely agree on column names, so this reads the first sheet
 * and heuristically matches common header variants (description/item,
 * quantity/qty, unitPrice/price, amount/total). If a spreadsheet uses
 * something wildly different, rows still come through with best-effort
 * defaults rather than failing the whole upload — flagging genuinely
 * unparseable files is a good next iteration once real business data
 * shows which formats actually show up (see Phase 00/11 of the build plan).
 */
export function parseSpreadsheet(buffer: Buffer): ParsedDocument {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { rows: [], total: 0 };

  const sheet = workbook.Sheets[sheetName];
  const json: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const pick = (row: Record<string, unknown>, keys: string[]): unknown => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== "") return row[key];
    }
    return undefined;
  };

  const rows: ParsedRow[] = json.map((row) => {
    const description = String(
      pick(row, ["description", "Description", "item", "Item", "Item Description"]) ?? "Line item"
    );
    const quantity = Number(pick(row, ["quantity", "Quantity", "qty", "Qty"]) ?? 1) || 1;
    let unitPrice = Number(
      pick(row, ["unitPrice", "Unit Price", "unit_price", "price", "Price"]) ?? 0
    ) || 0;
    let amount = Number(pick(row, ["amount", "Amount", "total", "Total", "Line Total"]) ?? 0) || 0;

    if (!amount && (quantity || unitPrice)) amount = quantity * unitPrice;
    if (!unitPrice && quantity) unitPrice = amount / quantity;

    return { description, quantity, unitPrice, amount };
  });

  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  return { rows, total };
}
