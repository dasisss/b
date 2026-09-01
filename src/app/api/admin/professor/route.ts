import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type ProfileUpdate = {
  fullName: string;
  title: string;
  rank: string;
  university: string;
  faculty: string;
  department: string;
  email: string;
  phone: string | null;
  office: string | null;
  avatarUrl: string | null;
  shortBio: string;
  longBio: string;
  education: string;
  researchInterests: string;
  yearsExperience: number;
  publicationsCount: number;
  supervisedTheses: number;
  coursesCount: number;
};

export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }
  let body: Partial<ProfileUpdate>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة." }, { status: 400 });
  }
  const prof = await db.professor.findFirst({ orderBy: { createdAt: "asc" } });
  if (!prof) {
    return NextResponse.json({ error: "لا يوجد ملف أستاذ." }, { status: 404 });
  }
  const num = (v: unknown, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  try {
    const updated = await db.professor.update({
      where: { id: prof.id },
      data: {
        fullName: body.fullName ?? prof.fullName,
        title: body.title ?? prof.title,
        rank: body.rank ?? prof.rank,
        university: body.university ?? prof.university,
        faculty: body.faculty ?? prof.faculty,
        department: body.department ?? prof.department,
        email: body.email ?? prof.email,
        phone: body.phone ?? prof.phone,
        office: body.office ?? prof.office,
        avatarUrl: body.avatarUrl ?? prof.avatarUrl,
        shortBio: body.shortBio ?? prof.shortBio,
        longBio: body.longBio ?? prof.longBio,
        education: body.education ?? prof.education,
        researchInterests: body.researchInterests ?? prof.researchInterests,
        yearsExperience: num(body.yearsExperience, prof.yearsExperience),
        publicationsCount: num(body.publicationsCount, prof.publicationsCount),
        supervisedTheses: num(body.supervisedTheses, prof.supervisedTheses),
        coursesCount: num(body.coursesCount, prof.coursesCount),
      },
    });
    return NextResponse.json({ ok: true, professor: updated });
  } catch {
    return NextResponse.json({ error: "فشل تحديث الملف." }, { status: 500 });
  }
}
