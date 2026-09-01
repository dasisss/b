"use client";

import { useEffect, useState } from "react";
import { ImageUp, Loader2, Save, Trash2, UserCog } from "lucide-react";
import type { Professor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  professor: Professor;
  onReload: () => void;
};

export function ProfileForm({ professor, onReload }: Props) {
  const [v, setV] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setV({
      fullName: professor.fullName ?? "",
      title: professor.title ?? "",
      rank: professor.rank ?? "",
      university: professor.university ?? "",
      faculty: professor.faculty ?? "",
      department: professor.department ?? "",
      email: professor.email ?? "",
      phone: professor.phone ?? "",
      office: professor.office ?? "",
      avatarUrl: professor.avatarUrl ?? "",
      shortBio: professor.shortBio ?? "",
      longBio: professor.longBio ?? "",
      education: professor.education ?? "",
      researchInterests: professor.researchInterests ?? "",
      yearsExperience: String(professor.yearsExperience ?? 0),
      publicationsCount: String(professor.publicationsCount ?? 0),
      supervisedTheses: String(professor.supervisedTheses ?? 0),
      coursesCount: String(professor.coursesCount ?? 0),
    });
  }, [professor]);

  const set = (k: string, val: string) => setV((s) => ({ ...s, [k]: val }));

  const save = async () => {
    if (!v.fullName || !v.title || !v.email) {
      toast.error("الاسم واللقب والبريد مطلوبة.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/professor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...v,
          yearsExperience: Number(v.yearsExperience) || 0,
          publicationsCount: Number(v.publicationsCount) || 0,
          supervisedTheses: Number(v.supervisedTheses) || 0,
          coursesCount: Number(v.coursesCount) || 0,
          phone: v.phone || null,
          office: v.office || null,
          avatarUrl: v.avatarUrl || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "فشل الحفظ.");
        return;
      }
      toast.success("تم حفظ الملف الشخصي بنجاح.");
      onReload();
    } catch {
      toast.error("تعذّر الاتصال بالخادم.");
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح.");
      return;
    }
    if (file.size > 1_500_000) {
      toast.error("حجم الصورة كبير جداً (الحد الأقصى ~1.5 ميغابايت). اختر صورة أصغر.");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setV((s) => ({ ...s, avatarUrl: String(reader.result ?? "") }));
        toast.success("تم تحميل الصورة. اضغط «حفظ الملف» لتثبيتها.");
      };
      reader.onerror = () => toast.error("فشل قراءة الصورة.");
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  if (Object.keys(v).length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <UserCog className="size-5" />
        </span>
        <div>
          <h3 className="font-amiri text-xl font-bold text-foreground">
            الملف الشخصي
          </h3>
          <p className="text-sm text-muted-foreground">
            المعلومات الأساسية والأكاديمية للأستاذ.
          </p>
        </div>
      </div>

      <div className="grid gap-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-7">
        {/* Photo */}
        <div className="flex flex-col items-center gap-4 border-b border-border/50 pb-6 sm:flex-row sm:gap-6">
          <img
            src={v.avatarUrl || "/professor.png"}
            alt="صورة الأستاذ"
            className="size-24 rounded-2xl border-2 border-accent/40 object-cover shadow-sm sm:size-28"
          />
          <div className="flex flex-1 flex-col gap-2">
            <h4 className="font-amiri text-base font-bold text-foreground">
              الصورة الشخصية
            </h4>
            <p className="text-xs text-muted-foreground">
              تظهر في أعلى الصفحة (القسم التعريفي). يُفضّل صورة مربّعة أو طولية بدقة عالية، حجم أقل من 1.5 ميغابايت.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImageUp className="size-4" />
                )}
                {uploading ? "جارٍ التحميل..." : "اختيار صورة"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                    e.target.value = "";
                  }}
                />
              </label>
              {v.avatarUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("avatarUrl", "")}
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="size-4" />
                  حذف الصورة
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الاسم الكامل" required>
            <Input value={v.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </Field>
          <Field label="اللقب / الصفة" required>
            <Input value={v.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="الرتبة الجامعية">
            <Input value={v.rank} onChange={(e) => set("rank", e.target.value)} />
          </Field>
          <Field label="القسم">
            <Input value={v.department} onChange={(e) => set("department", e.target.value)} />
          </Field>
        </div>

        {/* Affiliation */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الجامعة">
            <Input value={v.university} onChange={(e) => set("university", e.target.value)} />
          </Field>
          <Field label="الكلية">
            <Input value={v.faculty} onChange={(e) => set("faculty", e.target.value)} />
          </Field>
        </div>

        {/* Contact */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="البريد الإلكتروني" required>
            <Input dir="ltr" value={v.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="الهاتف">
            <Input dir="ltr" value={v.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="المكتب">
            <Input value={v.office} onChange={(e) => set("office", e.target.value)} />
          </Field>
        </div>

        {/* Bios */}
        <div className="grid gap-4">
          <Field label="نبذة قصيرة (تظهر في الواجهة الرئيسية)">
            <Textarea rows={2} value={v.shortBio} onChange={(e) => set("shortBio", e.target.value)} className="resize-none" />
          </Field>
          <Field label="السيرة الذاتية الموسّعة">
            <Textarea rows={5} value={v.longBio} onChange={(e) => set("longBio", e.target.value)} className="resize-none" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="التكوين الأكاديمي (سطر لكل عنصر)">
              <Textarea rows={4} value={v.education} onChange={(e) => set("education", e.target.value)} className="resize-none" />
            </Field>
            <Field label="اهتمامات بحثية (مفصولة بفاصلة أو سطر)">
              <Textarea rows={4} value={v.researchInterests} onChange={(e) => set("researchInterests", e.target.value)} className="resize-none" />
            </Field>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="سنوات الخبرة">
            <Input type="number" value={v.yearsExperience} onChange={(e) => set("yearsExperience", e.target.value)} />
          </Field>
          <Field label="عدد المنشورات">
            <Input type="number" value={v.publicationsCount} onChange={(e) => set("publicationsCount", e.target.value)} />
          </Field>
          <Field label="أطروحات موجّهة">
            <Input type="number" value={v.supervisedTheses} onChange={(e) => set("supervisedTheses", e.target.value)} />
          </Field>
          <Field label="عدد المواد">
            <Input type="number" value={v.coursesCount} onChange={(e) => set("coursesCount", e.target.value)} />
          </Field>
        </div>

        <div className="flex justify-end border-t border-border/50 pt-5">
          <Button
            onClick={save}
            disabled={saving}
            className="gap-2 rounded-lg bg-primary px-7 text-primary-foreground hover:bg-primary/90"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "جارٍ الحفظ..." : "حفظ الملف"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-semibold">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}
