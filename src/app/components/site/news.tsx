"use client";

import { motion } from "framer-motion";
import { Bell, CalendarDays, Megaphone, Mic2, Newspaper } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; tint: string }
> = {
  إعلان: { icon: Megaphone, tint: "bg-primary/10 text-primary" },
  ندوة: { icon: Mic2, tint: "bg-accent/15 text-accent-foreground" },
  منشور: { icon: Newspaper, tint: "bg-primary/10 text-primary" },
  نشاط: { icon: Bell, tint: "bg-accent/15 text-accent-foreground" },
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar-DZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function News({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null;

  const [featured, ...rest] = news;

  return (
    <section id="news" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="آخر المستجدات"
          title="الأخبار والأنشطة"
          description="إعلانات الندوات، المؤتمرات، المنشورات والأنشطة العلمية الأخيرة."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-bl from-primary/10 via-card to-card p-7 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg sm:p-8"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" aria-hidden />
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                {(() => {
                  const Icon =
                    CATEGORY_META[featured.category]?.icon ?? Megaphone;
                  return <Icon className="size-6" />;
                })()}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {featured.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {formatDate(featured.date)}
                </span>
              </div>
            </div>
            <h3 className="font-amiri text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              {featured.title}
            </h3>
            <p className="text-base leading-relaxed text-foreground/80">
              {featured.excerpt}
            </p>
            {featured.body ? (
              <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {featured.body}
              </p>
            ) : null}
            <div className="mt-auto h-px gold-divider" aria-hidden />
          </motion.article>

          {/* Rest list */}
          <div className="flex flex-col gap-4">
            {rest.map((n, i) => {
              const meta = CATEGORY_META[n.category] ?? {
                icon: Megaphone,
                tint: "bg-primary/10 text-primary",
              };
              const Icon = meta.icon;
              return (
                <motion.article
                  key={n.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group flex gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      meta.tint,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">
                        {n.category}
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(n.date)}
                      </span>
                    </div>
                    <h4 className="font-amiri text-base font-bold leading-snug text-foreground group-hover:text-primary">
                      {n.title}
                    </h4>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {n.excerpt}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
