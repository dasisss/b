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

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  let body: CourseInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  if (!body.title || !body.level) {
    return NextResponse.json({ error: "العنوان والمستوى مطلوبان." }, { status: 422 });
  }
  const prof = await db.professor.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!prof) return NextResponse.json({ error: "لا يوجد أستاذ." }, { status: 404 });
  try {
    const created = await db.course.create({
      data: {
        professorId: prof.id,
        title: body.title,
        level: body.level,
        semester: body.semester ?? "",
        credits: Number(body.credits) || 0,
        description: body.description ?? "",
        syllabus: body.syllabus ?? null,
      },
    });
    return NextResponse.json({ ok: true, course: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء المادة." }, { status: 500 });
  }
}
