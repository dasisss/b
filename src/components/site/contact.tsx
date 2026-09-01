"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";
import type { Professor } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = { professor: Professor };

export function Contact({ professor }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || done) return;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "فشل إرسال الرسالة");
      }
      toast.success("تم إرسال رسالتك بنجاح. سيتم الرد عليك في أقرب وقت.");
      setDone(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "حدث خطأ غير متوقع، حاول مجدداً.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-arabesque py-20 sm:py-24 lg:py-28"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="تواصل"
          title="اتصل بالأستاذ"
          description="للاستفسارات العلمية، الإشراف على البحوث، أو حجز موعد؛ يُرجى ملء النموذج أدناه."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
          {/* Contact info */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary p-6 text-primary-foreground shadow-lg sm:p-7"
          >
            <h3 className="font-amiri text-2xl font-bold">
              معلومات التواصل
            </h3>
            <p className="text-sm leading-relaxed text-primary-foreground/85">
              يمكنك أيضاً التواصل مباشرة عبر القنوات الرسمية التالية خلال أيام
              العمل الأسبوعية.
            </p>

            <ul className="mt-2 space-y-4">
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/15">
                  <Mail className="size-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-primary-foreground/70">
                    البريد الإلكتروني
                  </span>
                  <span className="text-sm font-semibold break-all" dir="ltr">
                    {professor.email}
                  </span>
                </div>
              </li>
              {professor.phone ? (
                <li className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/15">
                    <Phone className="size-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-primary-foreground/70">
                      الهاتف
                    </span>
                    <span className="text-sm font-semibold" dir="ltr">
                      {professor.phone}
                    </span>
                  </div>
                </li>
              ) : null}
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/15">
                  <MapPin className="size-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-primary-foreground/70">
                    العنوان
                  </span>
                  <span className="text-sm font-semibold">
                    {professor.faculty}
                    {professor.office ? ` — ${professor.office}` : ""}
                  </span>
                  <span className="text-sm text-primary-foreground/80">
                    {professor.university}
                  </span>
                </div>
              </li>
            </ul>
          </motion.aside>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8"
          >
            {done ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-9" />
                </span>
                <h3 className="font-amiri text-2xl font-bold text-foreground">
                  تم استلام رسالتك
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  شكراً لتواصلك معي. سيتم الرد على بريدك الإلكتروني في أقرب وقت
                  ممكن خلال أيام العمل.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setDone(false)}
                  className="mt-2 rounded-full border-primary/30 text-primary hover:bg-primary/5"
                >
                  إرسال رسالة أخرى
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      الاسم الكامل
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: محمد الأمين بن علي"
                        className="pr-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="pr-9"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject" className="text-sm font-semibold">
                    الموضوع
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: طلب إشراف على مذكرة ماجستير"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="message" className="text-sm font-semibold">
                    الرسالة
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    required
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-fit gap-2 rounded-full bg-primary px-7 text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
