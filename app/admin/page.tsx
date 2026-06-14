import type { Metadata } from "next";
import Admin from "@/views/Admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Admin />;
}
