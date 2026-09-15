import fs from "fs";
import path from "path";
import connectToDatabase from "./mongodb";
import Product from "@/models/Product";
import Setting from "@/models/Setting";
import Home from "@/models/Home";
import Page from "@/models/Page";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import Seo from "@/models/Seo";
import EmailSetting from "@/models/EmailSetting";
import bcrypt from "bcryptjs";

const dataDir = path.join(process.cwd(), "data");

function readFallbackJson(filename) {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`Fallback read error for ${filename}:`, err);
    return null;
  }
}

/**
 * Auto-seed MongoDB with template data if collections are empty
 */
async function ensureSeeded() {
  try {
    await connectToDatabase();

    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const templateProducts = readFallbackJson("products.json");
      if (templateProducts && templateProducts.length > 0) {
        await Product.insertMany(templateProducts);
        console.log(`[MongoDB] Seeded ${templateProducts.length} products from template.`);
      }
    }

    // 2. Seed Settings if empty
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      const templateSettings = readFallbackJson("settings.json");
      if (templateSettings) {
        await Setting.create({
          logo: "/assets/img/logo.png",
          headerCallText: "Any Question",
          ...templateSettings,
        });
        console.log("[MongoDB] Seeded settings from template.");
      }
    } else {
      await Setting.updateMany(
        { $or: [{ logo: { $exists: false } }, { headerCallText: { $exists: false } }] },
        {
          $set: {
            logo: "/assets/img/logo.png",
            headerCallText: "Any Question",
          },
        }
      );
    }

    // 3. Seed Home if empty
    const homeCount = await Home.countDocuments();
    if (homeCount === 0) {
      const templateHome = readFallbackJson("home.json");
      if (templateHome) {
        await Home.create(templateHome);
        console.log("[MongoDB] Seeded home content from template.");
      }
    }

    // 4. Seed Pages if empty
    const pageCount = await Page.countDocuments();
    if (pageCount === 0) {
      const templatePages = readFallbackJson("pages.json");
      if (templatePages) {
        const pagesToInsert = Object.keys(templatePages).map((slug) => ({
          slug,
          ...templatePages[slug],
        }));
        await Page.insertMany(pagesToInsert);
        console.log("[MongoDB] Seeded static pages from template.");
      }
    }

    // 5. Seed Admin User if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const templateUsers = readFallbackJson("users.json");
      if (templateUsers && templateUsers.length > 0) {
        await User.insertMany(templateUsers);
        console.log("[MongoDB] Seeded default admin user.");
      }
    }

    // 6. Seed SEO Settings if empty
    const seoCount = await Seo.countDocuments();
    if (seoCount === 0) {
      await Seo.create({});
      console.log("[MongoDB] Seeded default SEO configuration.");
    }

    // 7. Seed Email Settings if empty
    const emailSettingCount = await EmailSetting.countDocuments();
    if (emailSettingCount === 0) {
      await EmailSetting.create({});
      console.log("[MongoDB] Seeded default Email & SMTP configuration.");
    }
  } catch (err) {
    console.warn("[MongoDB] Auto-seeding check warning:", err.message);
  }
}

/* =========================================================================
   PRODUCTS
========================================================================= */

export async function getProducts() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const products = await Product.find({}).sort({ order: 1, createdAt: 1 }).lean();
    if (products && products.length > 0) {
      const clean = JSON.parse(JSON.stringify(products));
      return clean.map((p) => ({ ...p, _id: p._id?.toString() || p.id }));
    }
  } catch (err) {
    console.warn("[MongoDB] getProducts fallback:", err.message);
  }
  return readFallbackJson("products.json") || [];
}

export async function getProductBySlug(slug) {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const product = await Product.findOne({ slug }).lean();
    if (product) {
      const clean = JSON.parse(JSON.stringify(product));
      return { ...clean, _id: clean._id?.toString() || clean.id };
    }
  } catch (err) {
    console.warn("[MongoDB] getProductBySlug fallback:", err.message);
  }
  const products = readFallbackJson("products.json") || [];
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id) {
  try {
    await connectToDatabase();
    await ensureSeeded();
    let product = await Product.findOne({ id }).lean();
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    }
    if (product) {
      return { ...product, _id: product._id.toString() };
    }
  } catch (err) {
    console.warn("[MongoDB] getProductById fallback:", err.message);
  }
  const products = readFallbackJson("products.json") || [];
  return products.find((p) => p.id === id || p.slug === id) || null;
}

export async function saveProduct(productData) {
  try {
    await connectToDatabase();
    await ensureSeeded();

    let slug = productData.slug;
    if (!slug) {
      slug = (productData.title || "machine")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (productData.id) {
      const existing = await Product.findOne({ id: productData.id });
      if (existing) {
        Object.assign(existing, productData, { slug });
        await existing.save();
        return { ...existing.toObject(), _id: existing._id.toString() };
      }
    }

    const count = await Product.countDocuments();
    let uniqueSlug = slug;
    let counter = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    const newId = `prod-${Date.now()}`;
    const created = await Product.create({
      ...productData,
      id: newId,
      slug: uniqueSlug,
      order: productData.order !== undefined ? productData.order : count + 1,
    });

    return { ...created.toObject(), _id: created._id.toString() };
  } catch (err) {
    console.error("[MongoDB] saveProduct error:", err);
    throw err;
  }
}

export async function deleteProduct(id) {
  try {
    await connectToDatabase();
    const res = await Product.deleteOne({ id });
    if (res.deletedCount > 0) return true;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const resById = await Product.findByIdAndDelete(id);
      return !!resById;
    }
  } catch (err) {
    console.error("[MongoDB] deleteProduct error:", err);
  }
  return false;
}

export async function reorderProducts(items) {
  try {
    await connectToDatabase();
    const bulkOps = items.map((item) => {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(item.id);
      const filter = isObjectId ? { $or: [{ _id: item.id }, { id: item.id }] } : { id: item.id };
      return {
        updateOne: {
          filter,
          update: { $set: { order: item.order } },
        },
      };
    });

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // Also sync fallback data/products.json if it exists
    const filePath = path.join(dataDir, "products.json");
    if (fs.existsSync(filePath)) {
      try {
        const localProducts = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const orderMap = new Map(items.map((it) => [it.id, it.order]));
        localProducts.forEach((p) => {
          const newOrder = orderMap.get(p.id) || orderMap.get(p._id);
          if (newOrder !== undefined) {
            p.order = newOrder;
          }
        });
        localProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        fs.writeFileSync(filePath, JSON.stringify(localProducts, null, 2));
      } catch (err) {
        console.warn("[MongoDB] reorderProducts local json sync warning:", err.message);
      }
    }

    return true;
  } catch (err) {
    console.error("[MongoDB] reorderProducts error:", err);
    throw err;
  }
}

/* =========================================================================
   SETTINGS
========================================================================= */

export async function getSettings() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const settings = await Setting.findOne({}).lean();
    if (settings) {
      return {
        ...settings,
        logo: settings.logo || "/assets/img/logo.png",
        headerCallText: settings.headerCallText || "Any Question",
        _id: settings._id.toString(),
      };
    }
  } catch (err) {
    console.warn("[MongoDB] getSettings fallback:", err.message);
  }
  return readFallbackJson("settings.json") || {};
}

export async function saveSettings(settingsData) {
  try {
    await connectToDatabase();
    let settings = await Setting.findOne({});
    if (settings) {
      Object.assign(settings, settingsData);
      await settings.save();
      return { ...settings.toObject(), _id: settings._id.toString() };
    } else {
      const created = await Setting.create(settingsData);
      return { ...created.toObject(), _id: created._id.toString() };
    }
  } catch (err) {
    console.error("[MongoDB] saveSettings error:", err);
    throw err;
  }
}

/* =========================================================================
   HOME CONTENT
========================================================================= */

export async function getHomeContent() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const home = await Home.findOne({}).lean();
    if (home) {
      return { ...home, _id: home._id.toString() };
    }
  } catch (err) {
    console.warn("[MongoDB] getHomeContent fallback:", err.message);
  }
  return readFallbackJson("home.json") || {};
}

export async function saveHomeContent(homeData) {
  try {
    await connectToDatabase();
    let home = await Home.findOne({});
    if (home) {
      Object.assign(home, homeData);
      await home.save();
      return { ...home.toObject(), _id: home._id.toString() };
    } else {
      const created = await Home.create(homeData);
      return { ...created.toObject(), _id: created._id.toString() };
    }
  } catch (err) {
    console.error("[MongoDB] saveHomeContent error:", err);
    throw err;
  }
}

/* =========================================================================
   PAGES CONTENT
========================================================================= */

export async function getPagesContent() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const pages = await Page.find({}).lean();
    if (pages && pages.length > 0) {
      const map = {};
      pages.forEach((p) => {
        map[p.slug] = { ...p, _id: p._id.toString() };
      });
      return map;
    }
  } catch (err) {
    console.warn("[MongoDB] getPagesContent fallback:", err.message);
  }
  return readFallbackJson("pages.json") || {};
}

export async function savePageContent(slug, pageData) {
  try {
    await connectToDatabase();
    let page = await Page.findOne({ slug });
    if (page) {
      Object.assign(page, pageData);
      await page.save();
      return { ...page.toObject(), _id: page._id.toString() };
    } else {
      const created = await Page.create({ slug, ...pageData });
      return { ...created.toObject(), _id: created._id.toString() };
    }
  } catch (err) {
    console.error("[MongoDB] savePageContent error:", err);
    throw err;
  }
}

/* =========================================================================
   INQUIRIES
========================================================================= */

export async function getInquiries() {
  try {
    await connectToDatabase();
    const list = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return list.map((inq) => ({
      ...inq,
      id: inq._id.toString(),
      _id: inq._id.toString(),
    }));
  } catch (err) {
    console.warn("[MongoDB] getInquiries fallback:", err.message);
    return readFallbackJson("inquiries.json") || [];
  }
}

export async function createInquiry(data) {
  try {
    await connectToDatabase();
    const created = await Inquiry.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject || "General Inquiry",
      message: data.message,
      productSlug: data.productSlug || "",
      productTitle: data.productTitle || "",
      status: "New",
    });
    return {
      ...created.toObject(),
      id: created._id.toString(),
      _id: created._id.toString(),
    };
  } catch (err) {
    console.error("[MongoDB] createInquiry error:", err);
    throw err;
  }
}

export async function updateInquiryStatus(id, status) {
  try {
    await connectToDatabase();
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    if (inquiry) {
      return {
        ...inquiry,
        id: inquiry._id.toString(),
        _id: inquiry._id.toString(),
      };
    }
  } catch (err) {
    console.error("[MongoDB] updateInquiryStatus error:", err);
  }
  return null;
}

export async function deleteInquiry(id) {
  try {
    await connectToDatabase();
    const res = await Inquiry.findByIdAndDelete(id);
    return !!res;
  } catch (err) {
    console.error("[MongoDB] deleteInquiry error:", err);
  }
  return false;
}

/* =========================================================================
   USERS / AUTH & USER MANAGEMENT
========================================================================= */

export async function getUsers() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return users.map((u) => ({
      ...u,
      id: u._id.toString(),
      _id: u._id.toString(),
    }));
  } catch (err) {
    console.warn("[MongoDB] getUsers fallback:", err.message);
    const fallback = readFallbackJson("users.json") || [];
    return fallback.map(({ password, ...rest }) => rest);
  }
}

export async function getUserByEmail(email) {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (user) {
      return {
        ...user,
        id: user._id.toString(),
        _id: user._id.toString(),
      };
    }
  } catch (err) {
    console.warn("[MongoDB] getUserByEmail fallback:", err.message);
  }
  const users = readFallbackJson("users.json") || [];
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser({ name, email, password, role }) {
  try {
    await connectToDatabase();
    await ensureSeeded();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error("A user with this email address already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "Admin",
    });

    // Sync fallback data/users.json
    const filePath = path.join(dataDir, "users.json");
    try {
      let localUsers = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : [];
      localUsers.push({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        createdAt: user.createdAt,
      });
      fs.writeFileSync(filePath, JSON.stringify(localUsers, null, 2), "utf8");
    } catch (e) {
      console.warn("Failed to sync users.json:", e.message);
    }

    return {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (err) {
    console.error("[MongoDB] createUser error:", err);
    throw err;
  }
}

export async function updateUser(id, updates) {
  try {
    await connectToDatabase();
    await ensureSeeded();

    const updateData = {};
    if (updates.name) updateData.name = updates.name.trim();
    if (updates.role) updateData.role = updates.role;
    if (updates.email) {
      const normalizedEmail = updates.email.trim().toLowerCase();
      // Check if email is already used by another user
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });
      if (existing) {
        throw new Error("This email is already taken by another user.");
      }
      updateData.email = normalizedEmail;
    }
    if (updates.password && updates.password.trim().length > 0) {
      updateData.password = await bcrypt.hash(updates.password.trim(), 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!user) throw new Error("User not found");

    // Sync fallback data/users.json
    const filePath = path.join(dataDir, "users.json");
    try {
      if (fs.existsSync(filePath)) {
        let localUsers = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const idx = localUsers.findIndex((u) => u.id === id || u._id === id);
        if (idx !== -1) {
          localUsers[idx] = {
            ...localUsers[idx],
            name: user.name,
            email: user.email,
            role: user.role,
            ...(updateData.password ? { password: updateData.password } : {}),
          };
          fs.writeFileSync(filePath, JSON.stringify(localUsers, null, 2), "utf8");
        }
      }
    } catch (e) {
      console.warn("Failed to sync users.json:", e.message);
    }

    return {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (err) {
    console.error("[MongoDB] updateUser error:", err);
    throw err;
  }
}

export async function deleteUser(id, currentUserId) {
  try {
    await connectToDatabase();
    await ensureSeeded();

    if (id === currentUserId) {
      throw new Error("You cannot delete your own account while logged in.");
    }

    const totalUsers = await User.countDocuments();
    if (totalUsers <= 1) {
      throw new Error("Cannot delete the only remaining administrator account.");
    }

    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error("User not found");

    // Sync fallback data/users.json
    const filePath = path.join(dataDir, "users.json");
    try {
      if (fs.existsSync(filePath)) {
        let localUsers = JSON.parse(fs.readFileSync(filePath, "utf8"));
        localUsers = localUsers.filter((u) => u.id !== id && u._id !== id);
        fs.writeFileSync(filePath, JSON.stringify(localUsers, null, 2), "utf8");
      }
    } catch (e) {
      console.warn("Failed to sync users.json:", e.message);
    }

    return true;
  } catch (err) {
    console.error("[MongoDB] deleteUser error:", err);
    throw err;
  }
}

export async function updateUserProfile(id, updates) {
  try {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (user) {
      return {
        ...user,
        id: user._id.toString(),
        _id: user._id.toString(),
      };
    }
  } catch (err) {
    console.error("[MongoDB] updateUserProfile error:", err);
  }
  return null;
}

/* =========================================================================
   SEO SETTINGS
========================================================================= */

export const defaultPagesSeo = [
  {
    path: "/",
    pageName: "Home Page",
    metaTitle: "Textile Dyeing Machine Manufacturer & Exporter | Anjani Industries",
    metaDescription: "Anjani Industries is a leading manufacturer of advanced fabric dyeing machinery in India since 1990. Explore eco soft flow, jet dyeing, and textile processing machines.",
    metaKeywords: "fabric dyeing machine, textile machinery, jet dyeing machine, eco soft flow dyeing, surat",
  },
  {
    path: "/products",
    pageName: "Products Catalog (/products)",
    metaTitle: "Advance Fabric Dyeing & Processing Machinery Catalog | Anjani Industries",
    metaDescription: "Explore our full range of PLC-based soft flow dyeing machines, rapid jet dye units, weight reduction systems, and automatic caustic recovery plants.",
    metaKeywords: "dyeing machinery catalog, soft flow machines, rapid jet dyeing, caustic recovery plant",
  },
  {
    path: "/about-us",
    pageName: "About Us (/about-us)",
    metaTitle: "Fabric Dyeing Machinery Manufacturer in India | Anjani Industries",
    metaDescription: "Learn about Anjani Industries, delivering energy-efficient fabric dyeing machinery, scouring units, and textile processing solutions with 36+ years of expertise.",
    metaKeywords: "about anjani industries, textile machinery manufacturer surat, fabric dyeing company history",
  },
  {
    path: "/our-story",
    pageName: "Our Story (/our-story)",
    metaTitle: "Textile Machinery Innovation & Legacy | Anjani Industries",
    metaDescription: "Discover how Anjani Industries evolved from Anjani Machines Pvt. Ltd. into a pioneer of low liquor ratio fabric dyeing and automatic caustic recovery systems.",
    metaKeywords: "anjani machines history, textile machinery innovation, dyeing machine engineering legacy",
  },
  {
    path: "/values-ethics",
    pageName: "Values & Ethics (/values-ethics)",
    metaTitle: "Sustainable Textile Machinery & Quality Standards | Anjani Industries",
    metaDescription: "Committed to eco-friendly fabric dyeing technology, precision engineering, and customer satisfaction, Anjani Industries builds durable, low-energy machinery.",
    metaKeywords: "sustainable textile machinery, quality standards, iso certified dyeing machine, green manufacturing",
  },
  {
    path: "/contact-us",
    pageName: "Contact Us (/contact-us)",
    metaTitle: "Contact Textile Machinery Manufacturer | Surat, India | Anjani Industries",
    metaDescription: "Get in touch with Anjani Industries for machine quotes, custom engineering, or technical support. Visit our manufacturing facility in GIDC Sachin, Surat.",
    metaKeywords: "contact anjani industries, textile machine quote, machine manufacturer surat contact",
  },
];

export async function getSeoSettings() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    let seo = await Seo.findOne({});
    if (!seo) {
      seo = await Seo.create({ pagesSeo: defaultPagesSeo });
    } else if (!seo.pagesSeo || seo.pagesSeo.length === 0) {
      seo.pagesSeo = defaultPagesSeo;
      await seo.save();
    }
    const plain = seo.toObject();
    return { ...plain, _id: plain._id.toString() };
  } catch (err) {
    console.warn("[MongoDB] getSeoSettings fallback:", err.message);
  }
  return {
    siteUrl: "https://www.anjaniindustries.in",
    metaTitle: "Anjani Industries | Fabric Dyeing Machinery Manufacturer",
    metaDescription: "Leading manufacturer of advanced fabric dyeing machinery in India since 1990.",
    metaKeywords: "fabric dyeing machine, textile machinery, jet dyeing machine",
    pagesSeo: defaultPagesSeo,
    googleAnalytics: {
      enabled: true,
      measurementId: "G-NW6Z613EES",
      googleSiteVerification: "gzbGX_Ws9uHs_D0iP2jcKLR7rkKrX3C4iK5sgpa0nAM",
    },
    robotsTxt: {
      enabled: true,
      content: "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://www.anjaniindustries.in/sitemap.xml",
    },
    sitemap: {
      autoGenerateProducts: true,
      autoGeneratePages: true,
      extraUrls: [],
    },
    llmsTxt: {
      enabled: true,
      title: "Anjani Industries - Fabric Dyeing Machinery",
      summary: "Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery.",
      content: "# Anjani Industries\n\nLeading manufacturer of advanced fabric dyeing machinery since 1990.",
    },
  };
}

export async function saveSeoSettings(seoData) {
  try {
    await connectToDatabase();
    let seo = await Seo.findOne({});
    if (seo) {
      Object.assign(seo, seoData);
      await seo.save();
      return { ...seo.toObject(), _id: seo._id.toString() };
    } else {
      const created = await Seo.create(seoData);
      return { ...created.toObject(), _id: created._id.toString() };
    }
  } catch (err) {
    console.error("[MongoDB] saveSeoSettings error:", err);
    throw err;
  }
}

export async function getPageSeo(path) {
  try {
    const seo = await getSeoSettings();
    const found = (seo.pagesSeo || []).find((p) => p.path === path);
    if (found && (found.metaTitle || found.metaDescription || found.metaKeywords)) {
      return {
        title: found.metaTitle || seo.metaTitle,
        description: found.metaDescription || seo.metaDescription,
        keywords: found.metaKeywords || seo.metaKeywords,
      };
    }
    return {
      title: seo.metaTitle || "Anjani Industries | Fabric Dyeing Machinery Manufacturer",
      description: seo.metaDescription || "Leading manufacturer of advanced fabric dyeing machinery in India since 1990.",
      keywords: seo.metaKeywords || "fabric dyeing machine, textile machinery, jet dyeing machine",
    };
  } catch (err) {
    console.warn("[MongoDB] getPageSeo fallback:", err.message);
  }
  return {
    title: "Anjani Industries | Fabric Dyeing Machinery Manufacturer",
    description: "Leading manufacturer of advanced fabric dyeing machinery in India since 1990.",
    keywords: "fabric dyeing machine, textile machinery, jet dyeing machine",
  };
}

/* =========================================================================
   EMAIL & SMTP SETTINGS
========================================================================= */

export const defaultEmailSettings = {
  smtp: {
    enabled: false,
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    fromName: "Anjani Industries",
    fromEmail: "contact@anjaniindustries.in",
    replyTo: "contact@anjaniindustries.in",
    adminNotificationEmail: "anjani_ind@yahoo.com",
  },
  userTemplate: {
    enabled: true,
    subject: "Thank you for contacting Anjani Industries - Fabric Dyeing Machinery",
    heading: "Inquiry Received Successfully",
    body: "Dear {userName},\n\nThank you for reaching out to Anjani Industries. We have received your inquiry regarding our textile dyeing and processing machinery. Our technical sales engineering team will review your specifications and get in touch with you shortly.",
    footerNote: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370",
  },
  adminTemplate: {
    enabled: true,
    subject: "[New Inquiry Alert] {userName} - {subject}",
    heading: "New Customer Inquiry Received",
  },
};

export async function getEmailSettings() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    let settings = await EmailSetting.findOne({});
    if (!settings) {
      settings = await EmailSetting.create(defaultEmailSettings);
    }
    const plain = settings.toObject();
    return { ...plain, _id: plain._id.toString() };
  } catch (err) {
    console.warn("[MongoDB] getEmailSettings fallback:", err.message);
  }
  return defaultEmailSettings;
}

export async function saveEmailSettings(emailData) {
  try {
    await connectToDatabase();
    let settings = await EmailSetting.findOne({});
    if (settings) {
      Object.assign(settings, emailData);
      await settings.save();
      return { ...settings.toObject(), _id: settings._id.toString() };
    } else {
      const created = await EmailSetting.create(emailData);
      return { ...created.toObject(), _id: created._id.toString() };
    }
  } catch (err) {
    console.error("[MongoDB] saveEmailSettings error:", err);
    throw err;
  }
}



