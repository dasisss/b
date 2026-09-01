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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<PubInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  try {
    const updated = await db.publication.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        venue: body.venue,
        year: body.year !== undefined ? Number(body.year) : undefined,
        doi: body.doi,
        abstract: body.abstract,
        link: body.link,
      },
    });
    return NextResponse.json({ ok: true, publication: updated });
  } catch {
    return NextResponse.json({ error: "المنشور غير موجود أو فشل التحديث." }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.publication.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذّر الحذف." }, { status: 404 });
  }
}
