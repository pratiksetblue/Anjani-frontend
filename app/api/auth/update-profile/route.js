import { NextResponse } from "next/server";
import { getAdminSession, hashPassword, comparePassword } from "@/lib/auth";
import { getUsers, updateUserProfile } from "@/lib/db";

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, currentPassword, newPassword } = await request.json();

    const users = await getUsers();
    const currentUser = users.find((u) => u.id === session.id || u._id === session.id);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      const isMatch = await comparePassword(currentPassword, currentUser.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updates.password = await hashPassword(newPassword);
    }

    const updated = await updateUserProfile(session.id, updates);

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
