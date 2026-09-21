import { SignJWT } from "jose";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function main() {
  const SECRET_KEY = new TextEncoder().encode("anjani_super_secret_jwt_key_2026_textile");

  const token = await new SignJWT({
    id: "user-admin-1",
    name: "Anjani Admin",
    email: "admin@anjaniindustries.com",
    role: "Super Admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  // Fetch products to get first product id
  const prodRes = await fetch("http://localhost:3222/api/products");
  const prods = await prodRes.json();
  const firstProd = prods[0];
  console.log("First product id/slug:", firstProd?.id, firstProd?.slug);

  if (firstProd) {
    const editRes = await fetch(`http://localhost:3222/admin/products/${firstProd.id || firstProd.slug}`, {
      headers: {
        Cookie: `admin_token=${token}`,
      },
    });
    console.log("HTTP status for edit page:", editRes.status);
    const editHtml = await editRes.text();
    console.log("Edit page has '4. Machine Description (Rich Text Editor)':", editHtml.includes("4. Machine Description (Rich Text Editor)"));
  }
}

main().catch(console.error);
