import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat/chat-widget";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const title = "TimeTravel Agency — Voyagez à travers le temps";
const description =
  "Agence de voyages temporels : découvrez Paris 1889, le Crétacé et Florence 1504. Conseils personnalisés par notre agent conversationnel.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "voyage temporel",
    "agence de voyage",
    "Paris 1889",
    "Crétacé",
    "Florence 1504",
    "Belle Époque",
    "Renaissance",
    "dinosaures",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "TimeTravel Agency",
    title,
    description,
    images: [
      {
        url: "/images/logo-dore.png",
        alt: "TimeTravel Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/logo-dore.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={fraunces.variable}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
