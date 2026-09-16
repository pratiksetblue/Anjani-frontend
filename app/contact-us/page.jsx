import PageSections from "../../components/pages/ContactUsSections";
import { getPageSeo, getSettings, getPageContentBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("/contact-us");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const [settings, pageData] = await Promise.all([
    getSettings(),
    getPageContentBySlug("contactUs"),
  ]);
  return <PageSections settings={settings} pageData={pageData || {}} />;
}
