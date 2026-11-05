import { NextResponse } from "next/server";
import { getExhibitors, createExhibitor } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendExhibitorWelcomeMail } from "@/lib/mailer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await getExhibitors({ search, page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch exhibitors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exhibitors", details: error.message },
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
    const { firstName, lastName, companyName, country, email, phone } = body || {};

    if (!firstName || !firstName.trim()) {
      return NextResponse.json({ error: "First Name is required" }, { status: 400 });
    }
    if (!lastName || !lastName.trim()) {
      return NextResponse.json({ error: "Last Name is required" }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "A valid Email Address is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone Number is required" }, { status: 400 });
    }

    const created = await createExhibitor({
      firstName,
      lastName,
      companyName: companyName || "",
      country: country || "",
      email,
      phone,
    });

    // Automatically send welcome email upon adding exhibitor
    let mailStatus = null;
    try {
      mailStatus = await sendExhibitorWelcomeMail(created);
    } catch (mailErr) {
      console.warn("[Exhibitor] Automatic welcome mail sending warning:", mailErr.message);
      mailStatus = { sent: 0, failed: 1, errors: [mailErr.message] };
    }

    return NextResponse.json({ ...created, mailStatus }, { status: 201 });
  } catch (error) {
    console.error("Create exhibitor error:", error);
    return NextResponse.json(
      { error: "Failed to create exhibitor", details: error.message },
      { status: 500 }
    );
  }
}
