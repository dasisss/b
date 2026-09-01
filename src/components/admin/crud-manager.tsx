"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { EntityConfig, Field } from "@/lib/admin-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string };

type Props = {
  config: EntityConfig;
  items: Row[];
  onReload: () => void;
};

function emptyValues(fields: Field[]): Record<string, string> {
  const v: Record<string, string> = {};
  fields.forEach((f) => {
    if (f.type === "date") v[f.name] = new Date().toISOString().slice(0, 10);
    else if (f.type === "number") v[f.name] = "";
    else v[f.name] = "";
  });
  return v;
}

export function CrudManager({ config, items, onReload }: Props) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setValues(emptyValues(config.fields));
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (row: Row) => {
    const v: Record<string, string> = {};
    config.fields.forEach((f) => {
      const raw = row[f.name];
      if (f.type === "date" && raw) {
        v[f.name] = new Date(raw as string).toISOString().slice(0, 10);
      } else if (raw === null || raw === undefined) {
        v[f.name] = "";
      } else {
        v[f.name] = String(raw);
      }
    });
    setValues(v);
    setEditing(row);
    setCreating(true);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setValues({});
  };

  const save = async () => {
    // validate required
    for (const f of config.fields) {
      if (f.required && !String(values[f.name] ?? "").trim()) {
        toast.error(`الحقل «${f.label}» مطلوب.`);
        return;
      }
    }
    setSaving(true);
    const payload: Record<string, unknown> = {};
    config.fields.forEach((f) => {
      const val = values[f.name] ?? "";
      if (f.type === "number") {
        payload[f.name] = val === "" ? 0 : Number(val);
      } else {
        payload[f.name] = val.trim() === "" ? null : val.trim();
      }
    });
    const url = editing
      ? `${config.endpoint}/${editing.id}`
      : config.endpoint;
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "فشل الحفظ.");
        return;
      }
      toast.success(editing ? "تم التحديث بنجاح." : "تمت الإضافة بنجاح.");
      closeForm();
      onReload();
    } catch {
      toast.error("تعذّر الاتصال بالخادم.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${config.endpoint}/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "فشل الحذف.");
        return;
      }
      toast.success("تم الحذف.");
      setDeletingId(null);
      onReload();
    } catch {
      toast.error("تعذّر الاتصال بالخادم.");
    } finally {
      setDeleting(false);
    }
  };

  const rows = useMemo(() => items, [items]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-amiri text-xl font-bold text-foreground">
            {config.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {items.length} {config.singular} مسجّل.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          إضافة {config.singular}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="max-h-[420px] overflow-auto scroll-fade">
          <table className="w-full text-right text-sm">
            <thead className="sticky top-0 z-10 bg-secondary/80 backdrop-blur">
              <tr className="text-xs font-semibold text-muted-foreground">
                {config.columns.map((c) => (
                  <th key={c.name} className="px-4 py-3 text-right font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    لا توجد عناصر بعد. اضغط «إضافة {config.singular}».
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id as string}
                    className="border-t border-border/60 transition-colors hover:bg-primary/5"
                  >
                    {config.columns.map((c) => (
                      <td
                        key={c.name}
                        className="max-w-xs px-4 py-3 align-top text-foreground/90"
                      >
                        <span className="line-clamp-2">
                          {c.render
                            ? c.render(row)
                            : String(row[c.name] ?? "—")}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          className="grid size-8 place-items-center rounded-md text-primary transition-colors hover:bg-primary/10"
                          aria-label="تعديل"
                          title="تعديل"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(row.id as string)}
                          className="grid size-8 place-items-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
                          aria-label="حذف"
                          title="حذف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={creating} onOpenChange={(o) => (o ? null : closeForm())}>
        <DialogContent className="max-w-2xl gap-5 overflow-y-auto max-h-[88vh]">
          <DialogHeader>
            <DialogTitle className="font-amiri text-2xl">
              {editing ? `تعديل ${config.singular}` : `إضافة ${config.singular} جديد`}
            </DialogTitle>
            <DialogDescription>
              املأ الحقول التالية ثم اضغط «حفظ».
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((f) => (
              <div
                key={f.name}
                className={cn(
                  "flex flex-col gap-1.5",
                  f.full && "sm:col-span-2",
                )}
              >
                <Label htmlFor={f.name} className="text-sm font-semibold">
                  {f.label}
                  {f.required ? <span className="text-destructive"> *</span> : null}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    value={values[f.name] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.name]: e.target.value }))
                    }
                    rows={3}
                    className="resize-none"
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={values[f.name] ?? ""}
                    onValueChange={(val) =>
                      setValues((v) => ({ ...v, [f.name]: val }))
                    }
                  >
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder="اختر..." />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={f.name}
                    type={
                      f.type === "number"
                        ? "number"
                        : f.type === "date"
                          ? "date"
                          : f.type === "time"
                            ? "time"
                            : f.type === "email"
                              ? "email"
                              : "text"
                    }
                    value={values[f.name] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.name]: e.target.value }))
                    }
                    dir={f.type === "email" || f.type === "url" ? "ltr" : "rtl"}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={closeForm}
              disabled={saving}
              className="gap-1.5"
            >
              <X className="size-4" />
              إلغاء
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={(o) => (o ? null : setDeletingId(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-amiri text-xl">
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا الـ{config.singular}؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel disabled={deleting} className="gap-1.5">
              <X className="size-4" />
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
