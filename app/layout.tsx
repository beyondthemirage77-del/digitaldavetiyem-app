import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DigitalDavetiyem.com - Dijital Düğün Davetiyesi",
    template: "%s | DigitalDavetiyem.com",
  },
  description:
    "Türkiye'nin en şık dijital davetiye platformu. Müzikli, fotoğraflı, geri sayımlı düğün, nişan, doğum günü davetiyesi oluştur. WhatsApp'tan paylaş, RSVP takip et.",
  keywords: [
    "dijital davetiye",
    "online davetiye",
    "düğün davetiyesi",
    "elektronik davetiye",
    "whatsapp davetiye",
    "nişan davetiyesi",
    "doğum günü davetiyesi",
    "baby shower davetiyesi",
    "sünnet davetiyesi",
    "davetiye oluştur",
    "dijital düğün davetiyesi",
  ],
  authors: [{ name: "DigitalDavetiyem.com" }],
  creator: "DigitalDavetiyem.com",
  publisher: "DigitalDavetiyem.com",
  metadataBase: new URL("https://digitaldavetiyem.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://digitaldavetiyem.com",
    siteName: "DigitalDavetiyem.com",
    title: "DigitalDavetiyem.com - Dijital Düğün Davetiyesi",
    description:
      "Türkiye'nin en şık dijital davetiye platformu. Müzikli, fotoğraflı, geri sayımlı davetiye oluştur.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DigitalDavetiyem.com - Dijital Davetiye",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalDavetiyem.com - Dijital Düğün Davetiyesi",
    description: "Türkiye'nin en şık dijital davetiye platformu.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${dancingScript.variable}`}
    >
      <body className="font-sans antialiased bg-[#fafafa] text-[#171717]">
        <Header />
        {children}
      </body>
    </html>
  );
}
