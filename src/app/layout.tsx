import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forg Careers — Build the future of building in public",
  description: "Join the Forg team and help builders grow their online presence.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-terracotta selection:text-ivory">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
