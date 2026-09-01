import { NextResponse } from "next/server";
import {
  getProfessor,
  getCourses,
  getPublications,
  getOfficeHours,
  getNews,
} from "@/lib/data";

// Public site data endpoint — useful for any future admin/external consumer.
// Returns the full public payload for the first professor.
export async function GET() {
  const professor = await getProfessor();
  if (!professor) {
    return NextResponse.json(
      { ok: false, error: "لا توجد بيانات أستاذ بعد." },
      { status: 404 },
    );
  }
  const [courses, publications, officeHours, news] = await Promise.all([
    getCourses(professor.id),
    getPublications(professor.id),
    getOfficeHours(professor.id),
    getNews(professor.id),
  ]);

  return NextResponse.json({
    ok: true,
    professor,
    courses,
    publications,
    officeHours,
    news,
  });
}
