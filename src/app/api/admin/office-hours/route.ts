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

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  let body: HourInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  if (!body.day || !body.startTime || !body.endTime) {
    return NextResponse.json({ error: "اليوم والوقت من وإلى مطلوبة." }, { status: 422 });
  }
  const prof = await db.professor.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!prof) return NextResponse.json({ error: "لا يوجد أستاذ." }, { status: 404 });
  try {
    const created = await db.officeHour.create({
      data: {
        professorId: prof.id,
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location ?? null,
        note: body.note ?? null,
      },
    });
    return NextResponse.json({ ok: true, officeHour: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الساعة المكتبية." }, { status: 500 });
  }
}
