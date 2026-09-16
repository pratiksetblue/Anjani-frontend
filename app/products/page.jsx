import PageSections from "../../components/pages/ProductsSections";
import { getPageSeo, getProducts, getPageContentBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("/products");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function Page() {
  const [products, pageData] = await Promise.all([
    getProducts(),
    getPageContentBySlug("productsPage"),
  ]);
  const safeProducts = JSON.parse(JSON.stringify(products || []));
  return <PageSections initialProducts={safeProducts} pageData={pageData || {}} />;
}
