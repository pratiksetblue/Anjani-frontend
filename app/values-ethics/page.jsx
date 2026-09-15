import PageSections from "../../components/pages/ValuesEthicsSections";
import { getPageSeo } from "@/lib/db";

export async function generateMetadata() {
  const seo = await getPageSeo("/values-ethics");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default function Page() {
  return <PageSections />;
}
