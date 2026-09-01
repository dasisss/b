"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpenText,
  GraduationCap,
  Users,
} from "lucide-react";
import type { Professor } from "@/lib/types";

type Stat = {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
};

export function Stats({ professor }: { professor: Professor }) {
  const stats: Stat[] = [
    {
      icon: Award,
      value: professor.yearsExperience,
      label: "سنوات الخبرة الأكاديمية",
      suffix: "+",
    },
    {
      icon: BookOpenText,
      value: professor.publicationsCount,
      label: "منشور علمي محكّم",
      suffix: "+",
    },
    {
      icon: Users,
      value: professor.supervisedTheses,
      label: "أطروحة مُوجَّهة",
      suffix: "+",
    },
    {
      icon: GraduationCap,
      value: professor.coursesCount,
      label: "مادة مدرّسة",
    },
  ];

  return (
    <section
      className="relative -mt-10 z-10"
      aria-label="إحصائيات"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-lg sm:gap-4 sm:p-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-colors hover:bg-primary/5 sm:gap-3"
            >
              <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary sm:size-12">
                <s.icon className="size-5 sm:size-6" />
              </span>
              <span className="font-amiri text-3xl font-bold text-foreground sm:text-4xl">
                {s.value}
                {s.suffix ?? ""}
              </span>
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
