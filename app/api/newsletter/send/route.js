import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEmailSettings } from "@/lib/db";
import { sendNewsletterCampaign } from "@/lib/mailer";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getEmailSettings();
    const smtp = settings?.smtp || {};
    const isConfigured = Boolean(smtp.host && smtp.auth?.user);
    const isEnabled = Boolean(smtp.enabled && isConfigured);

    return NextResponse.json({
      success: true,
      smtpEnabled: isEnabled,
      smtpConfigured: isConfigured,
      host: smtp.host || "",
      port: smtp.port || 587,
      fromEmail: smtp.fromEmail || smtp.auth?.user || "",
      fromName: smtp.fromName || "Anjani Industries",
      adminNotificationEmail: smtp.adminNotificationEmail || "",
    });
  } catch (error) {
    console.error("Newsletter send check error:", error);
    return NextResponse.json(
      { error: "Failed to check SMTP status", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      recipients = [],
      subject,
      heading,
      message,
      ctaText,
      ctaUrl,
      footerNote,
    } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: "Subject line is required." },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Email message/body is required." },
        { status: 400 }
      );
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient email is required." },
        { status: 400 }
      );
    }

    const results = await sendNewsletterCampaign({
      recipients,
      subject: subject.trim(),
      heading: heading ? heading.trim() : subject.trim(),
      body: message.trim(),
      ctaText: ctaText ? ctaText.trim() : undefined,
      ctaUrl: ctaUrl ? ctaUrl.trim() : undefined,
      footerNote: footerNote ? footerNote.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${results.sent} subscriber(s).${results.failed > 0 ? ` (${results.failed} failed)` : ""}`,
      results,
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send newsletter email",
      },
      { status: 500 }
    );
  }
}
