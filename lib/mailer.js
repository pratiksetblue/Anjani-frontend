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
  <title>${heading}</title>
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

    // 1. Send Welcome Email to Subscriber
    const template =
      newsletterTemplate || {
        enabled: true,
        subject: "Welcome to Anjani Industries Newsletter - Textile Machinery Updates",
        heading: "Thank You for Subscribing!",
        body: "Dear Subscriber,\n\nThank you for subscribing to the Anjani Industries newsletter!\n\nYou are now part of our valued community. You will receive regular updates about our latest fabric dyeing machinery innovations, eco-friendly technological breakthroughs, industry trends, and global exhibition announcements directly in your inbox.\n\nIf you ever need technical advice or customized machinery specifications, our engineering team is here to assist you.",
        footerNote: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370 | info@anjaniindustries.in",
      };

    if (template?.enabled !== false && subscriberEmail) {
      try {
        const userSubject = replaceVariables(template.subject, variables);
        const userHeading = replaceVariables(template.heading, variables);
        const userBody = replaceVariables(template.body, variables);
        const userFooter = replaceVariables(template.footerNote, variables);

        const userHtml = buildHtmlEmail({
          heading: userHeading,
          body: userBody,
          inquiryDetails: null,
          footerNote: userFooter,
          ctaUrl: template.ctaUrl || "https://www.anjaniindustries.in/products",
          ctaText: template.ctaText || "Explore Machinery Range",
        });

        const userSendResult = await transporter.sendMail({
          from: fromAddress,
          to: subscriberEmail,
          replyTo: smtp.replyTo || smtp.fromEmail,
          subject: userSubject,
          html: userHtml,
          attachments: getLogoAttachment(),
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
 * Send custom newsletter campaign / broadcast to a list of subscribers
 */
export async function sendNewsletterCampaign({
  recipients = [],
  subject,
  heading,
  body,
  ctaText = "Explore Machinery Range",
  ctaUrl = "https://www.anjaniindustries.in/products",
  footerNote,
}) {
  const settings = await getEmailSettings();
  if (!settings || !settings.smtp) {
    throw new Error(
      "SMTP settings not found. Please configure SMTP in Admin -> Email & SMTP settings."
    );
  }

  const { smtp } = settings;
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
        subscriberEmail: email,
        userEmail: email,
        companyName: "Anjani Industries",
        date: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      const html = buildHtmlEmail({
        heading: (heading && heading.trim()) ? heading.trim() : "",
        body: personalizedBody,
        inquiryDetails: null,
        footerNote:
          footerNote ||
          "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370 | info@anjaniindustries.in",
        ctaUrl: ctaUrl || "https://www.anjaniindustries.in/products",
        ctaText: ctaText || "Explore Machinery Range",
      });

      await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: smtp.replyTo || smtp.fromEmail || fromAddress,
        subject: subject,
        html: html,
        attachments: getLogoAttachment(),
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
 */
export async function sendExhibitorWelcomeMail(exhibitor) {
  if (!exhibitor || !exhibitor.email) {
    return { total: 0, sent: 0, failed: 1, errors: ["No valid exhibitor email provided"] };
  }

  const settings = await getEmailSettings();
  const companyName = settings?.branding?.companyName || "Anjani Industries";
  const fullName = [exhibitor.firstName, exhibitor.lastName].filter(Boolean).join(" ") || "Valued Exhibitor";
  const exhibitorCompany = exhibitor.companyName ? ` from ${exhibitor.companyName}` : "";

  const customSubject = `Welcome to ${companyName} - Exhibitor Registration Confirmed`;
  const customHeading = `Welcome, ${fullName}!`;
  const customBody = `Dear ${fullName},

Thank you for registering as an exhibitor${exhibitorCompany} with ${companyName}. Your contact details have been successfully recorded in our exhibitor directory.

We specialize in engineering advanced textile dyeing, processing, and finishing machinery solutions. If you need machinery catalogs, technical specifications, or would like to schedule a consultation, our technical team is always at your service.

We look forward to a successful collaboration with you.

Warm regards,
${companyName} Team`;

  return await sendExhibitorMail({
    recipients: [exhibitor],
    customSubject,
    customHeading,
    customBody,
    customCtaText: "Browse Machinery Catalog",
    customCtaUrl: "https://www.anjaniindustries.in/products",
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

  const { smtp, branding } = settings;
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
      const defaultSubject = `Official Communication from ${companyName}`;
      const defaultBody = `Dear {fullName},\n\nThank you for connecting with {companyName}. We are pleased to reach out regarding our advanced textile dyeing and processing machinery solutions.\n\nShould you need any technical documentation or custom machinery specifications, our technical team is here to assist you.`;

      const subject = replaceVariables(customSubject || defaultSubject, variables);
      const heading = customHeading && customHeading.trim()
        ? replaceVariables(customHeading.trim(), variables)
        : "";
      const body = replaceVariables(customBody || defaultBody, variables);
      const ctaText = replaceVariables(customCtaText || "Explore Machinery Catalog", variables);
      const ctaUrl = customCtaUrl || "https://www.anjaniindustries.in/products";
      const footerNote = replaceVariables(
        branding?.address ? `${branding.address} | Phone: ${branding.phone || "+91 8154 888 370"}` : "",
        variables
      );

      const html = buildHtmlEmail({
        heading,
        body,
        inquiryDetails: null,
        footerNote,
        ctaUrl,
        ctaText,
      });

      await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: smtp.replyTo || smtp.fromEmail || fromAddress,
        subject,
        html,
        attachments: getLogoAttachment(),
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

