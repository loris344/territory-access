import type { Metadata } from "next";
import AdminLogin from "@/views/AdminLogin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  noIndex: true,
  path: "/admin/login",
});

export default function AdminLoginPage() {
  return <AdminLogin />;
}
