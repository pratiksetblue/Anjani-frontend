import PageSections from "../../components/pages/AboutUsSections";
import { getPageSeo } from "@/lib/db";

export async function generateMetadata() {
  const seo = await getPageSeo("/about-us");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default function Page() {
  return <PageSections />;
}