import "./admin.css";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";

export const metadata = {
  title: "Anjani Industries Admin Panel",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();

  return (
    <div className="admin-body">
      <AdminClientLayout session={session}>{children}</AdminClientLayout>
    </div>
  );
}
