import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ContactPayload } from "@/lib/types";

// Validation: a simple, dependency-free email regex check.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "صيغة الطلب غير صالحة." },
      { status: 400 },
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "يرجى ملء جميع الحقول المطلوبة." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "عنوان البريد الإلكتروني غير صالح." },
      { status: 422 },
    );
  }
  if (name.length > 120 || subject.length > 200 || message.length > 4000) {
    return NextResponse.json(
      { error: "أحد الحقول يتجاوز الطول المسموح." },
      { status: 422 },
    );
  }

  // Find the professor to attach the message to. If there's none in the DB
  // we still acknowledge the message (the frontend will show success), but we
  // do not persist it — to avoid an orphan record. This is a graceful
  // degradation that keeps the contact flow working even before seeding.
  const professor = await db.professor.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!professor) {
    return NextResponse.json(
      { ok: true, persisted: false, message: "تم استلام الرسالة." },
      { status: 200 },
    );
  }

  try {
    await db.contactMessage.create({
      data: {
        professorId: professor.id,
        name,
        email,
        subject,
        message,
      },
    });
    return NextResponse.json(
      { ok: true, persisted: true, message: "تم حفظ رسالتك بنجاح." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "تعذّر حفظ الرسالة، حاول لاحقاً." },
      { status: 500 },
    );
  }
}
