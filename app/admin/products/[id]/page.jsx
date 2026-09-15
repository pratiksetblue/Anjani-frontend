import ProductForm from "@/components/admin/ProductForm";
import { getProductById, getProductBySlug } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product = await getProductById(id);
  if (!product) {
    product = await getProductBySlug(id);
  }

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
