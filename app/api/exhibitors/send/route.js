import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { sendExhibitorMail } from "@/lib/mailer";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      recipients = [],
      customSubject,
      customHeading,
      customBody,
      customCtaText,
      customCtaUrl,
    } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient is required to send email" },
        { status: 400 }
      );
    }

    const results = await sendExhibitorMail({
      recipients,
      customSubject,
      customHeading,
      customBody,
      customCtaText,
      customCtaUrl,
    });

    return NextResponse.json({
      success: true,
      message: `Email sending finished: ${results.sent} sent successfully, ${results.failed} failed.`,
      ...results,
    });
  } catch (error) {
    console.error("Exhibitor send mail error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
