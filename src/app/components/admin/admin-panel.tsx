"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookMarked,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  ScrollText,
  Settings,
  X,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { entityConfigs } from "@/lib/admin-config";
import { AdminLogin } from "./admin-login";
import { ProfileForm } from "./profile-form";
import { CrudManager } from "./crud-manager";
import { MessagesManager } from "./messages-manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabKey = "overview" | "profile" | "news" | "officeHours" | "courses" | "publications" | "messages";

type SiteData = {
  professor: Record<string, unknown> & { id: string };
  courses: (Record<string, unknown> & { id: string })[];
  publications: (Record<string, unknown> & { id: string })[];
  officeHours: (Record<string, unknown> & { id: string })[];
  news: (Record<string, unknown> & { id: string })[];
};

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { key: "profile", label: "الملف الشخصي", icon: Settings },
  { key: "news", label: "الأخبار", icon: Newspaper },
  { key: "officeHours", label: "الساعات المكتبية", icon: BookMarked },
  { key: "courses", label: "المواد", icon: FileText },
  { key: "publications", label: "البحوث", icon: ScrollText },
  { key: "messages", label: "الرسائل", icon: Inbox },
];

export function AdminPanel() {
  const open = useAdminStore((s) => s.open);
  const closePanel = useAdminStore((s) => s.closePanel);

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabKey>("overview");
  const [data, setData] = useState<SiteData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session");
      const j = await res.json();
      setAuthed(Boolean(j.authed));
    } catch {
      setAuthed(false);
    }
  }, []);

  // When the panel opens (or hash is #admin), verify the session.
  useEffect(() => {
    if (!open) return;
    if (authed === null) checkSession();
  }, [open, authed, checkSession]);

  // Allow opening via #admin hash.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#admin") {
      useAdminStore.getState().openPanel();
    }
  }, []);

  const loadSite = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api");
      const j = await res.json();
      if (j.ok) setData(j);
    } catch {
      // ignore
    } finally {
      setLoadingData(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const j = await res.json();
      setMessages(j.messages ?? []);
    } catch {
      setMessages([]);
    }
  }, []);

  // After successful login, fetch everything.
  useEffect(() => {
    if (authed && open && data === null) {
      loadSite();
      loadMessages();
    }
  }, [authed, open, data, loadSite, loadMessages]);

  const reloadAll = useCallback(() => {
    loadSite();
    loadMessages();
  }, [loadSite, loadMessages]);

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setAuthed(false);
    setData(null);
    setMessages([]);
    setTab("overview");
    toast.success("تم تسجيل الخروج.");
  };

  const onLoginSuccess = () => {
    setAuthed(true);
  };

  const unread = messages.filter((m) => !m.isRead).length;

  // Full-screen overlay: takes the entire browser viewport so it behaves
  // like a dedicated admin app rather than a constrained modal.
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="لوحة تحكم الأستاذ"
      className="fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col overflow-hidden bg-background"
    >
      <span className="sr-only">لوحة التحكم — إدارة محتوى موقع الأستاذ الجامعي.</span>
      <div className="flex h-full w-full flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-primary px-4 py-3 text-primary-foreground sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-primary-foreground/15">
                <LayoutDashboard className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="font-amiri text-base font-bold">لوحة تحكم الأستاذ</p>
                <p className="text-[11px] text-primary-foreground/75">
                  إدارة محتوى الموقع
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closePanel}
              className="size-9 rounded-lg text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="إغلاق"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Body */}
          {authed === null ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              جارٍ التحقق...
            </div>
          ) : !authed ? (
            <div className="flex-1 overflow-auto">
              <AdminLogin onSuccess={onLoginSuccess} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden sm:flex-row">
              {/* Sidebar */}
              <aside className="shrink-0 border-b border-border/70 bg-secondary/30 sm:w-60 sm:border-l sm:border-b-0">
                <nav className="flex gap-1 overflow-x-auto p-3 sm:flex-col sm:overflow-x-visible">
                  {TABS.map((t) => {
                    const active = tab === t.key;
                    const showBadge = t.key === "messages" && unread > 0;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={cn(
                          "flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors sm:w-full",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/75 hover:bg-primary/5 hover:text-primary",
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <t.icon className="size-4" />
                          {t.label}
                        </span>
                        {showBadge ? (
                          <Badge className="bg-accent text-accent-foreground">
                            {unread}
                          </Badge>
                        ) : null}
                      </button>
                    );
                  })}
                  <button
                    onClick={logout}
                    className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/80 transition-colors hover:bg-destructive/5 hover:text-destructive sm:w-full"
                  >
                    <LogOut className="size-4" />
                    تسجيل الخروج
                  </button>
                </nav>
              </aside>

              {/* Content */}
              <main className="flex-1 overflow-auto scroll-fade bg-arabesque p-4 sm:p-6">
                {loadingData && data === null ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    جارٍ التحميل...
                  </div>
                ) : tab === "overview" ? (
                  <Overview data={data} messages={messages} setTab={setTab} />
                ) : tab === "profile" && data ? (
                  <ProfileForm
                    professor={data.professor as never}
                    onReload={reloadAll}
                  />
                ) : tab === "messages" ? (
                  <MessagesManager messages={messages} onReload={loadMessages} />
                ) : data ? (
                  <CrudManager
                    config={entityConfigs[tab]}
                    items={
                      (data[
                        tab as keyof SiteData
                      ] as SiteData[keyof SiteData]) as never
                    }
                    onReload={reloadAll}
                  />
                ) : null}
              </main>
            </div>
          )}
        </div>
      </div>
  );
}

function Overview({
  data,
  messages,
  setTab,
}: {
  data: SiteData | null;
  messages: Message[];
  setTab: (t: TabKey) => void;
}) {
  if (!data) return null;
  const unread = messages.filter((m) => !m.isRead).length;
  const stats = [
    { label: "المواد", value: data.courses.length, tab: "courses" as TabKey, icon: FileText },
    { label: "المنشورات", value: data.publications.length, tab: "publications" as TabKey, icon: ScrollText },
    { label: "الساعات المكتبية", value: data.officeHours.length, tab: "officeHours" as TabKey, icon: BookMarked },
    { label: "الأخبار", value: data.news.length, tab: "news" as TabKey, icon: Newspaper },
    { label: "الرسائل", value: messages.length, tab: "messages" as TabKey, icon: Inbox, badge: unread },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-amiri text-2xl font-bold text-foreground">
          مرحباً بك في لوحة التحكم
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          من هنا يمكنك إدارة كامل محتوى الموقع. اختر قسماً من القائمة الجانبية أو اضغط على أحد البطاقات.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setTab(s.tab)}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-5 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-amiri text-2xl font-bold text-foreground">
                  {s.value}
                </p>
              </div>
            </div>
            {s.badge ? (
              <Badge className="bg-accent text-accent-foreground">
                {s.badge} جديد
              </Badge>
            ) : null}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h4 className="font-amiri text-lg font-bold text-foreground">
          آخر الرسائل الواردة
        </h4>
        <div className="mt-4 flex flex-col gap-2">
          {messages.slice(0, 3).map((m) => (
            <button
              key={m.id}
              onClick={() => setTab("messages")}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 text-right transition-colors hover:bg-primary/5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {m.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.name} · {m.email}
                </p>
              </div>
              {!m.isRead ? (
                <Badge className="bg-primary text-primary-foreground">جديد</Badge>
              ) : null}
            </button>
          ))}
          {messages.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              لا توجد رسائل بعد.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
