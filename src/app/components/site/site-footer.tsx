import { Mail, MapPin, Phone, Scale } from "lucide-react";
import type { Professor } from "@/lib/types";

type Props = { professor: Professor };

const NAV = [
  { href: "#about", label: "نبذة" },
  { href: "#research", label: "البحوث" },
  { href: "#teaching", label: "التدريس" },
  { href: "#office-hours", label: "الساعات المكتبية" },
  { href: "#news", label: "الأخبار" },
  { href: "#contact", label: "اتصل" },
];

export function SiteFooter({ professor }: Props) {
  const year = new Intl.DateTimeFormat("ar-DZ", { year: "numeric" }).format(
    new Date(),
  );

  return (
    <footer
      className="mt-auto border-t border-primary/20 bg-primary text-primary-foreground"
      aria-label="تذييل الصفحة"
    >
      <div className="h-1.5 w-full bg-gradient-to-l from-accent via-primary-foreground/40 to-accent" />
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
                <Scale className="size-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-amiri text-lg font-bold">
                  {professor.fullName}
                </span>
                <span className="text-xs text-primary-foreground/75">
                  {professor.title}
                </span>
              </span>
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              {professor.faculty}، {professor.university}. موقع أكاديمي لنشر
              الإنتاج العلمي والتفاعل مع الطلبة والباحثين.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <h3 className="font-amiri text-base font-bold">روابط سريعة</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-amiri text-base font-bold">معلومات التواصل</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/85">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-accent" />
                <span dir="ltr">{professor.email}</span>
              </li>
              {professor.phone ? (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-accent" />
                  <span dir="ltr">{professor.phone}</span>
                </li>
              ) : null}
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  {professor.faculty}
                  {professor.office ? ` — ${professor.office}` : ""}
                  <br />
                  {professor.university}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-center sm:flex-row sm:text-right">
          <p className="text-xs text-primary-foreground/70">
            © {year} {professor.fullName}. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-primary-foreground/70">
            صُمِّم بكل احتراف لخدمة البحث العلمي في الجزائر.
          </p>
        </div>
      </div>
    </footer>
  );
}
