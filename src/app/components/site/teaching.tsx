"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, CalendarDays, FileText, Layers } from "lucide-react";
import type { Course } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

const LEVEL_ORDER: Record<string, number> = {
  ليسانس: 0,
  ماستر: 1,
  دكتوراه: 2,
};

const LEVEL_BADGE: Record<string, string> = {
  ليسانس: "bg-primary/10 text-primary border-primary/25",
  ماستر: "bg-accent/15 text-accent-foreground border-accent/40",
  دكتوراه: "bg-primary/15 text-primary border-primary/30",
};

export function Teaching({ courses }: { courses: Course[] }) {
  const levels = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.level));
    return Array.from(set).sort(
      (a, b) => (LEVEL_ORDER[a] ?? 99) - (LEVEL_ORDER[b] ?? 99),
    );
  }, [courses]);

  const [active, setActive] = useState(levels[0] ?? "ليسانس");

  const filtered = useMemo(
    () => courses.filter((c) => c.level === active),
    [courses, active],
  );

  return (
    <section id="teaching" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="المقررات الدراسية"
          title="التدريس الأكاديمي"
          description="مواد تُدرَّس على مستوى الطور الأول (الليسانس)، الثاني (الماستر) والثالث (الدكتوراه)."
        />

        {/* Level tabs */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="تصفية المواد حسب المستوى"
        >
          {levels.map((lvl) => (
            <button
              key={lvl}
              role="tab"
              aria-selected={active === lvl}
              onClick={() => setActive(lvl)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-semibold transition-all",
                active === lvl
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/70 bg-card text-foreground/75 hover:border-primary/40 hover:text-primary",
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((c) => (
              <motion.article
                key={c.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <BookMarked className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      LEVEL_BADGE[c.level] ??
                        "bg-primary/10 text-primary border-primary/25",
                    )}
                  >
                    {c.level}
                  </span>
                </div>

                <h3 className="font-amiri text-lg font-bold leading-snug text-foreground">
                  {c.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <CalendarDays className="size-3.5 text-primary" />
                    {c.semester}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Layers className="size-3.5 text-primary" />
                    {c.credits} رصيد
                  </span>
                </div>

                {c.syllabus ? (
                  <p className="flex items-start gap-1.5 rounded-lg bg-secondary/70 p-2.5 text-xs leading-relaxed text-foreground/70">
                    <FileText className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {c.syllabus}
                  </p>
                ) : null}
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            لا توجد مواد في هذا المستوى حالياً.
          </p>
        ) : null}
      </div>
    </section>
  );
}
