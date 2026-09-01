import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  let body: { isRead?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // allow empty body to toggle
  }
  try {
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "الرسالة غير موجودة." }, { status: 404 });
    const next = body.isRead !== undefined ? body.isRead : !existing.isRead;
    const updated = await db.contactMessage.update({
      where: { id },
      data: { isRead: next },
    });
    return NextResponse.json({ ok: true, isRead: updated.isRead });
  } catch {
    return NextResponse.json({ error: "فشل التحديث." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذّر الحذف." }, { status: 404 });
  }
}
