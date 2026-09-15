import PageSections from "../../components/pages/ContactUsSections";
import { getPageSeo, getSettings } from "@/lib/db";

export async function generateMetadata() {
  const seo = await getPageSeo("/contact-us");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const settings = await getSettings();
  return <PageSections settings={settings} />;
}
