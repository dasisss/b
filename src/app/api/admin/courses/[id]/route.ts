import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type CourseInput = {
  title: string;
  level: string;
  semester: string;
  credits: number;
  description: string;
  syllabus?: string | null;
};

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<CourseInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  try {
    const updated = await db.course.update({
      where: { id },
      data: {
        title: body.title,
        level: body.level,
        semester: body.semester,
        credits: body.credits !== undefined ? Number(body.credits) : undefined,
        description: body.description,
        syllabus: body.syllabus,
      },
    });
    return NextResponse.json({ ok: true, course: updated });
  } catch {
    return NextResponse.json({ error: "المادة غير موجودة أو فشل التحديث." }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.course.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذّر الحذف." }, { status: 404 });
  }
}
