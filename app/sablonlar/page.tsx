import type { Metadata } from "next";
import Link from "next/link";
import { TemplateCardContent } from "@/components/TemplateCardContent";
import {
  getTemplatesForCategory,
  type CategorySlug,
} from "@/lib/sablonlarData";

export const metadata: Metadata = {
  title: "Dijital Davetiye Şablonları - Düğün, Nişan, Doğum Günü | DigitalDavetiyem.com",
  description:
    "Düğün, nişan, baby shower, sünnet, doğum günü için hazır dijital davetiye şablonları. Ücretsiz dene, 499₺ yayınla.",
};

const SECTIONS: { slug: CategorySlug; title: string }[] = [
  { slug: "dugun-davetiyesi", title: "Düğün Davetiyesi Şablonları" },
  { slug: "nisan-davetiyesi", title: "Nişan Davetiyesi Şablonları" },
  { slug: "baby-shower-davetiyesi", title: "Baby Shower Davetiyesi Şablonları" },
  { slug: "sunnet-davetiyesi", title: "Sünnet Töreni Davetiyesi Şablonları" },
  { slug: "dogum-gunu-davetiyesi", title: "Doğum Günü Davetiyesi Şablonları" },
  { slug: "kina-gecesi-davetiyesi", title: "Kına Gecesi Davetiyesi Şablonları" },
  { slug: "mevlut-davetiyesi", title: "Mevlüt Davetiyesi Şablonları" },
  { slug: "acilis-daveti", title: "Açılış Daveti Şablonları" },
  { slug: "kurumsal-toplanti", title: "Kurumsal Toplantı Davetiyesi Şablonları" },
];

export default function SablonlarPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h1
          className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] mb-4"
          style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
        >
          Dijital Davetiye Şablonları
        </h1>
        <p className="text-[#666] text-lg mb-12 max-w-2xl">
          Her etkinlik türü için özel tasarlanmış dijital davetiye şablonları. Ücretsiz dene, beğenirsen 499₺ ile yayınla.
        </p>

        {SECTIONS.map(({ slug, title }) => {
          const templates = getTemplatesForCategory(slug).slice(0, 3);
          if (templates.length === 0) return null;

          return (
            <section key={slug} className="mb-16">
              <h2
                className="font-[family-name:var(--font-cormorant)] font-semibold text-[#171717] mb-6"
                style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
              >
                {title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((t) => (
                  <div key={t.id} className="flex flex-col">
                    <div
                      className="relative overflow-hidden rounded-3xl w-full aspect-[9/16] mb-4"
                      style={{ background: "#eee" }}
                    >
                      <TemplateCardContent template={t} compact />
                    </div>
                    <p className="font-medium text-[#171717] text-sm mb-3">{t.name}</p>
                    <Link
                      href="/create"
                      className="inline-flex justify-center w-full py-2.5 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors"
                    >
                      Şablonu Kullan →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div className="text-center mt-16">
          <Link
            href="/create"
            className="inline-flex items-center justify-center text-white font-semibold rounded-[14px] hover:bg-[#333] transition-colors"
            style={{
              padding: "16px 32px",
              fontSize: "16px",
              background: "#111",
            }}
          >
            Davetiyemi Oluştur →
          </Link>
        </div>
      </div>
    </div>
  );
}
