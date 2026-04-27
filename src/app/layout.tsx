import type { Metadata } from "next";
import "./globals.css";
import { RopeThemeToggle } from "@/components/RopeThemeToggle";

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('forg-theme');if(t==='light')document.documentElement.classList.add('forg-light');}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <RopeThemeToggle />
        {children}
      </body>
    </html>
  );
}
