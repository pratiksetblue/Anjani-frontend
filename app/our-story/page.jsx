import PageSections from "../../components/pages/OurStorySections";
import { getPageSeo, getTimeline, getPageContentBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("/our-story");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const [timeline, pageData] = await Promise.all([
    getTimeline(),
    getPageContentBySlug("ourStory"),
  ]);
  return <PageSections pageData={pageData || {}} timeline={timeline || []} />;
}
