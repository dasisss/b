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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<NewsInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  try {
    const updated = await db.newsItem.update({
      where: { id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        body: body.body,
        date: body.date ? new Date(body.date) : undefined,
        category: body.category,
      },
    });
    return NextResponse.json({ ok: true, news: updated });
  } catch {
    return NextResponse.json({ error: "الخبر غير موجود أو فشل التحديث." }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.newsItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذّر الحذف." }, { status: 404 });
  }
}
