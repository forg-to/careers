import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || ""; // Note: This might not work in all environments, but good enough for local/standard Vercel

  // If no session and not on login page, we can't easily redirect from here without knowing the path
  // so we'll do the check in the page components themselves for now, 
  // but let's keep the layout simple.

  return <div className="min-h-screen bg-parchment">{children}</div>;
}
