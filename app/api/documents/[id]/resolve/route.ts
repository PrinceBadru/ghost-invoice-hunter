import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const { action, note } = await req.json();

    if (!action || !["RESOLVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be RESOLVE or REJECT." },
        { status: 400 }
      );
    }

    if (!note || note.trim().length === 0) {
      return NextResponse.json(
        { error: "A resolution note is required." },
        { status: 400 }
      );
    }

    const doc = await prisma.document.findFirst({
      where: { id, environmentId: user.environmentId, type: "INVOICE" },
      include: { business: true },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const newStatus = action === "RESOLVE" ? "Resolved" : "Rejected";

    await prisma.$transaction(async (tx) => {
      // 1. Update the document status
      await tx.document.update({
        where: { id },
        data: { status: newStatus },
      });

      // 2. Update any discrepancies
      await tx.discrepancy.updateMany({
        where: { invoiceDocId: id },
        data: {
          status: newStatus,
          resolutionNote: note,
        },
      });

      // 3. Log the action
      await tx.auditLog.create({
        data: {
          environmentId: user.environmentId,
          userId: user.id,
          action: `${action === "RESOLVE" ? "Resolved" : "Rejected"} invoice ${doc.reference}`,
          detail: note,
          reason: `Manual override by ${user.name}`,
        },
      });
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Resolution error:", error);
    return NextResponse.json(
      { error: "Failed to resolve document" },
      { status: 500 }
    );
  }
}
