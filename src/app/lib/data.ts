import { db } from "@/lib/db";
import type {
  Professor,
  Course,
  Publication,
  OfficeHour,
  NewsItem,
} from "@/lib/types";

// Ordered days of the week for the office hours schedule (Algeria work week
// runs Sunday → Thursday).
const DAY_ORDER: Record<string, number> = {
  الأحد: 0,
  الإثنين: 1,
  الثلاثاء: 2,
  الأربعاء: 3,
  الخميس: 4,
  الجمعة: 5,
  السبت: 6,
};

export async function getProfessor(): Promise<Professor | null> {
  const row = await db.professor.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.fullName,
    title: row.title,
    rank: row.rank,
    university: row.university,
    faculty: row.faculty,
    department: row.department,
    email: row.email,
    phone: row.phone,
    office: row.office,
    avatarUrl: row.avatarUrl,
    shortBio: row.shortBio,
    longBio: row.longBio,
    education: row.education,
    researchInterests: row.researchInterests,
    yearsExperience: row.yearsExperience,
    publicationsCount: row.publicationsCount,
    supervisedTheses: row.supervisedTheses,
    coursesCount: row.coursesCount,
  };
}

export async function getCourses(professorId: string): Promise<Course[]> {
  const rows = await db.course.findMany({
    where: { professorId },
    orderBy: [{ level: "asc" }, { semester: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    level: r.level,
    semester: r.semester,
    credits: r.credits,
    description: r.description,
    syllabus: r.syllabus,
  }));
}

export async function getPublications(
  professorId: string,
): Promise<Publication[]> {
  const rows = await db.publication.findMany({
    where: { professorId },
    orderBy: { year: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    venue: r.venue,
    year: r.year,
    doi: r.doi,
    abstract: r.abstract,
    link: r.link,
  }));
}

export async function getOfficeHours(
  professorId: string,
): Promise<OfficeHour[]> {
  const rows = await db.officeHour.findMany({ where: { professorId } });
  return rows
    .map((r) => ({
      id: r.id,
      day: r.day,
      startTime: r.startTime,
      endTime: r.endTime,
      location: r.location,
      note: r.note,
    }))
    .sort(
      (a, b) =>
        (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99) ||
        a.startTime.localeCompare(b.startTime),
    );
}

export async function getNews(professorId: string): Promise<NewsItem[]> {
  const rows = await db.newsItem.findMany({
    where: { professorId },
    orderBy: { date: "desc" },
    take: 6,
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body,
    date: r.date.toISOString(),
    category: r.category,
  }));
}
