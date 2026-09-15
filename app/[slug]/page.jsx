import { getProductBySlug, getProducts } from "@/lib/db";
import ProductDetailTemplate from "@/components/pages/ProductDetailTemplate";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Anjani Industries" };
  }

  return {
    title: product.metaTitle || `${product.title} | Anjani Industries`,
    description: product.metaDescription || product.paragraphs?.[0] || product.title,
    keywords: product.metaKeywords || `${product.title}, fabric dyeing machine, textile machinery, anjani industries`,
  };
}

export default async function DynamicProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailTemplate product={product} />;
}
