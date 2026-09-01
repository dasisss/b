"use client";

import { useState } from "react";
import { Loader2, Lock, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  onSuccess: () => void;
};

export function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "فشل تسجيل الدخول.");
        return;
      }
      toast.success("تم تسجيل الدخول بنجاح.");
      setPassword("");
      onSuccess();
    } catch {
      toast.error("تعذّر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <ShieldCheck className="size-8" />
          </span>
          <h2 className="font-amiri text-3xl font-bold text-foreground">
            لوحة تحكم الأستاذ
          </h2>
          <p className="text-sm text-muted-foreground">
            منطقة محمية لإدارة محتوى الموقع. يُرجى إدخال كلمة المرور.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-password" className="text-sm font-semibold">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-9"
                autoFocus
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            كلمة المرور الافتراضية للتجربة:{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-foreground">
              admin123
            </code>
          </p>
        </form>
      </div>
    </div>
  );
}
