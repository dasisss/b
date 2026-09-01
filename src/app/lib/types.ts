// Shared types for the law professor website, aligned with the Prisma schema.

export type Professor = {
  id: string;
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

export type Course = {
  id: string;
  title: string;
  level: string;
  semester: string;
  credits: number;
  description: string;
  syllabus: string | null;
};

export type Publication = {
  id: string;
  title: string;
  type: string;
  venue: string | null;
  year: number;
  doi: string | null;
  abstract: string | null;
  link: string | null;
};

export type OfficeHour = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string | null;
  note: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string | null;
  date: string; // ISO string
  category: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
