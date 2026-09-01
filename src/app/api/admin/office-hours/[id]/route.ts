import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type HourInput = {
  day: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  note?: string | null;
};

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<HourInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  try {
    const updated = await db.officeHour.update({
      where: { id },
      data: {
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location,
        note: body.note,
      },
    });
    return NextResponse.json({ ok: true, officeHour: updated });
  } catch {
    return NextResponse.json({ error: "غير موجود أو فشل التحديث." }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.officeHour.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذّر الحذف." }, { status: 404 });
  }
}
