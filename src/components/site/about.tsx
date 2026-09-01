"use client";

import { motion } from "framer-motion";
import { GraduationCap, Microscope, Quote } from "lucide-react";
import type { Professor } from "@/lib/types";
import { SectionHeading } from "./section-heading";

export function About({ professor }: { professor: Professor }) {
  const educationLines = professor.education
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const interests = professor.researchInterests
    .split(/[,،\n]/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="السيرة الأكاديمية"
          title="نبذة عن الأستاذ"
          description="مسيرة أكاديمية وبحثية في خدمة العلوم القانونية والقضاء الجزائري."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          {/* Long bio */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8"
          >
            <Quote
              className="absolute -top-4 right-6 size-9 rounded-full border border-accent/40 bg-card p-1.5 text-accent shadow-sm"
              aria-hidden
            />
            <p className="whitespace-pre-line text-base leading-loose text-foreground/85">
              {professor.longBio}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-4 text-primary" />
                {professor.rank}
              </span>
              <span className="text-border">•</span>
              <span>{professor.faculty}</span>
              <span className="text-border">•</span>
              <span>{professor.university}</span>
            </div>
          </motion.div>

          {/* Right column: education + research interests */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-amiri text-xl font-bold text-foreground">
                <GraduationCap className="size-5 text-primary" />
                التكوين الأكاديمي
              </h3>
              <ol className="mt-4 space-y-3">
                {educationLines.map((line, i) => {
                  const [year, ...rest] = line.split("—");
                  const detail = rest.join("—").trim() || line;
                  return (
                    <li
                      key={i}
                      className="relative pr-4 text-sm leading-relaxed text-foreground/85"
                    >
                      <span
                        className="absolute right-0 top-2 h-2 w-2 rounded-full bg-accent"
                        aria-hidden
                      />
                      {rest.length > 0 ? (
                        <>
                          <span className="ml-1 font-bold text-primary">
                            {year.trim()}
                          </span>
                          — {detail}
                        </>
                      ) : (
                        detail
                      )}
                    </li>
                  );
                })}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-amiri text-xl font-bold text-foreground">
                <Microscope className="size-5 text-primary" />
                اهتمامات بحثية
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {interests.map((it, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
