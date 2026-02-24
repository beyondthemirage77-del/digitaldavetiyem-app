import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "Dijital Düğün Davetiyesi Oluştur - DigitalDavetiyem.com",
  description:
    "Online dijital düğün davetiyesi oluştur. Müzikli, fotoğraflı, geri sayımlı davetiye. WhatsApp'tan paylaş, RSVP takip et. 499₺ tek seferlik ödeme. Hemen dene!",
  alternates: { canonical: "https://digitaldavetiyem.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DigitalDavetiyem.com",
  url: "https://digitaldavetiyem.com",
  description: "Dijital düğün davetiyesi oluşturma platformu",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "499",
    priceCurrency: "TRY",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
