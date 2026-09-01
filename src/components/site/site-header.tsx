"use client";

import { useEffect, useState } from "react";
import { Menu, Settings, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/admin-store";
import type { Professor } from "@/lib/types";

const NAV_LINKS = [
  { href: "#about", label: "نبذة" },
  { href: "#research", label: "البحوث" },
  { href: "#teaching", label: "التدريس" },
  { href: "#office-hours", label: "الساعات المكتبية" },
  { href: "#news", label: "الأخبار" },
  { href: "#contact", label: "اتصل" },
];

export function SiteHeader({ professor }: { professor: Professor }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openAdmin = useAdminStore((s) => s.openPanel);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem]">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("#top");
          }}
          className="shrink-0"
          aria-label="العودة إلى الأعلى"
        >
          <Logo
            fullName={professor.fullName}
            faculty={professor.faculty}
            university={professor.university}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={openAdmin}
            className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="لوحة التحكم"
            title="لوحة التحكم"
          >
            <Settings className="size-5" />
          </button>
          <Button
            size="sm"
            onClick={() => go("#contact")}
            className="gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            تواصل معي
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={openAdmin}
            className="grid size-10 place-items-center rounded-md text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="لوحة التحكم"
            title="لوحة التحكم"
          >
            <Settings className="size-5" />
          </button>
          <button
            className="grid size-10 place-items-center rounded-md text-foreground transition-colors hover:bg-primary/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-border/70 bg-background/95 backdrop-blur-md md:hidden">
          <nav
            className="container mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6"
            aria-label="التنقل للجوال"
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-md px-3 py-2.5 text-right text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {l.label}
              </button>
            ))}
            <Button
              size="sm"
              onClick={() => go("#contact")}
              className="mt-1 gap-2 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
            >
              تواصل معي
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
