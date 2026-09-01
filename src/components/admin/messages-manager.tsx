"use client";

import { useMemo, useState } from "react";
import {
  CheckCheck,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Props = {
  messages: Message[];
  onReload: () => void;
};

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar-DZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function MessagesManager({ messages, onReload }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages],
  );

  const toggleRead = async (m: Message) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !m.isRead }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "فشل التحديث.");
        return;
      }
      toast.success(m.isRead ? "تم وضعها كغير مقروءة." : "تم وضعها كمقروءة.");
      onReload();
    } catch {
      toast.error("تعذّر الاتصال بالخادم.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/messages/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "فشل الحذف.");
        return;
      }
      toast.success("تم حذف الرسالة.");
      setDeletingId(null);
      onReload();
    } catch {
      toast.error("تعذّر الاتصال بالخادم.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Inbox className="size-5" />
          </span>
          <div>
            <h3 className="font-amiri text-xl font-bold text-foreground">
              الرسائل الواردة
            </h3>
            <p className="text-sm text-muted-foreground">
              {messages.length} رسالة{unreadCount > 0 ? ` · ${unreadCount} غير مقروءة` : ""}.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground">
            <Inbox className="mx-auto mb-3 size-10 opacity-40" />
            لا توجد رسائل بعد.
          </div>
        ) : (
          messages.map((m) => {
            const open = expanded === m.id;
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-2xl border bg-card p-5 shadow-sm transition-all",
                  m.isRead ? "border-border/60" : "border-primary/40 ring-1 ring-primary/15",
                )}
              >
                <button
                  onClick={() => setExpanded(open ? null : m.id)}
                  className="flex w-full items-start justify-between gap-3 text-right"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        m.isRead
                          ? "bg-secondary text-muted-foreground"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      {m.isRead ? <MailOpen className="size-5" /> : <Mail className="size-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold text-foreground">
                          {m.subject}
                        </span>
                        {!m.isRead ? (
                          <Badge className="bg-primary text-primary-foreground">جديد</Badge>
                        ) : null}
                      </div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground/80">{m.name}</span>
                        <span className="mx-1.5 text-border">•</span>
                        <span dir="ltr">{m.email}</span>
                        <span className="mx-1.5 text-border">•</span>
                        <span>{fmtDate(m.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>

                {open ? (
                  <div className="mt-4 border-t border-border/50 pt-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                      {m.message}
                    </p>
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRead(m)}
                        disabled={busy}
                        className="gap-1.5"
                      >
                        <CheckCheck className="size-3.5" />
                        {m.isRead ? "وضع كغير مقروءة" : "وضع كمقروءة"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingId(m.id)}
                        disabled={busy}
                        className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5"
                      >
                        <Trash2 className="size-3.5" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => (o ? null : setDeletingId(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-amiri text-xl">حذف الرسالة</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد حذف هذه الرسالة نهائياً؟ لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel disabled={busy}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={busy}
              className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
