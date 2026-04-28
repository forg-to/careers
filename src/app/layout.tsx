import type { Metadata } from "next";
import "./globals.css";
import { RopeThemeToggle } from "@/components/RopeThemeToggle";

export const metadata: Metadata = {
  metadataBase: new URL("https://careers.forg.to"),
  title: {
    default: "Forg Careers — Build the future of building in public",
    template: "%s | Forg Careers",
  },
  description: "Join the Forg team and help builders grow their online presence. We're looking for passionate people to help us build the biggest community for developers.",
  keywords: ["forg careers", "forg jobs", "build in public jobs", "indie hacker jobs", "remote developer roles"],
  authors: [{ name: "Forg", url: "https://forg.to" }],
  creator: "Forg",
  publisher: "Forg",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careers.forg.to",
    siteName: "Forg Careers",
    title: "Forg Careers — Build the future of building in public",
    description: "Join the Forg team and help builders grow their online presence.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Forg Careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@forg_to",
    creator: "@whykislay",
    title: "Forg Careers — Build the future of building in public",
    description: "Join the Forg team and help builders grow their online presence.",
    images: ["/og.png"],
  },
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
