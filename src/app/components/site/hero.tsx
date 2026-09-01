"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  MapPin,
  Quote,
  ScrollText,
  Award,
} from "lucide-react";
import type { Professor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { professor: Professor };

export function Hero({ professor }: Props) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-arabesque"
      aria-label="القسم التعريفي"
    >
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-gradient-to-l from-primary via-accent to-primary" />

      {/* Decorative geometric overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.42 0.11 160) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none"
          >
            <div className="relative">
              {/* Frame */}
              <div className="absolute -inset-3 rounded-[1.75rem] border border-primary/20" aria-hidden />
              <div className="absolute -inset-1.5 rounded-[1.6rem] border border-accent/40" aria-hidden />
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-xl ring-1 ring-black/5">
                <img
                  src={professor.avatarUrl ?? "/professor.png"}
                  alt={`صورة ${professor.fullName}`}
                  className="aspect-[7/9] w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent p-5 text-primary-foreground">
                  <p className="font-amiri text-lg font-bold leading-tight">
                    {professor.fullName}
                  </p>
                  <p className="text-xs font-medium text-primary-foreground/90">
                    {professor.rank} · {professor.department}
                  </p>
                </div>
              </div>

              {/* Floating credential badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-4 right-4 flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 shadow-lg"
              >
                <Award className="size-4 text-accent" />
                <span className="text-xs font-semibold text-foreground">
                  {professor.yearsExperience}+ سنة خبرة
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="order-2 flex flex-col gap-5 text-right lg:order-1"
          >
            <Badge
              variant="outline"
              className="w-fit gap-2 border-primary/30 bg-primary/5 text-primary"
            >
              <GraduationCap className="size-3.5" />
              {professor.faculty}
            </Badge>

            <h1 className="font-amiri text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {professor.fullName}
            </h1>

            <p className="text-lg font-semibold text-primary sm:text-xl">
              {professor.title}
            </p>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {professor.shortBio}
            </p>

            {/* Quote */}
            <div className="relative mt-1 max-w-xl rounded-r-lg border-r-4 border-accent bg-card/60 p-4 pr-5 shadow-sm">
              <Quote
                className="absolute -top-3 right-3 size-7 text-accent/70"
                aria-hidden
              />
              <p className="font-amiri text-base italic leading-relaxed text-foreground/85 sm:text-lg">
                «القانون صوت العدالة، والعلم رسالتنا نحو مجتمع يعرف حقوقه
                وواجباته.»
              </p>
            </div>

            {/* Meta row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" />
                {professor.university}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-4 text-primary" />
                {professor.email}
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="gap-2 rounded-full bg-primary px-7 text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Mail className="size-4" />
                تواصل مع الأستاذ
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .querySelector("#research")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="gap-2 rounded-full border-primary/30 px-7 text-primary hover:bg-primary/5 hover:text-primary"
              >
                <ScrollText className="size-4" />
                استعرض البحوث
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
