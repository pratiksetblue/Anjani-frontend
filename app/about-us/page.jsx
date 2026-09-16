import PageSections from "../../components/pages/AboutUsSections";
import { getPageSeo, getPageContentBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("/about-us");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const pageData = await getPageContentBySlug("aboutUs");
  return <PageSections pageData={pageData || {}} />;
}
