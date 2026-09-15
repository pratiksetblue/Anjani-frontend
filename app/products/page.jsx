import PageSections from "../../components/pages/ProductsSections";
import { getPageSeo, getProducts } from "@/lib/db";

export async function generateMetadata() {
  const seo = await getPageSeo("/products");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const products = await getProducts();
  const safeProducts = JSON.parse(JSON.stringify(products || []));
  return <PageSections initialProducts={safeProducts} />;
}
