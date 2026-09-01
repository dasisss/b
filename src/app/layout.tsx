import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { getProfessor } from "@/lib/data";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

// Dynamic metadata derived from the professor's record (with sensible fallback).
export async function generateMetadata(): Promise<Metadata> {
  const prof = await getProfessor();
  const name = prof?.fullName ?? "أ.د. كريم بلحاج";
  const faculty = prof?.faculty ?? "كلية الحقوق والعلوم السياسية";
  const university = prof?.university ?? "جامعة الجزائر";
  const title = `${name} — أستاذ ${faculty}، ${university}`;
  const description = `الموقع الرسمي للأستاذ ${name}، أستاذ ${faculty} بـ${university}. بحوث، تدريس، الساعات المكتبية، أخبار، وطرق التواصل.`;
  return {
    title,
    description,
    keywords: [
      "كلية الحقوق",
      "جامعة الجزائر",
      "أستاذ جامعي",
      "القانون",
      "العلوم القانونية",
      "البحوث القانونية",
      "الجزائر",
    ],
    authors: [{ name }],
    icons: { icon: "/logo.svg" },
    openGraph: {
      title: `${name} — أستاذ ${faculty}`,
      description: `الموقع الرسمي للأستاذ ${name} بـ${faculty}، ${university}.`,
      type: "website",
      locale: "ar_DZ",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${amiri.variable} ${tajawal.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
