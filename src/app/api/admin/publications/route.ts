import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type PubInput = {
  title: string;
  type: string;
  venue?: string | null;
  year: number;
  doi?: string | null;
  abstract?: string | null;
  link?: string | null;
};

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  let body: PubInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  if (!body.title || !body.type) {
    return NextResponse.json({ error: "العنوان والنوع مطلوبان." }, { status: 422 });
  }
  const prof = await db.professor.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!prof) return NextResponse.json({ error: "لا يوجد أستاذ." }, { status: 404 });
  try {
    const created = await db.publication.create({
      data: {
        professorId: prof.id,
        title: body.title,
        type: body.type,
        venue: body.venue ?? null,
        year: Number(body.year) || new Date().getFullYear(),
        doi: body.doi ?? null,
        abstract: body.abstract ?? null,
        link: body.link ?? null,
      },
    });
    return NextResponse.json({ ok: true, publication: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء المنشور." }, { status: 500 });
  }
}
