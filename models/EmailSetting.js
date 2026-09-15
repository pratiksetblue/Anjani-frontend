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
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmailSetting ||
  mongoose.model("EmailSetting", EmailSettingSchema);
