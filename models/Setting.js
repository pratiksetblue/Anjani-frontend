import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Anjani Industries" },
    tagline: { type: String, default: "Textile Dyeing Machine Manufacturer & Exporter" },
    logo: { type: String, default: "/assets/img/logo.png" },
    headerCallText: { type: String, default: "Any Question" },
    phone: { type: String, default: "+91 8154 888 370" },
    whatsapp: { type: String, default: "+91 7096 007 670" },
    email: { type: String, default: "info@anjaniindustries.in" },
    headquarters: {
      title: { type: String, default: "HEADQUARTERS" },
      address: {
        type: String,
        default: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat- 394 230, Gujarat, India.",
      },
      phone: { type: String, default: "+91 8154 888 370" },
      mapUrl: { type: String, default: "https://maps.app.goo.gl/WAXYaDPz3nCyyMnk9" },
      mapEmbed: { type: String, default: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29780.700066562007!2d72.858335!3d21.089131!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be051ba4f3351b1%3A0x6989fdb5bd54742!2sAnjani%20Industries!5e0!3m2!1sen!2sin!4v1787140333015!5m2!1sen!2sin" },
    },
    salesOffices: [
      {
        country: { type: String },
        cities: { type: String },
      },
    ],
    socialLinks: {
      facebook: { type: String, default: "https://www.facebook.com/anjaniindustriess/" },
      pinterest: { type: String, default: "https://in.pinterest.com/Anjaniindustries/" },
      youtube: { type: String, default: "https://www.youtube.com/channel/UCQQSNOPZex4BUe7mN87DrIA" },
      linkedin: { type: String, default: "https://www.linkedin.com/company/anjaniindustries/" },
    },
    copyright: { type: String, default: "© 2026 Anjani industries. | Privacy Policy" },
    developerLink: { type: String, default: "https://www.setblue.com/" },
    developerName: { type: String, default: "Setblue.com" },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
