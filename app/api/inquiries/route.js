import { NextResponse } from "next/server";
import { getInquiries, createInquiry } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendInquiryEmails } from "@/lib/mailer";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await getInquiries();
  return NextResponse.json(inquiries);
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone || !body.message) {
      return NextResponse.json(
        { error: "Name, Email, Phone and Message are required" },
        { status: 400 }
      );
    }

    const newInquiry = await createInquiry(body);

    // Trigger emails in background (Customer Confirmation & Admin Lead Alert)
    sendInquiryEmails({ inquiry: newInquiry }).catch((err) => {
      console.error("[Inquiry Email Background Error]:", err.message);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your inquiry has been submitted successfully.",
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
