import PageSections from "../components/pages/IndexSections";
import { getPageSeo, getHomeContent, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("/");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const [homeData, products] = await Promise.all([
    getHomeContent(),
    getProducts(),
  ]);

  return (
    <PageSections
      initialHomeData={homeData}
      initialProducts={products}
    />
  );
}
