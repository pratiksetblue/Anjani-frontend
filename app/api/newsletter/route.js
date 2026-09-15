import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/db";
import { sendNewsletterEmails } from "@/lib/mailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Please enter your email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save as Inquiry in MongoDB with type "Newsletter"
    const inquiry = await createInquiry({
      name: "Newsletter Subscriber",
      email: cleanEmail,
      phone: "",
      subject: "Newsletter Subscription",
      message: "Customer subscribed to the newsletter from website footer.",
      type: "Newsletter",
      status: "New",
    });

    // Trigger confirmation email and admin notification in background
    sendNewsletterEmails({ subscriberEmail: cleanEmail, inquiry }).catch((err) => {
      console.error("[Newsletter Email Trigger Error]:", err.message);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing to our newsletter!",
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}
