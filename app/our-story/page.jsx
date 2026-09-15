import PageSections from "../../components/pages/OurStorySections";
import { getPageSeo } from "@/lib/db";

export async function generateMetadata() {
  const seo = await getPageSeo("/our-story");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default function Page() {
  return <PageSections />;
}
