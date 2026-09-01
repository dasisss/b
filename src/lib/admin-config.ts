// Field + entity definitions for the generic admin CRUD manager.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "date"
  | "time"
  | "url"
  | "email";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  full?: boolean; // span full width in the 2-col grid
  placeholder?: string;
};

export type Column = {
  name: string;
  label: string;
  render?: (row: Record<string, unknown>) => string;
};

export type EntityConfig = {
  key: "news" | "officeHours" | "courses" | "publications";
  title: string; // الجمع
  singular: string; // مفرد
  endpoint: string; // base admin endpoint
  fields: Field[];
  columns: Column[];
};

// Shared option lists
const DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const LEVELS = ["ليسانس", "ماستر", "دكتوراه"];
const SEMESTERS = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"];
const PUB_TYPES = ["مقال محكّم", "كتاب", "فصل في كتاب", "أطروحة"];
const NEWS_CATEGORIES = ["إعلان", "ندوة", "منشور", "نشاط"];

export const entityConfigs: Record<string, EntityConfig> = {
  news: {
    key: "news",
    title: "الأخبار والأنشطة",
    singular: "خبر",
    endpoint: "/api/admin/news",
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true, full: true },
      { name: "category", label: "التصنيف", type: "select", options: NEWS_CATEGORIES, required: true },
      { name: "date", label: "التاريخ", type: "date", required: true },
      { name: "excerpt", label: "المقتطف", type: "textarea", required: true, full: true },
      { name: "body", label: "النص الكامل (اختياري)", type: "textarea", full: true },
    ],
    columns: [
      { name: "title", label: "العنوان" },
      { name: "category", label: "التصنيف" },
      {
        name: "date",
        label: "التاريخ",
        render: (r) => {
          try {
            return new Intl.DateTimeFormat("ar-DZ", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(r.date as string));
          } catch {
            return String(r.date ?? "");
          }
        },
      },
    ],
  },

  officeHours: {
    key: "officeHours",
    title: "الساعات المكتبية",
    singular: "موعد",
    endpoint: "/api/admin/office-hours",
    fields: [
      { name: "day", label: "اليوم", type: "select", options: DAYS, required: true },
      { name: "startTime", label: "من الساعة", type: "time", required: true },
      { name: "endTime", label: "إلى الساعة", type: "time", required: true },
      { name: "location", label: "المكان", type: "text", full: true },
      { name: "note", label: "ملاحظة", type: "text", full: true },
    ],
    columns: [
      { name: "day", label: "اليوم" },
      { name: "startTime", label: "من" },
      { name: "endTime", label: "إلى" },
      { name: "location", label: "المكان" },
    ],
  },

  courses: {
    key: "courses",
    title: "المواد المدرّسة",
    singular: "مادة",
    endpoint: "/api/admin/courses",
    fields: [
      { name: "title", label: "عنوان المادة", type: "text", required: true, full: true },
      { name: "level", label: "المستوى", type: "select", options: LEVELS, required: true },
      { name: "semester", label: "الفصل", type: "select", options: SEMESTERS, required: true },
      { name: "credits", label: "الأرصدة", type: "number", required: true },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "syllabus", label: "المفردات (اختياري)", type: "textarea", full: true },
    ],
    columns: [
      { name: "title", label: "العنوان" },
      { name: "level", label: "المستوى" },
      { name: "semester", label: "الفصل" },
      { name: "credits", label: "الأرصدة", render: (r) => String(r.credits ?? "") },
    ],
  },

  publications: {
    key: "publications",
    title: "البحوث والمنشورات",
    singular: "منشور",
    endpoint: "/api/admin/publications",
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true, full: true },
      { name: "type", label: "النوع", type: "select", options: PUB_TYPES, required: true },
      { name: "year", label: "السنة", type: "number", required: true },
      { name: "venue", label: "المجلة / الناشر", type: "text", full: true },
      { name: "doi", label: "DOI (اختياري)", type: "text" },
      { name: "link", label: "رابط (اختياري)", type: "url", full: true },
      { name: "abstract", label: "الملخص (اختياري)", type: "textarea", full: true },
    ],
    columns: [
      { name: "title", label: "العنوان" },
      { name: "type", label: "النوع" },
      { name: "year", label: "السنة", render: (r) => String(r.year ?? "") },
    ],
  },
};
