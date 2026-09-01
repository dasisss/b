"use client";

import { motion } from "framer-motion";
import { Clock, DoorOpen, Info, CalendarClock } from "lucide-react";
import type { OfficeHour } from "@/lib/types";
import { SectionHeading } from "./section-heading";

const DAY_TINT: Record<string, string> = {
  الأحد: "from-primary/15 to-primary/5",
  الإثنين: "from-accent/20 to-accent/5",
  الثلاثاء: "from-primary/15 to-primary/5",
  الأربعاء: "from-accent/20 to-accent/5",
  الخميس: "from-primary/15 to-primary/5",
  الجمعة: "from-secondary to-secondary/40",
  السبت: "from-secondary to-secondary/40",
};

export function OfficeHours({ hours }: { hours: OfficeHour[] }) {
  return (
    <section
      id="office-hours"
      className="scroll-mt-24 bg-arabesque py-20 sm:py-24 lg:py-28"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="استقبال الطلبة"
          title="الساعات المكتبية"
          description="أوقات مخصّصة لاستقبال الطلبة والباحثين لمناقشة الأعمال الجامعية والإجابة عن الاستفسارات."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Schedule */}
          <div className="grid gap-3 sm:grid-cols-2">
            {hours.length === 0 ? (
              <p className="col-span-full rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-muted-foreground">
                لا توجد ساعات مكتبية مبرمجة حالياً.
              </p>
            ) : (
              hours.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-bl ${
                    DAY_TINT[h.day] ?? "from-primary/10 to-transparent"
                  } p-5 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-amiri text-xl font-bold text-foreground">
                      {h.day}
                    </span>
                    <span className="grid size-9 place-items-center rounded-full bg-card text-primary shadow-sm ring-1 ring-primary/15">
                      <CalendarClock className="size-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-base font-semibold text-primary">
                    <Clock className="size-4" />
                    {h.startTime} — {h.endTime}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {h.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <DoorOpen className="size-3.5" />
                        {h.location}
                      </span>
                    ) : null}
                    {h.note ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Info className="size-3.5" />
                        {h.note}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Info card */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary text-primary-foreground p-6 shadow-lg sm:p-7"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
              <Info className="size-3.5" />
              ملاحظات مهمة
            </span>
            <h3 className="font-amiri text-2xl font-bold leading-snug">
              تنظيم اللقاءات العلمية
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-primary-foreground/90">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                يُرجى الالتزام بمواعيد الساعات المكتبية والقدوم في الوقت المحدد.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                لمناقشة الأعمال الجامعية (مذكرة، أطروحة) يُفضَّل تحديد موعد مسبق
                عبر البريد الإلكتروني.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                تُلغى الساعات المكتبية خلال فترات العطل الرسمية والعطلة الأسبوعية.
              </li>
            </ul>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
