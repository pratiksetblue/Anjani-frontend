import PageSections from "../../components/pages/ValuesEthicsSections";
import { getPageSeo, getPageContentBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("/values-ethics");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const pageData = await getPageContentBySlug("valuesEthics");
  return <PageSections pageData={pageData || {}} />;
}
