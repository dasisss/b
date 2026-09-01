"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenText,
  ExternalLink,
  FileText,
  Library,
  Quote,
  ScrollText,
} from "lucide-react";
import type { Publication } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TYPE_STYLES: Record<string, string> = {
  "مقال محكّم": "bg-primary/10 text-primary border-primary/20",
  كتاب: "bg-accent/15 text-accent-foreground border-accent/40",
  "فصل في كتاب": "bg-secondary text-secondary-foreground border-secondary-foreground/20",
  أطروحة: "bg-primary/10 text-primary border-primary/20",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  "مقال محكّم": FileText,
  كتاب: Library,
  "فصل في كتاب": BookOpenText,
  أطروحة: ScrollText,
};

export function Research({ publications }: { publications: Publication[] }) {
  const types = useMemo(() => {
    const set = new Set<string>();
    publications.forEach((p) => set.add(p.type));
    return ["الكل", ...Array.from(set)];
  }, [publications]);

  const [active, setActive] = useState("الكل");

  const filtered = useMemo(() => {
    if (active === "الكل") return publications;
    return publications.filter((p) => p.type === active);
  }, [active, publications]);

  return (
    <section
      id="research"
      className="scroll-mt-24 bg-arabesque py-20 sm:py-24 lg:py-28"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="الإنتاج العلمي"
          title="البحوث والمنشورات"
          description="مختارة من الأعمال العلمية المحكّمة المنشورة في مجلات قانونية وطنية ودولية."
        />

        {/* Filter tabs */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="تصفية المنشورات"
        >
          {types.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={active === t}
              onClick={() => setActive(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active === t
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/70 bg-card text-foreground/75 hover:border-primary/40 hover:text-primary",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => {
              const Icon = TYPE_ICONS[p.type] ?? FileText;
              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border text-xs font-semibold",
                        TYPE_STYLES[p.type] ??
                          "bg-primary/10 text-primary border-primary/20",
                      )}
                    >
                      {p.type}
                    </Badge>
                  </div>

                  <h3 className="font-amiri text-lg font-bold leading-snug text-foreground">
                    {p.title}
                  </h3>

                  {p.abstract ? (
                    <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                      <Quote className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      <span className="line-clamp-3">{p.abstract}</span>
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    {p.venue ? (
                      <span className="inline-flex items-center gap-1 font-medium text-foreground/70">
                        <BookOpenText className="size-3.5 text-primary" />
                        {p.venue}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 font-semibold text-foreground/70">
                      {p.year}
                    </span>
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-auto inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        الاطّلاع
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            لا توجد منشورات في هذا التصنيف حالياً.
          </p>
        ) : null}
      </div>
    </section>
  );
}
