import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { getEmailSettings } from "./db.js";

/**
 * Returns CID logo attachment for inline email rendering
 */
export function getLogoAttachment() {
  const logoPath = path.join(process.cwd(), "public", "assets", "img", "logo.png");
  if (fs.existsSync(logoPath)) {
    return [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "anjani-logo",
      },
    ];
  }
  return [];
}

/**
 * Replace placeholders in template text
 */
export function replaceVariables(templateText = "", variables = {}) {
  let result = templateText || "";
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(regex, variables[key] ?? "");
  });
  return result;
}

/**
 * Build nodemailer transporter from SMTP configuration
 */
export function createTransporter(smtpConfig) {
  if (!smtpConfig || !smtpConfig.host) {
    throw new Error("SMTP configuration is incomplete: host is missing.");
  }

  const port = Number(smtpConfig.port) || 587;
  const isSecure = smtpConfig.secure === true || port === 465;

  const transportOpts = {
    host: smtpConfig.host,
    port: port,
    secure: isSecure,
    auth: {
      user: smtpConfig.auth?.user || "",
      pass: smtpConfig.auth?.pass || "",
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  return nodemailer.createTransport(transportOpts);
}

/**
 * Generate branded Anjani Industries HTML email
 */
export function buildHtmlEmail({
  heading = "",
  body = "",
  inquiryDetails = null,
  footerNote = "Anjani Industries - Leading Textile Machinery Manufacturer since 1990",
  ctaUrl = "https://www.anjaniindustries.in",
  ctaText = "Visit Website",
  logoUrl = "cid:anjani-logo",
}) {
  const formattedBody = (body || "")
    .split("\n\n")
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #334155; font-size: 15px;">${p.replace(/\n/g, "<br/>")}</p>`,
    )
    .join("");

  let detailsTable = "";
  if (inquiryDetails) {
    detailsTable = `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Inquiry Submission Details</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${inquiryDetails.name ? `<tr><td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 500;">Customer Name:</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${inquiryDetails.name}</td></tr>` : ""}
          ${inquiryDetails.email ? `<tr><td style="padding: 6px 0; color: #64748b; font-weight: 500;">Email Address:</td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${inquiryDetails.email}" style="color: #cb0000; text-decoration: none;">${inquiryDetails.email}</a></td></tr>` : ""}
          ${inquiryDetails.phone ? `<tr><td style="padding: 6px 0; color: #64748b; font-weight: 500;">Phone / WhatsApp:</td><td style="padding: 6px 0; color: #0f172a;"><a href="tel:${inquiryDetails.phone}" style="color: #0f172a; text-decoration: none; font-weight: 600;">${inquiryDetails.phone}</a></td></tr>` : ""}
          ${inquiryDetails.subject ? `<tr><td style="padding: 6px 0; color: #64748b; font-weight: 500;">Product / Subject:</td><td style="padding: 6px 0; color: #cb0000; font-weight: 600;">${inquiryDetails.subject}</td></tr>` : ""}
          ${inquiryDetails.message ? `<tr><td style="padding: 6px 0; color: #64748b; font-weight: 500; vertical-align: top;">Message:</td><td style="padding: 6px 0; color: #334155; line-height: 1.5; background: #fff; padding: 8px 10px; border-radius: 4px; border: 1px solid #e2e8f0;">${inquiryDetails.message.replace(/\n/g, "<br/>")}</td></tr>` : ""}
        </table>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading && heading.trim() ? heading.trim() : "Anjani Industries"}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner with Brand Logo -->
          <tr>
            <td style="background-color: #0c0d14; border-top: 4px solid #cb0000; padding: 22px 24px; text-align: center;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://www.anjaniindustries.in" target="_blank" style="text-decoration: none; display: inline-block;">
                      <table border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.25);">
                        <tr>
                          <td style="padding: 8px 18px; text-align: center;">
                            <img src="${logoUrl || 'cid:anjani-logo'}" alt="Anjani Industries - The Dyeing Machine Company" width="180" height="42" style="display: block; width: auto; max-width: 200px; max-height: 44px; height: 42px; border: 0; outline: none; text-decoration: none; margin: 0 auto;" />
                          </td>
                        </tr>
                      </table>
                    </a>
                    <div style="color: #94a3b8; font-size: 11px; margin-top: 10px; letter-spacing: 0.8px; text-transform: uppercase; font-weight: 600;">
                      Fabric Dyeing &amp; Textile Processing Machinery
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              ${heading && heading.trim() ? `<h2 style="margin: 0 0 18px 0; color: #0f172a; font-size: 20px; font-weight: 700;">${heading.trim()}</h2>` : ""}
              
              ${formattedBody}

              ${detailsTable}

              ${
                ctaUrl
                  ? `
              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="${ctaUrl}" target="_blank" style="background-color: #cb0000; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">${ctaText}</a>
              </div>
              `
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 30px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                ${footerNote}
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Anjani Industries. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

import { EXHIBITOR_EMAIL_PRODUCTS } from "./emailerProducts.js";
export { EXHIBITOR_EMAIL_PRODUCTS };

/**
 * Returns CID inline attachments for the 14 Exhibitor/Newsletter catalog images
 */
export function getExhibitorEmailerAttachments({ showProducts = true } = {}) {
  const dir = path.join(process.cwd(), "public", "emailer-assets");
  const attachments = [];

  const baseFiles = [
    { filename: "logo.jpg", cid: "emailer_logo" },
    { filename: "hero_factory.jpg", cid: "emailer_hero_factory" },
  ];

  for (const f of baseFiles) {
    const fullPath = path.join(dir, f.filename);
    if (fs.existsSync(fullPath)) {
      attachments.push({
        filename: f.filename,
        path: fullPath,
        cid: f.cid,
      });
    }
  }

  if (showProducts) {
    for (let i = 1; i <= 12; i++) {
      const num = String(i).padStart(2, "0");
      const filename = `product_${num}.jpg`;
      const fullPath = path.join(dir, filename);
      if (fs.existsSync(fullPath)) {
        attachments.push({
          filename,
          path: fullPath,
          cid: `emailer_product_${num}`,
        });
      }
    }
  }

  return attachments;
}

/**
 * Generate rich Exhibitor HTML email matching the official catalog emailer design
 */
export function buildExhibitorHtmlEmail({
  heading = "",
  body = "",
  ctaText = "REQUEST A QUOTE",
  ctaUrl = "https://www.anjaniindustries.in/contact-us",
  baseUrl = "https://www.anjaniindustries.in",
  stat1Value = "36+",
  stat1Label = "Years of Industry<br />Excellence",
  stat2Value = "45K",
  stat2Label = "Sq Ft Production<br />Facility",
  stat3Value = "270",
  stat3Label = "Pcs Annual<br />Production Capacity",
  showStats = true,
  showProducts = true,
  useCid = true,
}) {
  const formattedBody = (body || "")
    .split("\n\n")
    .map(
      (p) =>
        `<p style="margin: 0 0 14px 0; line-height: 1.6; color: #1e293b; font-size: 15px;">${p.replace(/\n/g, "<br/>")}</p>`
    )
    .join("");

  const cleanBase = baseUrl ? baseUrl.replace(/\/$/, "") : "";
  const logoSrc = useCid ? "cid:emailer_logo" : `${cleanBase}/emailer-assets/logo.jpg`;
  const heroSrc = useCid ? "cid:emailer_hero_factory" : `${cleanBase}/emailer-assets/hero_factory.jpg`;

  let productsHtml = "";
  if (showProducts) {
    const rows = [];
    for (let i = 0; i < EXHIBITOR_EMAIL_PRODUCTS.length; i += 2) {
      const p1 = EXHIBITOR_EMAIL_PRODUCTS[i];
      const p2 = EXHIBITOR_EMAIL_PRODUCTS[i + 1];
      const p1Img = useCid ? `cid:emailer_product_${String(i + 1).padStart(2, "0")}` : `${cleanBase}${p1.image}`;
      const p2Img = (useCid && p2) ? `cid:emailer_product_${String(i + 2).padStart(2, "0")}` : (p2 ? `${cleanBase}${p2.image}` : "");
      rows.push(`
        <tr>
          <td class="mobile-pad" style="padding: 0 18px 12px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="col" width="50%" valign="top" style="padding: 0 7px 0 0px">
                  <a target="_blank" href="https://www.anjaniindustries.in/${p1.slug}" style="text-decoration: none; color: #111">
                    <img class="product-img" src="${p1Img}" width="270" alt="${p1.name}" style="display: block; width: 100%; height: auto; border: 0" />
                    <div class="small" style="font-size: 14px; line-height: 19px; padding: 6px 0 9px; color: #111; font-weight: 500;">
                      ${p1.name}
                    </div>
                  </a>
                </td>
                ${
                  p2
                    ? `
                <td class="col" width="50%" valign="top" style="padding: 0 0px 0 7px">
                  <a target="_blank" href="https://www.anjaniindustries.in/${p2.slug}" style="text-decoration: none; color: #111">
                    <img class="product-img" src="${p2Img}" width="270" alt="${p2.name}" style="display: block; width: 100%; height: auto; border: 0" />
                    <div class="small" style="font-size: 14px; line-height: 19px; padding: 6px 0 9px; color: #111; font-weight: 500;">
                      ${p2.name}
                    </div>
                  </a>
                </td>
                `
                    : '<td width="50%"></td>'
                }
              </tr>
            </table>
          </td>
        </tr>
      `);
    }
    productsHtml = `
      <tr>
        <td align="center" style="padding: 16px 10px 18px">
          <div style="font-size: 26px; font-weight: bold; letter-spacing: 0.5px;">
            OUR <span style="color: #ef3339">PRODUCTS</span>
          </div>
          <div style="font-size: 12px; font-weight: bold; letter-spacing: 1px; line-height: 17px; color: #334155; margin-top: 4px;">
            ADVANCE TEXTILE<br />DYEING &amp; PROCESSING MACHINES
          </div>
        </td>
      </tr>
      ${rows.join("")}
    `;
  }

  let statsHtml = "";
  if (showStats) {
    statsHtml = `
      <tr>
        <td style="padding: 15px 20px 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" width="33.33%" style="border-right: 1px solid #eee; padding: 4px">
                <div style="font-size: 32px; font-weight: bold; color: #f03b3f">
                  ${stat1Value}
                </div>
                <div style="font-size: 13px; line-height: 16px; color: #334155; margin-top: 4px;">
                  ${stat1Label}
                </div>
              </td>
              <td align="center" width="33.33%" style="border-right: 1px solid #eee; padding: 4px">
                <div style="font-size: 32px; font-weight: bold; color: #f03b3f">
                  ${stat2Value}
                </div>
                <div style="font-size: 13px; line-height: 16px; color: #334155; margin-top: 4px;">
                  ${stat2Label}
                </div>
              </td>
              <td align="center" width="33.33%" style="padding: 4px">
                <div style="font-size: 32px; font-weight: bold; color: #f03b3f">
                  ${stat3Value}
                </div>
                <div style="font-size: 13px; line-height: 16px; color: #334155; margin-top: 4px;">
                  ${stat3Label}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  const headingHtml = heading && heading.trim()
    ? `<tr><td align="center" style="padding: 20px 24px 0 24px;"><div style="font-size: 20px; font-weight: 700; color: #ef3339;">${heading.trim()}</div></td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${heading && heading.trim() ? heading.trim() : "Anjani Industries | Textile Dyeing Machinery"}</title>
</head>
<body style="margin: 0; padding: 0; background: #e9eef1; font-family: Arial, Helvetica, sans-serif; color: #111">
  <center style="width: 100%; background: #e9eef1">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 20px 0">
          <table role="presentation" class="wrapper" width="600" style="width: 600px; max-width: 600px; background: #fff; border-collapse: collapse; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 8px; overflow: hidden;" cellpadding="0" cellspacing="0" border="0">
            <!-- Top Logo -->
            <tr>
              <td align="center" style="padding: 16px 20px; background: #fff">
                <a href="https://www.anjaniindustries.in/" target="_blank">
                  <img src="${logoSrc}" width="260" style="display: block; max-width: 100%; height: auto; border: 0" alt="Anjani Industries" />
                </a>
              </td>
            </tr>
            <!-- Hero Factory Banner -->
            <tr>
              <td>
                <img src="${heroSrc}" width="600" style="display: block; width: 100%; height: auto; border: 0;" alt="Anjani Industries Factory" />
              </td>
            </tr>
            <!-- Optional Heading -->
            ${headingHtml}
            <!-- Message Body -->
            <tr>
              <td class="mobile-pad" style="padding: 24px 36px 16px; font-size: 15px; line-height: 22px; color: #1e293b;">
                ${formattedBody}
              </td>
            </tr>
            <!-- Stats Bar -->
            ${statsHtml}
            <!-- Products Showcase -->
            ${productsHtml}
            <!-- Red CTA Banner -->
            <tr>
              <td align="center" style="background: #e50000; color: #fff; padding: 28px 15px 25px">
                <div style="font-size: 12px; letter-spacing: 2px">CONNECT WITH US</div>
                <div style="font-size: 24px; font-weight: bold; line-height: 30px; margin: 7px 0 16px;">
                  Need Reliable Dyeing Solutions?
                </div>
                <a target="_blank" href="${ctaUrl || "https://www.anjaniindustries.in/contact-us"}" style="display: inline-block; background: #fff; color: #df1111; padding: 12px 24px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 4px;">
                  ${ctaText || "REQUEST A QUOTE"}
                </a>
              </td>
            </tr>
            <!-- Dark Footer -->
            <tr>
              <td style="background: #050505; color: #eee; padding: 25px 22px 14px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" width="44%" style="font-size: 12px; line-height: 17px; padding-right: 8px">
                      <b style="color: #fff">ADDRESS</b><br />Plot No. 983 &amp; 984, Road No. 58, GIDC Sachin, Surat – 394230, Gujarat, India
                    </td>
                    <td valign="top" width="26%" style="font-size: 12px; line-height: 17px; padding: 0 8px; border-left: 1px solid #555;">
                      <b style="color: #fff">PHONE</b><br />
                      <a style="color: #fff; text-decoration: none;" target="_blank" href="tel:+918154888370">+91-8154888370</a><br />
                      <a style="color: #fff; text-decoration: none;" target="_blank" href="tel:+917096007670">+91-7096007670</a>
                    </td>
                    <td valign="top" width="30%" style="font-size: 13px; line-height: 17px; padding-left: 8px; border-left: 1px solid #555;">
                      <b style="color: #fff">EMAIL</b><br />
                      <a target="_blank" href="mailto:info@anjaniindustries.in" style="color: #eee; text-decoration: none">info@anjaniindustries.in</a>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 12px; line-height: 20px; margin: 20px 0 14px; color: #94a3b8;">
                  <b style="color: #fff;">Sales &amp; Service Offices:</b><br />
                  India – Surat, Ahmedabad, Mumbai, Ludhiana, Amritsar &amp; Bhilwara.<br />
                  International – Colombo, Sri Lanka; Bandung, Indonesia.
                </p>
                <div style="border-top: 1px solid #333; text-align: center; padding: 14px 0; color: #fff; font-size: 13px;">
                  <a target="_blank" href="https://www.facebook.com/anjaniindustriess/" style="color: #fff; text-decoration: none">Facebook</a>
                  &nbsp; | &nbsp;
                  <a target="_blank" href="https://www.linkedin.com/company/anjaniindustries/" style="color: #fff; text-decoration: none">LinkedIn</a>
                  &nbsp; | &nbsp;
                  <a target="_blank" href="https://www.youtube.com/channel/UCQQSNOPZex4BUe7mN87DrIA" style="color: #fff; text-decoration: none">YouTube</a>
                  &nbsp; | &nbsp;
                  <a target="_blank" href="https://in.pinterest.com/Anjaniindustries/" style="color: #fff; text-decoration: none">Pinterest</a>
                </div>
                <div style="border-top: 1px solid #333; text-align: center; padding: 12px 0; font-size: 13px;">
                  <a target="_blank" href="https://www.anjaniindustries.in/" style="color: #ccc; text-decoration: none">www.anjaniindustries.in</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

/**
 * Send immediate test email to verify SMTP configuration
 */
export async function sendTestEmail({ to, smtpConfig }) {
  const config = smtpConfig || (await getEmailSettings()).smtp;
  if (!config || !config.host) {
    throw new Error(
      "SMTP host is missing. Please configure your SMTP server details.",
    );
  }

  const transporter = createTransporter(config);
  await transporter.verify();

  const fromAddress = `"${config.fromName || "Anjani Industries"}" <${config.fromEmail || config.auth?.user}>`;

  const html = buildHtmlEmail({
    heading: "SMTP Test Email Verified Successfully",
    body: `Hello,\n\nThis is a test email sent from your **Anjani Industries Admin Panel**.\n\nYour SMTP server (${config.host}:${config.port || 587}) is configured correctly and ready to send dynamic customer auto-replies and sales lead notifications!`,
    footerNote: "Automated test dispatch from Anjani Industries Admin CMS",
    ctaUrl: "https://www.anjaniindustries.in",
    ctaText: "Anjani Industries Live Site",
  });

  const info = await transporter.sendMail({
    from: fromAddress,
    to: to,
    replyTo: config.replyTo || config.fromEmail,
    subject: "Test Email: Anjani Industries SMTP Configured Successfully",
    html: html,
    attachments: getLogoAttachment(),
  });

  return info;
}

/**
 * Trigger asynchronous emails when a new customer inquiry is received
 */
export async function sendInquiryEmails({ inquiry }) {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.smtp) {
      console.log(
        "[Mailer] SMTP settings not found. Skipping automatic email delivery.",
      );
      return { skipped: true, reason: "SMTP settings missing" };
    }

    const { smtp, userTemplate, adminTemplate } = settings;
    const hasCredentials = Boolean(smtp.host && smtp.auth?.user && smtp.auth?.pass);
    if (!smtp.enabled && !hasCredentials) {
      console.log(
        "[Mailer] SMTP is disabled. Skipping automatic email delivery.",
      );
      return { skipped: true, reason: "SMTP disabled" };
    }

    if (!smtp.host || !smtp.auth?.user) {
      console.warn("[Mailer] SMTP credentials incomplete.");
      return { skipped: true, reason: "Incomplete SMTP credentials" };
    }

    const transporter = createTransporter(smtp);
    const senderEmail = smtp.auth?.user || smtp.fromEmail;
    const fromAddress = `"${smtp.fromName || "Anjani Industries"}" <${senderEmail}>`;

    const variables = {
      userName: inquiry.name || "Valued Customer",
      userEmail: inquiry.email || "",
      userPhone: inquiry.phone || "",
      subject: inquiry.subject || "Textile Machinery Inquiry",
      message: inquiry.message || "",
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      companyName: "Anjani Industries",
      companyPhone: "+91 8154 888 370",
      companyEmail: "anjani_ind@yahoo.com",
      companyWebsite: "https://www.anjaniindustries.in",
    };

    const results = {};

    // 1. Send Confirmation Email to Customer
    if (userTemplate?.enabled && inquiry.email) {
      try {
        const userSubject = replaceVariables(userTemplate.subject, variables);
        const userHeading = replaceVariables(userTemplate.heading, variables);
        const userBody = replaceVariables(userTemplate.body, variables);
        const userFooter = replaceVariables(userTemplate.footerNote, variables);

        const userHtml = buildHtmlEmail({
          heading: userHeading,
          body: userBody,
          inquiryDetails: inquiry,
          footerNote: userFooter,
          ctaUrl: userTemplate.ctaUrl || "https://www.anjaniindustries.in/products",
          ctaText: userTemplate.ctaText || "Explore Machinery Catalog",
        });

        const userSendResult = await transporter.sendMail({
          from: fromAddress,
          to: inquiry.email,
          replyTo: smtp.replyTo || smtp.fromEmail,
          subject: userSubject,
          html: userHtml,
          attachments: getLogoAttachment(),
        });

        results.userEmail = {
          success: true,
          messageId: userSendResult.messageId,
        };
        console.log(`[Mailer] Confirmation email sent to ${inquiry.email}`);
      } catch (err) {
        console.error("[Mailer] User confirmation email error:", err.message);
        results.userEmail = { success: false, error: err.message };
      }
    }

    // 2. Send Lead Alert Email to Admin
    const adminEmailRecipient =
      smtp.adminNotificationEmail || "anjani_ind@yahoo.com";
    if (adminTemplate?.enabled && adminEmailRecipient) {
      try {
        const adminSubject = replaceVariables(adminTemplate.subject, variables);
        const adminHeading = replaceVariables(adminTemplate.heading, variables);

        const defaultAdminBody = `A new customer inquiry has just been submitted on the Anjani Industries website. Please find the lead details below and respond to the customer promptly.`;
        const adminBody = adminTemplate.body ? replaceVariables(adminTemplate.body, variables) : defaultAdminBody;
        const adminFooter = adminTemplate.footerNote || "Internal Sales Notification - Anjani Industries Machinery Lead Capture";

        const adminHtml = buildHtmlEmail({
          heading: adminHeading,
          body: adminBody,
          inquiryDetails: inquiry,
          footerNote: adminFooter,
          ctaUrl: `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject || "Textile Machinery Inquiry")}`,
          ctaText: `Reply to ${inquiry.name || "Customer"}`,
        });

        const adminSendResult = await transporter.sendMail({
          from: fromAddress,
          to: adminEmailRecipient,
          replyTo: inquiry.email,
          subject: adminSubject,
          html: adminHtml,
          attachments: getLogoAttachment(),
        });

        results.adminEmail = {
          success: true,
          messageId: adminSendResult.messageId,
        };
        console.log(`[Mailer] Admin lead alert sent to ${adminEmailRecipient}`);
      } catch (err) {
        console.error(
          "[Mailer] Admin lead notification email error:",
          err.message,
        );
        results.adminEmail = { success: false, error: err.message };
      }
    }

    return results;
  } catch (err) {
    console.error("[Mailer] General send error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Trigger asynchronous welcome email when a visitor subscribes to the newsletter
 */
export async function sendNewsletterEmails({ subscriberEmail, inquiry }) {
  try {
    const settings = await getEmailSettings();
    if (!settings || !settings.smtp) {
      console.log("[Mailer] SMTP settings not found. Skipping newsletter welcome email.");
      return { skipped: true, reason: "SMTP settings missing" };
    }

    const { smtp, newsletterTemplate, adminTemplate } = settings;
    const hasCredentials = Boolean(smtp.host && smtp.auth?.user && smtp.auth?.pass);
    if (!smtp.enabled && !hasCredentials) {
      console.log("[Mailer] SMTP disabled. Skipping newsletter welcome email.");
      return { skipped: true, reason: "SMTP disabled" };
    }

    if (!smtp.host || !smtp.auth?.user) {
      console.warn("[Mailer] SMTP credentials incomplete.");
      return { skipped: true, reason: "Incomplete SMTP credentials" };
    }

    const transporter = createTransporter(smtp);
    const senderEmail = smtp.auth?.user || smtp.fromEmail;
    const fromAddress = `"${smtp.fromName || "Anjani Industries"}" <${senderEmail}>`;

    const variables = {
      subscriberEmail: subscriberEmail || "",
      userName: "Valued Subscriber",
      userEmail: subscriberEmail || "",
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      companyName: "Anjani Industries",
      companyPhone: "+91 8154 888 370",
      companyEmail: "info@anjaniindustries.in",
      companyWebsite: "https://www.anjaniindustries.in",
    };

    const results = {};

    // 1. Send Welcome Email to Subscriber (uses Exhibitor 12-Machinery Catalog Template)
    const ext = settings.exhibitorTemplate || {};
    const template = {
      enabled: ext.enabled !== false,
      subject: ext.subject || newsletterTemplate?.subject || "Welcome to Anjani Industries - Textile Machinery Updates",
      heading: ext.heading !== undefined ? ext.heading : (newsletterTemplate?.heading || ""),
      body: ext.body || newsletterTemplate?.body || "Dear Subscriber,\n\nThank you for subscribing to Anjani Industries!\n\nWe are pleased to connect with you regarding our advanced textile dyeing and processing machinery solutions. Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.\n\nShould you need any technical documentation, capacity specifications, or customized machinery quotation, our engineering team is here to assist you.",
      ctaText: ext.ctaText || "REQUEST A QUOTE",
      ctaUrl: ext.ctaUrl || "https://www.anjaniindustries.in/contact-us",
    };

    if (template?.enabled !== false && subscriberEmail) {
      try {
        const userSubject = replaceVariables(template.subject, variables);
        const userHeading = template.heading ? replaceVariables(template.heading, variables) : "";
        const userBody = replaceVariables(template.body, variables);
        const baseUrl = settings.branding?.websiteUrl || "https://www.anjaniindustries.in";

        const showProducts = ext.showProducts !== false;
        const userHtml = buildExhibitorHtmlEmail({
          heading: userHeading,
          body: userBody,
          ctaText: template.ctaText,
          ctaUrl: template.ctaUrl,
          baseUrl,
          stat1Value: ext.stat1Value || "36+",
          stat1Label: ext.stat1Label || "Years of Industry<br />Excellence",
          stat2Value: ext.stat2Value || "45K",
          stat2Label: ext.stat2Label || "Sq Ft Production<br />Facility",
          stat3Value: ext.stat3Value || "270",
          stat3Label: ext.stat3Label || "Pcs Annual<br />Production Capacity",
          showStats: ext.showStats !== false,
          showProducts,
          useCid: true,
        });

        const userSendResult = await transporter.sendMail({
          from: fromAddress,
          to: subscriberEmail,
          replyTo: smtp.replyTo || smtp.fromEmail,
          subject: userSubject,
          html: userHtml,
          attachments: getExhibitorEmailerAttachments({ showProducts }),
        });

        results.subscriber = { success: true, messageId: userSendResult.messageId };
        console.log(`[Mailer] Newsletter welcome email sent to ${subscriberEmail}`);
      } catch (userErr) {
        console.error("[Mailer] Newsletter subscriber email failed:", userErr.message);
        results.subscriber = { success: false, error: userErr.message };
      }
    }

    // 2. Send Notification to Admin
    const adminEmailRecipient =
      smtp.adminNotificationEmail || "anjani_ind@yahoo.com";

    if (adminTemplate?.enabled !== false && adminEmailRecipient) {
      try {
        const adminSubject = `[Newsletter Signup Alert] ${subscriberEmail}`;
        const adminHtml = buildHtmlEmail({
          heading: "New Newsletter Subscriber",
          body: `A new visitor has subscribed to the Anjani Industries newsletter from the website footer:\n\n**Subscriber Email:** ${subscriberEmail}\n**Date:** ${variables.date}\n**Status:** Added to Inquiries & Email List`,
          footerNote: "Real-time dispatch from Anjani Industries Website",
          ctaUrl: "https://www.anjaniindustries.in/admin/inquiries",
          ctaText: "View Subscribers in Admin",
        });

        const adminSendResult = await transporter.sendMail({
          from: fromAddress,
          to: adminEmailRecipient,
          replyTo: subscriberEmail,
          subject: adminSubject,
          html: adminHtml,
          attachments: getLogoAttachment(),
        });

        results.admin = { success: true, messageId: adminSendResult.messageId };
        console.log(`[Mailer] Newsletter admin notification sent to ${adminEmailRecipient}`);
      } catch (adminErr) {
        console.error("[Mailer] Newsletter admin notification failed:", adminErr.message);
        results.admin = { success: false, error: adminErr.message };
      }
    }

    return results;
  } catch (err) {
    console.error("[Mailer] sendNewsletterEmails general error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send custom newsletter campaign / broadcast to a list of subscribers (uses Exhibitor 12-Machinery Catalog Template)
 */
export async function sendNewsletterCampaign({
  recipients = [],
  subject,
  heading,
  body,
  ctaText = "REQUEST A QUOTE",
  ctaUrl = "https://www.anjaniindustries.in/contact-us",
  footerNote,
}) {
  const settings = await getEmailSettings();
  if (!settings || !settings.smtp) {
    throw new Error(
      "SMTP settings not found. Please configure SMTP in Admin -> Email & SMTP settings."
    );
  }

  const { smtp, exhibitorTemplate, branding } = settings;
  const hasCredentials = Boolean(smtp.host && smtp.auth?.user && smtp.auth?.pass);
  if (!smtp.enabled && !hasCredentials) {
    throw new Error(
      "SMTP is currently disabled. Please enable and configure SMTP under Admin -> Email & SMTP settings before sending newsletters."
    );
  }

  if (!smtp.host || !smtp.auth?.user) {
    throw new Error(
      "SMTP configuration is incomplete. Host or User credential is missing in Admin -> Email & SMTP settings."
    );
  }

  const transporter = createTransporter(smtp);
  const senderEmail = smtp.auth?.user || smtp.fromEmail;
  const fromAddress = `"${smtp.fromName || "Anjani Industries"}" <${senderEmail}>`;
  const baseUrl = branding?.websiteUrl || "https://www.anjaniindustries.in";

  const results = {
    total: recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  for (const item of recipients) {
    const email = typeof item === "string" ? item.trim() : item?.email?.trim();
    const name = typeof item === "object" ? ([item.firstName, item.lastName].filter(Boolean).join(" ") || item.name || "") : "";

    if (!email || !email.includes("@")) {
      results.failed++;
      results.errors.push(`Invalid email: ${email || "empty"}`);
      continue;
    }

    try {
      const personalizedBody = replaceVariables(body, {
        subscriberName: name || "Valued Subscriber",
        userName: name || "Valued Subscriber",
        fullName: name || "Valued Subscriber",
        subscriberEmail: email,
        userEmail: email,
        email: email,
        companyName: "Anjani Industries",
        date: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      const personalizedHeading = heading && heading.trim()
        ? replaceVariables(heading.trim(), {
            subscriberName: name || "Valued Subscriber",
            fullName: name || "Valued Subscriber",
          })
        : "";

      const showProducts = exhibitorTemplate?.showProducts !== false;
      const html = buildExhibitorHtmlEmail({
        heading: personalizedHeading,
        body: personalizedBody,
        ctaText: ctaText || exhibitorTemplate?.ctaText || "REQUEST A QUOTE",
        ctaUrl: ctaUrl || exhibitorTemplate?.ctaUrl || "https://www.anjaniindustries.in/contact-us",
        baseUrl,
        stat1Value: exhibitorTemplate?.stat1Value || "36+",
        stat1Label: exhibitorTemplate?.stat1Label || "Years of Industry<br />Excellence",
        stat2Value: exhibitorTemplate?.stat2Value || "45K",
        stat2Label: exhibitorTemplate?.stat2Label || "Sq Ft Production<br />Facility",
        stat3Value: exhibitorTemplate?.stat3Value || "270",
        stat3Label: exhibitorTemplate?.stat3Label || "Pcs Annual<br />Production Capacity",
        showStats: exhibitorTemplate?.showStats !== false,
        showProducts,
        useCid: true,
      });

      await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: smtp.replyTo || smtp.fromEmail || fromAddress,
        subject: subject,
        html: html,
        attachments: getExhibitorEmailerAttachments({ showProducts }),
      });

      results.sent++;
    } catch (err) {
      console.error(`[Mailer] Error sending to ${email}:`, err.message);
      results.failed++;
      results.errors.push(`${email}: ${err.message}`);
    }
  }

  return results;
}

/**
 * Send welcome email automatically when a new exhibitor is added
 * Uses the exact Exhibitor Template configured in Admin -> Email Settings
 */
export async function sendExhibitorWelcomeMail(exhibitor) {
  if (!exhibitor || !exhibitor.email) {
    return { total: 0, sent: 0, failed: 1, errors: ["No valid exhibitor email provided"] };
  }

  const settings = await getEmailSettings();
  if (settings?.exhibitorTemplate && settings.exhibitorTemplate.enabled === false) {
    console.log("[Mailer] Exhibitor template is disabled. Skipping automatic welcome email.");
    return { total: 1, sent: 0, failed: 0, skipped: true };
  }

  // Sends the exact Exhibitor Template configured in Admin (subject, heading, body, CTA, stats, 12 products, CID images)
  return await sendExhibitorMail({
    recipients: [exhibitor],
  });
}

/**
 * Send direct email to Exhibitors (only firstName, lastName, email, phone)
 */
export async function sendExhibitorMail({
  recipients = [],
  customSubject = "",
  customHeading = "",
  customBody = "",
  customCtaText = "",
  customCtaUrl = "",
}) {
  const settings = await getEmailSettings();
  if (!settings || !settings.smtp) {
    throw new Error("SMTP settings not configured.");
  }

  const { smtp, branding, exhibitorTemplate } = settings;
  const hasCredentials = Boolean(smtp.host && smtp.auth?.user && smtp.auth?.pass);
  if (!smtp.enabled && !hasCredentials) {
    throw new Error("SMTP is disabled. Please enable SMTP under Admin -> Email & SMTP settings.");
  }

  const transporter = createTransporter(smtp);
  const senderEmail = smtp.auth?.user || smtp.fromEmail;
  const fromAddress = `"${smtp.fromName || "Anjani Industries"}" <${senderEmail}>`;

  const results = {
    total: recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  const companyName = branding?.companyName || "Anjani Industries";
  const baseUrl = branding?.websiteUrl || "https://www.anjaniindustries.in";

  for (const item of recipients) {
    const email = typeof item === "string" ? item.trim() : item?.email?.trim();
    const firstName = typeof item === "object" ? (item.firstName || "") : "";
    const lastName = typeof item === "object" ? (item.lastName || "") : "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Valued Exhibitor";
    const phone = typeof item === "object" ? (item.phone || "") : "";
    const exhibitorCompany = typeof item === "object" ? (item.companyName || "") : "";
    const country = typeof item === "object" ? (item.country || "") : "";

    if (!email || !email.includes("@")) {
      results.failed++;
      results.errors.push(`Invalid email: ${email || "empty"}`);
      continue;
    }

    const variables = {
      firstName: firstName || "Valued",
      lastName: lastName || "Partner",
      fullName,
      userName: fullName,
      name: fullName,
      email,
      phone,
      company: exhibitorCompany || companyName,
      companyName: exhibitorCompany || companyName,
      country,
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    try {
      const defaultSubject = exhibitorTemplate?.subject || `Official Communication from ${companyName}`;
      const defaultBody = exhibitorTemplate?.body || `Dear {fullName},\n\nWe are pleased to reach out regarding our advanced textile dyeing and processing machinery solutions. Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.\n\nShould you need any technical documentation or custom machinery specifications, our technical team is here to assist you.`;

      const subject = replaceVariables(customSubject || defaultSubject, variables);
      const heading = customHeading !== undefined && customHeading.trim() !== ""
        ? replaceVariables(customHeading.trim(), variables)
        : (customHeading === "" ? "" : (exhibitorTemplate?.heading ? replaceVariables(exhibitorTemplate.heading, variables) : ""));
      const body = replaceVariables(customBody || defaultBody, variables);
      const ctaText = replaceVariables(customCtaText || exhibitorTemplate?.ctaText || "REQUEST A QUOTE", variables);
      const ctaUrl = customCtaUrl || exhibitorTemplate?.ctaUrl || "https://www.anjaniindustries.in/contact-us";

      const showProducts = exhibitorTemplate?.showProducts !== false;
      const html = buildExhibitorHtmlEmail({
        heading,
        body,
        ctaText,
        ctaUrl,
        baseUrl,
        stat1Value: exhibitorTemplate?.stat1Value || "36+",
        stat1Label: exhibitorTemplate?.stat1Label || "Years of Industry<br />Excellence",
        stat2Value: exhibitorTemplate?.stat2Value || "45K",
        stat2Label: exhibitorTemplate?.stat2Label || "Sq Ft Production<br />Facility",
        stat3Value: exhibitorTemplate?.stat3Value || "270",
        stat3Label: exhibitorTemplate?.stat3Label || "Pcs Annual<br />Production Capacity",
        showStats: exhibitorTemplate?.showStats !== false,
        showProducts,
        useCid: true,
      });

      await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: smtp.replyTo || smtp.fromEmail || fromAddress,
        subject,
        html,
        attachments: getExhibitorEmailerAttachments({ showProducts }),
      });

      results.sent++;
    } catch (err) {
      console.error(`[Mailer] Error sending exhibitor mail to ${email}:`, err.message);
      results.failed++;
      results.errors.push(`${email}: ${err.message}`);
    }
  }

  return results;
}

