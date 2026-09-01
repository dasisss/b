import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type NewsInput = {
  title: string;
  excerpt: string;
  body?: string | null;
  date: string; // ISO
  category: string;
};

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  let body: NewsInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  if (!body.title || !body.excerpt) {
    return NextResponse.json({ error: "العنوان والمقتطف مطلوبان." }, { status: 422 });
  }
  const prof = await db.professor.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!prof) return NextResponse.json({ error: "لا يوجد أستاذ." }, { status: 404 });
  try {
    const created = await db.newsItem.create({
      data: {
        professorId: prof.id,
        title: body.title,
        excerpt: body.excerpt,
        body: body.body ?? null,
        date: body.date ? new Date(body.date) : new Date(),
        category: body.category ?? "إعلان",
      },
    });
    return NextResponse.json({ ok: true, news: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الخبر." }, { status: 500 });
  }
}
