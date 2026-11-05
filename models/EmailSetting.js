import mongoose from "mongoose";

const EmailSettingSchema = new mongoose.Schema(
  {
    smtp: {
      enabled: { type: Boolean, default: false },
      host: { type: String, default: "smtp.gmail.com" },
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: false },
      auth: {
        user: { type: String, default: "" },
        pass: { type: String, default: "" },
      },
      fromName: { type: String, default: "Anjani Industries" },
      fromEmail: { type: String, default: "" },
      replyTo: { type: String, default: "" },
      adminNotificationEmail: { type: String, default: "anjani_ind@yahoo.com" },
    },
    userTemplate: {
      enabled: { type: Boolean, default: true },
      subject: {
        type: String,
        default: "Thank you for contacting Anjani Industries - Fabric Dyeing Machinery",
      },
      heading: {
        type: String,
        default: "Inquiry Received Successfully",
      },
      body: {
        type: String,
        default:
          "Dear {userName},\n\nThank you for reaching out to Anjani Industries. We have received your inquiry regarding our textile dyeing and processing machinery. Our technical sales engineering team will review your specifications and get in touch with you shortly.",
      },
      ctaText: {
        type: String,
        default: "Explore Machinery Catalog",
      },
      ctaUrl: {
        type: String,
        default: "https://www.anjaniindustries.in/products",
      },
      footerNote: {
        type: String,
        default:
          "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370",
      },
    },
    adminTemplate: {
      enabled: { type: Boolean, default: true },
      subject: {
        type: String,
        default: "[New Inquiry Alert] {userName} - {subject}",
      },
      heading: {
        type: String,
        default: "New Customer Inquiry Received",
      },
      body: {
        type: String,
        default:
          "A new customer inquiry has just been submitted on the Anjani Industries website. Please find the lead details below and respond to the customer promptly.",
      },
      footerNote: {
        type: String,
        default: "Internal Sales Notification - Anjani Industries Machinery Lead Capture",
      },
    },
    newsletterTemplate: {
      enabled: { type: Boolean, default: true },
      subject: {
        type: String,
        default: "Welcome to Anjani Industries Newsletter - Textile Machinery Updates",
      },
      heading: {
        type: String,
        default: "Thank You for Subscribing!",
      },
      body: {
        type: String,
        default:
          "Dear Subscriber,\n\nThank you for subscribing to the Anjani Industries newsletter!\n\nYou are now part of our valued community. You will receive regular updates about our latest fabric dyeing machinery innovations, eco-friendly technological breakthroughs, industry trends, and global exhibition announcements directly in your inbox.\n\nIf you ever need technical advice or customized machinery specifications, our engineering team is here to assist you.",
      },
      ctaText: {
        type: String,
        default: "Explore Machinery Range",
      },
      ctaUrl: {
        type: String,
        default: "https://www.anjaniindustries.in/products",
      },
      footerNote: {
        type: String,
        default:
          "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370 | info@anjaniindustries.in",
      },
    },
    branding: {
      logoUrl: { type: String, default: "/assets/img/logo.png" },
      companyName: { type: String, default: "Anjani Industries" },
      tagline: { type: String, default: "Fabric Dyeing & Textile Processing Machinery" },
      phone: { type: String, default: "+91 8154 888 370" },
      email: { type: String, default: "info@anjaniindustries.in" },
      website: { type: String, default: "https://www.anjaniindustries.in" },
      address: {
        type: String,
        default: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India",
      },
    },
  },
  { timestamps: true, strict: false }
);

delete mongoose.models.EmailSetting;
export default mongoose.models.EmailSetting ||
  mongoose.model("EmailSetting", EmailSettingSchema);
