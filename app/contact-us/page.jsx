import PageSections from "../../components/pages/ContactUsSections";
import { getPageSeo } from "@/lib/db";

export async function generateMetadata() {
  const seo = await getPageSeo("/contact-us");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default function Page() {
  return <PageSections />;
}
