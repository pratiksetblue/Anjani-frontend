import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/mailer";
import { getAdminSession } from "@/lib/auth";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { to, smtpConfig } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email address ('to') is required" },
        { status: 400 }
      );
    }

    const info = await sendTestEmail({ to, smtpConfig });
    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${to}`,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Test email sending error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send test email. Please check your SMTP settings.",
      },
      { status: 500 }
    );
  }
}
