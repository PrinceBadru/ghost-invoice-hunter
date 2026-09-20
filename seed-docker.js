const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const passwordHash =
    "$2a$10$M0kUXwWYF2jDo2ofzF9qXeKqYjpHw2A05uY.nJlWCDal9nh6YEu1O";

  const existing = await prisma.user.findUnique({
    where: { email: "sarah@acme.test" },
  });
  if (existing) {
    console.log("Database already seeded. Skipping seed script.");
    return;
  }

  const environment = await prisma.environment.create({
    data: {
      name: "Acme Financial Operations",
      toleranceThreshold: 5.0,
      users: {
        create: [
          {
            name: "Sarah K.",
            email: "sarah@acme.test",
            passwordHash,
            role: "MASTER",
          },
          {
            name: "Jane A.",
            email: "jane@acme.test",
            passwordHash,
            role: "ADMIN",
          },
          {
            name: "Bob V.",
            email: "bob@acme.test",
            passwordHash,
            role: "VIEWER",
          },
        ],
      },
    },
    include: { users: true },
  });
  const master = environment.users.find((u) => u.role === "MASTER");

  const david = await prisma.user.create({
    data: {
      name: "David M.",
      email: "david@acme.test",
      passwordHash,
      role: "UPLOADER",
      environmentId: environment.id,
    },
  });

  const acmeLogistics = await prisma.business.create({
    data: {
      name: "Acme Logistics",
      vendorCode: "VEN-1001",
      environmentId: environment.id,
    },
  });
  const globalTech = await prisma.business.create({
    data: {
      name: "Global Tech Inc",
      vendorCode: "VEN-1002",
      environmentId: environment.id,
    },
  });
  const vertexCloud = await prisma.business.create({
    data: {
      name: "Vertex Cloud Services",
      vendorCode: "VEN-1003",
      environmentId: environment.id,
    },
  });

  // --- Acme Logistics: PO -> Invoice with a price discrepancy ---
  await prisma.document.create({
    data: {
      type: "PURCHASE_ORDER",
      reference: "PO-8825",
      fileName: "po-8825.xlsx",
      totalAmount: 12000,
      status: "Matched",
      environmentId: environment.id,
      businessId: acmeLogistics.id,
      uploadedById: master.id,
      lineItems: {
        create: [
          {
            description: "Freight services — Q3",
            quantity: 1,
            unitPrice: 12000,
            amount: 12000,
          },
        ],
      },
    },
  });
  await prisma.document.create({
    data: {
      type: "QUOTE",
      reference: "Q-4410",
      fileName: "quote-4410.xlsx",
      totalAmount: 12000,
      status: "Matched",
      environmentId: environment.id,
      businessId: acmeLogistics.id,
      uploadedById: master.id,
      lineItems: {
        create: [
          {
            description: "Freight services — Q3",
            quantity: 1,
            unitPrice: 12000,
            amount: 12000,
          },
        ],
      },
    },
  });
  const inv1 = await prisma.document.create({
    data: {
      type: "INVOICE",
      reference: "INV-10492",
      linkedPoRef: "PO-8825",
      linkedQuoteRef: "Q-4410",
      fileName: "invoice-10492.xlsx",
      totalAmount: 12850,
      status: "Discrepancy",
      environmentId: environment.id,
      businessId: acmeLogistics.id,
      uploadedById: david.id,
      lineItems: {
        create: [
          {
            description: "Freight services — Q3",
            quantity: 1,
            unitPrice: 12850,
            amount: 12850,
          },
        ],
      },
    },
  });

  // --- Global Tech Inc: smaller variance ---
  await prisma.document.create({
    data: {
      type: "PURCHASE_ORDER",
      reference: "PO-7710",
      fileName: "po-7710.xlsx",
      totalAmount: 4100,
      status: "Matched",
      environmentId: environment.id,
      businessId: globalTech.id,
      uploadedById: master.id,
      lineItems: {
        create: [
          {
            description: "Cloud subscription",
            quantity: 1,
            unitPrice: 4100,
            amount: 4100,
          },
        ],
      },
    },
  });
  const inv2 = await prisma.document.create({
    data: {
      type: "INVOICE",
      reference: "INV-10488",
      linkedPoRef: "PO-7710",
      fileName: "invoice-10488.xlsx",
      totalAmount: 4185,
      status: "Discrepancy",
      environmentId: environment.id,
      businessId: globalTech.id,
      uploadedById: david.id,
      lineItems: {
        create: [
          {
            description: "Cloud subscription",
            quantity: 1,
            unitPrice: 4185,
            amount: 4185,
          },
        ],
      },
    },
  });

  // --- Vertex Cloud Services: clean match ---
  await prisma.document.create({
    data: {
      type: "PURCHASE_ORDER",
      reference: "PO-6602",
      fileName: "po-6602.xlsx",
      totalAmount: 8230,
      status: "Matched",
      environmentId: environment.id,
      businessId: vertexCloud.id,
      uploadedById: master.id,
      lineItems: {
        create: [
          {
            description: "Managed hosting",
            quantity: 1,
            unitPrice: 8230,
            amount: 8230,
          },
        ],
      },
    },
  });
  const inv3 = await prisma.document.create({
    data: {
      type: "INVOICE",
      reference: "INV-10450",
      linkedPoRef: "PO-6602",
      fileName: "invoice-10450.xlsx",
      totalAmount: 8230,
      status: "Matched",
      environmentId: environment.id,
      businessId: vertexCloud.id,
      uploadedById: david.id,
      lineItems: {
        create: [
          {
            description: "Managed hosting",
            quantity: 1,
            unitPrice: 8230,
            amount: 8230,
          },
        ],
      },
    },
  });

  // Create Discrepancy objects
  await prisma.discrepancy.create({
    data: {
      invoiceDocId: inv1.id,
      poReference: "PO-8825",
      poAmount: 12000,
      invoiceAmount: 12850,
      variance: 850,
      variancePercent: 7.08,
      severity: "High",
      status: "Discrepancy",
      reasons: JSON.stringify(["Price variance exceeds 5% threshold"]),
      environmentId: environment.id,
    },
  });

  await prisma.discrepancy.create({
    data: {
      invoiceDocId: inv2.id,
      poReference: "PO-7710",
      poAmount: 4100,
      invoiceAmount: 4185,
      variance: 85,
      variancePercent: 2.07,
      severity: "Low",
      status: "Needs Review",
      reasons: JSON.stringify([
        "Price variance is within threshold but requires review",
      ]),
      environmentId: environment.id,
    },
  });

  console.log("Seeded environment:", environment.name);
  console.log("Login as:", master.email, "/ password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
