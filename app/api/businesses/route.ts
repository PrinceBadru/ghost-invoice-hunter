import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// Businesses tracked inside the caller's environment — departments, or
// outside companies whose invoices are processed here. Never a separate
// tenant; always scoped to environmentId.
const schema = z.object({
  name: z.string().min(1),
  vendorCode: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.business.findFirst({
    where: { environmentId: currentUser.environmentId, vendorCode: parsed.data.vendorCode },
  });
  if (existing) {
    return NextResponse.json({ error: "A business with that code already exists in this environment" }, { status: 409 });
  }

  const business = await prisma.business.create({
    data: { ...parsed.data, environmentId: currentUser.environmentId },
  });

  await prisma.auditLog.create({
    data: {
      environmentId: currentUser.environmentId,
      userId: currentUser.id,
      action: `Added tracked business ${business.name} (${business.vendorCode})`,
    },
  });

  return NextResponse.json(business);
}
