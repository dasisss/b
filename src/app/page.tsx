import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { About } from "@/components/site/about";
import { Research } from "@/components/site/research";
import { Teaching } from "@/components/site/teaching";
import { OfficeHours } from "@/components/site/office-hours";
import { News } from "@/components/site/news";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
  getProfessor,
  getCourses,
  getPublications,
  getOfficeHours,
  getNews,
} from "@/lib/data";
import { fallbackProfessor, fallbackCourses, fallbackPublications, fallbackOfficeHours, fallbackNews } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const professor =
    (await getProfessor()) ?? fallbackProfessor;
  const courses = (await getCourses(professor.id)).length
    ? await getCourses(professor.id)
    : fallbackCourses;
  const publications = (await getPublications(professor.id)).length
    ? await getPublications(professor.id)
    : fallbackPublications;
  const officeHours = (await getOfficeHours(professor.id)).length
    ? await getOfficeHours(professor.id)
    : fallbackOfficeHours;
  const news = (await getNews(professor.id)).length
    ? await getNews(professor.id)
    : fallbackNews;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader professor={professor} />
      <main className="flex-1">
        <Hero professor={professor} />
        <Stats professor={professor} />
        <About professor={professor} />
        <Research publications={publications} />
        <Teaching courses={courses} />
        <OfficeHours hours={officeHours} />
        <News news={news} />
        <Contact professor={professor} />
      </main>
      <SiteFooter professor={professor} />
      <AdminPanel />
    </div>
  );
}
