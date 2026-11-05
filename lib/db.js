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
import Timeline from "@/models/Timeline";
import Exhibitor from "@/models/Exhibitor";
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

    // 4. Seed Pages if missing
    const templatePages = readFallbackJson("pages.json");
    if (templatePages) {
      for (const slug of Object.keys(templatePages)) {
        const exists = await Page.exists({ slug });
        if (!exists) {
          await Page.create({ slug, ...templatePages[slug] });
          console.log(`[MongoDB] Seeded missing page slug: ${slug}`);
        }
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

    // 8. Seed Timeline Milestones if empty
    const timelineCount = await Timeline.countDocuments();
    if (timelineCount === 0) {
      const templateTimeline = readFallbackJson("timeline.json");
      if (templateTimeline && templateTimeline.length > 0) {
        await Timeline.insertMany(templateTimeline);
        console.log(`[MongoDB] Seeded ${templateTimeline.length} timeline milestones.`);
      }
    }

    // 9. Seed Exhibitors if empty
    const exhibitorCount = await Exhibitor.countDocuments();
    if (exhibitorCount === 0) {
      const templateExhibitors = readFallbackJson("exhibitors.json");
      if (templateExhibitors && templateExhibitors.length > 0) {
        await Exhibitor.insertMany(templateExhibitors);
        console.log(`[MongoDB] Seeded ${templateExhibitors.length} exhibitors.`);
      }
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
      const clean = JSON.parse(JSON.stringify(product));
      return { ...clean, _id: clean._id?.toString() || clean.id };
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

    if (productData.id || productData._id) {
      let existing = await Product.findOne({ id: productData.id });
      if (!existing && (productData._id || productData.id)?.toString().match(/^[0-9a-fA-F]{24}$/)) {
        existing = await Product.findById(productData._id || productData.id);
      }
      if (existing) {
        existing.title = productData.title;
        existing.slug = slug;
        existing.capacity = productData.capacity || "";
        existing.image = productData.image || "";
        existing.brochureUrl = productData.brochureUrl || "";
        existing.whatsappNumber = productData.whatsappNumber || "";
        existing.featured = productData.featured !== undefined ? productData.featured : true;
        if (productData.order !== undefined) existing.order = productData.order;
        existing.metaTitle = productData.metaTitle || "";
        existing.metaDescription = productData.metaDescription || "";
        existing.metaKeywords = productData.metaKeywords || "";
        existing.highlights = Array.isArray(productData.highlights) ? productData.highlights : [];
        existing.paragraphs = Array.isArray(productData.paragraphs) ? productData.paragraphs : [];
        existing.description = productData.description !== undefined ? productData.description : "";
        existing.keyAdvantages = Array.isArray(productData.keyAdvantages) ? productData.keyAdvantages : [];
        existing.spaceModel = Array.isArray(productData.spaceModel) ? productData.spaceModel : [];

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
      description: productData.description || "",
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
      const clean = JSON.parse(JSON.stringify(settings));
      return {
        ...clean,
        logo: clean.logo || "/assets/img/logo.png",
        headerCallText: clean.headerCallText || "Any Question",
        _id: clean._id?.toString(),
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
      if (Array.isArray(settingsData.salesOffices)) {
        settings.set("salesOffices", settingsData.salesOffices);
        settings.markModified("salesOffices");
      }
      Object.assign(settings, settingsData);
      await settings.save();
      const obj = settings.toObject();
      return JSON.parse(JSON.stringify({ ...obj, _id: obj._id?.toString() }));
    } else {
      const created = await Setting.create(settingsData);
      const obj = created.toObject();
      return JSON.parse(JSON.stringify({ ...obj, _id: obj._id?.toString() }));
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
      const clean = JSON.parse(JSON.stringify(home));
      return { ...clean, _id: clean._id?.toString() };
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
      if (homeData.about) {
        const currentAbout = home.about?.toObject ? home.about.toObject() : home.about || {};
        home.set("about", { ...currentAbout, ...homeData.about });
        home.markModified("about");
      }
      if (homeData.hero) {
        const currentHero = home.hero?.toObject ? home.hero.toObject() : home.hero || {};
        home.set("hero", { ...currentHero, ...homeData.hero });
        home.markModified("hero");
      }
      if (homeData.counters) {
        home.set("counters", homeData.counters);
        home.markModified("counters");
      }
      if (homeData.certifications) {
        home.set("certifications", homeData.certifications);
        home.markModified("certifications");
      }
      if (homeData.bannerImage) {
        home.set("bannerImage", homeData.bannerImage);
      }
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
  const fallback = readFallbackJson("pages.json") || {};
  try {
    await connectToDatabase();
    await ensureSeeded();
    const pages = await Page.find({}).lean();
    if (pages && pages.length > 0) {
      const cleanPages = JSON.parse(JSON.stringify(pages));
      const map = { ...fallback };
      cleanPages.forEach((p) => {
        map[p.slug] = { ...(fallback[p.slug] || {}), ...p, _id: p._id?.toString() };
      });
      return map;
    }
  } catch (err) {
    console.warn("[MongoDB] getPagesContent fallback:", err.message);
  }
  return fallback;
}

export async function getPageContentBySlug(slug) {
  const fallbackAll = readFallbackJson("pages.json") || {};
  const fallback = fallbackAll[slug] ? { slug, ...fallbackAll[slug] } : { slug };
  try {
    await connectToDatabase();
    await ensureSeeded();
    const page = await Page.findOne({ slug }).lean();
    if (page) {
      const clean = JSON.parse(JSON.stringify(page));
      return { ...fallback, ...clean, _id: clean._id?.toString() };
    }
  } catch (err) {
    console.warn(`[MongoDB] getPageContentBySlug(${slug}) fallback:`, err.message);
  }
  return fallback;
}

export async function savePageContent(slug, pageData) {
  try {
    await connectToDatabase();
    const { _id, id, ...cleanData } = pageData;
    const updated = await Page.findOneAndUpdate(
      { slug },
      { $set: { slug, ...cleanData } },
      { new: true, upsert: true }
    ).lean();
    return { ...updated, _id: updated._id?.toString() };
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
    const firstName = data.firstName ? data.firstName.trim() : "";
    const lastName = data.lastName ? data.lastName.trim() : "";
    const derivedName = [firstName, lastName].filter(Boolean).join(" ");
    const finalName = derivedName || data.name || (data.type === "Newsletter" ? "Newsletter Subscriber" : "Valued Customer");

    const created = await Inquiry.create({
      name: finalName,
      firstName: firstName,
      lastName: lastName,
      country: data.country ? data.country.trim() : "",
      email: data.email,
      phone: data.phone || "",
      subject: data.subject || (data.type === "Newsletter" ? "Newsletter Subscription" : "General Inquiry"),
      message: data.message || (data.type === "Newsletter" ? "Subscribed to newsletter from website footer" : ""),
      type: data.type || "Inquiry",
      productSlug: data.productSlug || "",
      productTitle: data.productTitle || "",
      status: data.status || "New",
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

export async function updateInquiry(id, data) {
  try {
    await connectToDatabase();
    const updates = { ...data };
    delete updates._id;
    delete updates.id;

    if (updates.firstName !== undefined || updates.lastName !== undefined) {
      const existing = await Inquiry.findById(id).lean();
      const currentFirst = updates.firstName !== undefined ? updates.firstName : (existing?.firstName || "");
      const currentLast = updates.lastName !== undefined ? updates.lastName : (existing?.lastName || "");
      const combined = [currentFirst.trim(), currentLast.trim()].filter(Boolean).join(" ");
      if (combined) {
        updates.name = combined;
      }
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after" }
    ).lean();
    if (inquiry) {
      return {
        ...inquiry,
        id: inquiry._id.toString(),
        _id: inquiry._id.toString(),
      };
    }
  } catch (err) {
    console.error("[MongoDB] updateInquiry error:", err);
  }
  return null;
}

export async function updateInquiryStatus(id, status) {
  return updateInquiry(id, { status });
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
    const plain = JSON.parse(JSON.stringify(seo.toObject ? seo.toObject() : seo));
    return { ...plain, _id: plain._id?.toString() };
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
    enabled: true,
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "donotautoreplyback@gmail.com",
      pass: "sjlrvyctlbdtdgqm",
    },
    fromName: "Anjani Industries",
    fromEmail: "info@anjaniindustries.in",
    replyTo: "info@anjaniindustries.in",
    adminNotificationEmail: "info@anjaniindustries.in",
  },
  branding: {
    logoUrl: "/assets/img/logo.png",
    companyName: "Anjani Industries",
    tagline: "Fabric Dyeing & Textile Processing Machinery",
    phone: "+91 8154 888 370",
    email: "info@anjaniindustries.in",
    website: "https://www.anjaniindustries.in",
    address: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India",
  },
  userTemplate: {
    enabled: true,
    subject: "Thank you for contacting Anjani Industries - Fabric Dyeing Machinery",
    heading: "Inquiry Received Successfully",
    body: "Dear {userName},\n\nThank you for reaching out to Anjani Industries. We have received your inquiry regarding our textile dyeing and processing machinery. Our technical sales engineering team will review your specifications and get in touch with you shortly.",
    ctaText: "Explore Machinery Catalog",
    ctaUrl: "https://www.anjaniindustries.in/products",
    footerNote: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370",
  },
  adminTemplate: {
    enabled: true,
    subject: "[New Inquiry Alert] {userName} - {subject}",
    heading: "New Customer Inquiry Received",
    body: "A new customer inquiry has just been submitted on the Anjani Industries website. Please find the lead details below and respond to the customer promptly.",
    footerNote: "Internal Sales Notification - Anjani Industries Machinery Lead Capture",
  },
  newsletterTemplate: {
    enabled: true,
    subject: "Welcome to Anjani Industries Newsletter - Textile Machinery Updates",
    heading: "Thank You for Subscribing!",
    body: "Dear Subscriber,\n\nThank you for subscribing to the Anjani Industries newsletter!\n\nYou are now part of our valued community. You will receive regular updates about our latest fabric dyeing machinery innovations, eco-friendly technological breakthroughs, industry trends, and global exhibition announcements directly in your inbox.\n\nIf you ever need technical advice or customized machinery specifications, our engineering team is here to assist you.",
    ctaText: "Explore Machinery Range",
    ctaUrl: "https://www.anjaniindustries.in/products",
    footerNote: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370 | info@anjaniindustries.in",
  },
  exhibitorTemplate: {
    enabled: true,
    subject: "Official Communication & Textile Machinery Solutions from Anjani Industries",
    heading: "",
    body: "Dear {fullName},\n\nWe are pleased to connect with you regarding our advanced textile dyeing and processing machinery solutions. Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.\n\nShould you need any technical documentation, capacity specifications, or customized machinery quotation, our engineering team is here to assist you.",
    ctaText: "REQUEST A QUOTE",
    ctaUrl: "https://www.anjaniindustries.in/contact-us",
    stat1Value: "36+",
    stat1Label: "Years of Industry Excellence",
    stat2Value: "45K",
    stat2Label: "Sq Ft Production Facility",
    stat3Value: "270",
    stat3Label: "Pcs Annual Production Capacity",
    showStats: true,
    showProducts: true,
  },
};

export async function getEmailSettings() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    let settings = await EmailSetting.findOne({});
    if (!settings) {
      settings = await EmailSetting.create(defaultEmailSettings);
    } else {
      let needsSave = false;
      ['newsletterTemplate', 'branding'].forEach((key) => {
        if (!settings[key] || (typeof settings[key] === 'object' && Object.keys(settings[key]).length === 0)) {
          settings.set(key, defaultEmailSettings[key]);
          settings.markModified(key);
          needsSave = true;
        }
      });
      if (needsSave) {
        await settings.save();
      }
    }
    const plain = JSON.parse(JSON.stringify(settings.toObject ? settings.toObject() : settings));
    ['branding', 'userTemplate', 'adminTemplate', 'newsletterTemplate', 'exhibitorTemplate'].forEach((key) => {
      if (!plain[key]) {
        plain[key] = defaultEmailSettings[key];
      }
    });
    return { ...plain, _id: plain._id?.toString() };
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
      ['smtp', 'branding', 'userTemplate', 'adminTemplate', 'newsletterTemplate', 'exhibitorTemplate'].forEach((key) => {
        if (emailData[key]) {
          const curr = settings[key]?.toObject ? settings[key].toObject() : settings[key] || {};
          settings.set(key, { ...curr, ...emailData[key] });
          settings.markModified(key);
        }
      });
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

/* =========================================================================
   TIMELINE (OUR STORY MILESTONES)
========================================================================= */

export async function getTimeline(includeInactive = false) {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const query = includeInactive ? {} : { isActive: { $ne: false } };
    const items = await Timeline.find(query).sort({ order: 1, createdAt: 1 }).lean();
    if (items && items.length > 0) {
      const clean = JSON.parse(JSON.stringify(items));
      return clean.map((item) => ({ ...item, _id: item._id?.toString() || item.id, id: item._id?.toString() || item.id }));
    }
  } catch (err) {
    console.warn("[MongoDB] getTimeline fallback:", err.message);
  }
  const fallback = readFallbackJson("timeline.json") || [];
  return includeInactive ? fallback : fallback.filter((item) => item.isActive !== false);
}

export async function getTimelineItemById(id) {
  try {
    await connectToDatabase();
    const item = await Timeline.findById(id).lean();
    if (!item) return null;
    return { ...item, _id: item._id.toString(), id: item._id.toString() };
  } catch (err) {
    console.error("[MongoDB] getTimelineItemById error:", err);
    return null;
  }
}

export async function saveTimelineItem(data) {
  try {
    await connectToDatabase();
    if (data._id || data.id) {
      const id = data._id || data.id;
      const { _id, id: removeId, ...updateData } = data;
      const updated = await Timeline.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (updated) {
        return { ...updated, _id: updated._id.toString(), id: updated._id.toString() };
      }
    }

    if (data.order === undefined || data.order === null) {
      const count = await Timeline.countDocuments();
      data.order = count + 1;
    }

    const created = await Timeline.create(data);
    return { ...created.toObject(), _id: created._id.toString(), id: created._id.toString() };
  } catch (err) {
    console.error("[MongoDB] saveTimelineItem error:", err);
    throw err;
  }
}

export async function deleteTimelineItem(id) {
  try {
    await connectToDatabase();
    const deleted = await Timeline.findByIdAndDelete(id).lean();
    return !!deleted;
  } catch (err) {
    console.error("[MongoDB] deleteTimelineItem error:", err);
    throw err;
  }
}

export async function reorderTimeline(orderedIds) {
  try {
    await connectToDatabase();
    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index + 1 } },
      },
    }));
    await Timeline.bulkWrite(ops);
    return true;
  } catch (err) {
    console.error("[MongoDB] reorderTimeline error:", err);
    throw err;
  }
}

/* =========================================================================
   EXHIBITORS DIRECTORY (Only firstName, lastName, email, phone with Pagination)
========================================================================= */

export async function getExhibitors({ search = "", page = 1, limit = 10 } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  try {
    await connectToDatabase();
    await ensureSeeded();

    let query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query = {
        $or: [
          { firstName: regex },
          { lastName: regex },
          { companyName: regex },
          { country: regex },
          { email: regex },
          { phone: regex },
        ],
      };
    }

    const total = await Exhibitor.countDocuments(query);
    const items = await Exhibitor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const clean = JSON.parse(JSON.stringify(items)).map((e) => ({
      ...e,
      _id: e._id?.toString() || e.id,
      id: e.id || e._id?.toString(),
    }));

    return {
      exhibitors: clean,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  } catch (err) {
    console.warn("[MongoDB] getExhibitors fallback:", err.message);
  }

  // Fallback to data/exhibitors.json
  let list = readFallbackJson("exhibitors.json") || [];
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (e) =>
        (e.firstName && e.firstName.toLowerCase().includes(q)) ||
        (e.lastName && e.lastName.toLowerCase().includes(q)) ||
        (e.companyName && e.companyName.toLowerCase().includes(q)) ||
        (e.country && e.country.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.phone && e.phone.toLowerCase().includes(q))
    );
  }
  const total = list.length;
  const items = list.slice(skip, skip + limitNum);
  return {
    exhibitors: items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

export async function getExhibitorById(id) {
  try {
    await connectToDatabase();
    await ensureSeeded();
    let exhibitor = await Exhibitor.findOne({ id }).lean();
    if (!exhibitor && id.match(/^[0-9a-fA-F]{24}$/)) {
      exhibitor = await Exhibitor.findById(id).lean();
    }
    if (exhibitor) {
      const clean = JSON.parse(JSON.stringify(exhibitor));
      return {
        ...clean,
        _id: clean._id?.toString() || clean.id,
        id: clean.id || clean._id?.toString(),
      };
    }
  } catch (err) {
    console.warn("[MongoDB] getExhibitorById fallback:", err.message);
  }
  const list = readFallbackJson("exhibitors.json") || [];
  return list.find((e) => e.id === id || e._id === id) || null;
}

export async function createExhibitor({ firstName, lastName, companyName, country, email, phone }) {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const newId = `exh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const created = await Exhibitor.create({
      id: newId,
      firstName: (firstName || "").trim(),
      lastName: (lastName || "").trim(),
      companyName: (companyName || "").trim(),
      country: (country || "").trim(),
      email: (email || "").trim().toLowerCase(),
      phone: (phone || "").trim(),
    });
    return { ...created.toObject(), _id: created._id.toString() };
  } catch (err) {
    console.error("[MongoDB] createExhibitor error:", err);
    throw err;
  }
}

export async function updateExhibitor(id, { firstName, lastName, companyName, country, email, phone }) {
  try {
    await connectToDatabase();
    let existing = await Exhibitor.findOne({ id });
    if (!existing && id.match(/^[0-9a-fA-F]{24}$/)) {
      existing = await Exhibitor.findById(id);
    }
    if (!existing) throw new Error("Exhibitor not found");

    if (firstName !== undefined) existing.firstName = firstName.trim();
    if (lastName !== undefined) existing.lastName = lastName.trim();
    if (companyName !== undefined) existing.companyName = companyName.trim();
    if (country !== undefined) existing.country = country.trim();
    if (email !== undefined) existing.email = email.trim().toLowerCase();
    if (phone !== undefined) existing.phone = phone.trim();

    await existing.save();
    return { ...existing.toObject(), _id: existing._id.toString() };
  } catch (err) {
    console.error("[MongoDB] updateExhibitor error:", err);
    throw err;
  }
}

export async function deleteExhibitor(id) {
  try {
    await connectToDatabase();
    let res = await Exhibitor.deleteOne({ id });
    if (res.deletedCount === 0 && id.match(/^[0-9a-fA-F]{24}$/)) {
      res = await Exhibitor.findByIdAndDelete(id);
    }
    return true;
  } catch (err) {
    console.error("[MongoDB] deleteExhibitor error:", err);
    throw err;
  }
}
