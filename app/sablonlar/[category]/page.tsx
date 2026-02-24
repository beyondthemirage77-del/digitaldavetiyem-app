import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_SLUGS,
  getTemplatesForCategory,
  getCategoryDescription,
  getCategoryFaq,
  type CategorySlug,
} from "@/lib/sablonlarData";
import { TemplateCardContent } from "@/components/TemplateCardContent";

type Props = { params: Promise<{ category: string }> };

const VALID_SLUGS = Object.keys(CATEGORY_SLUGS) as CategorySlug[];

export function generateStaticParams() {
  return VALID_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const slug = category as CategorySlug;
  if (!VALID_SLUGS.includes(slug)) {
    return { title: "Şablonlar | DigitalDavetiyem.com" };
  }
  const config = CATEGORY_SLUGS[slug];
  return {
    title: `${config.name} Şablonları | DigitalDavetiyem.com`,
    description: `En güzel ${config.name.toLowerCase()} şablonları. Hemen oluştur, WhatsApp'tan paylaş. 499₺ tek seferlik ödeme.`,
  };
}

export default async function SablonlarCategoryPage({ params }: Props) {
  const { category } = await params;
  const slug = category as CategorySlug;

  if (!VALID_SLUGS.includes(slug)) notFound();

  const config = CATEGORY_SLUGS[slug];
  const templates = getTemplatesForCategory(slug);
  const description = getCategoryDescription(slug);
  const faqs = getCategoryFaq(slug);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/sablonlar"
          className="inline-flex items-center gap-2 text-[#666] hover:text-[#171717] text-sm mb-8"
        >
          ← Tüm Şablonlar
        </Link>

        <h1
          className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] mb-4"
          style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
        >
          {config.name}
        </h1>

        <p className="text-[#525252] text-base leading-relaxed mb-12 max-w-3xl">
          {description}
        </p>

        <section className="mb-16">
          <h2
            className="font-semibold text-[#171717] mb-6 text-xl"
          >
            {config.name} Şablonları
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

        {faqs.length > 0 && (
          <section className="mb-16">
            <h2
              className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] mb-8"
              style={{ fontSize: "clamp(24px, 3vw, 30px)" }}
            >
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4 max-w-2xl">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6 bg-white border border-[#eee]"
                >
                  <h3 className="font-semibold text-[#171717] mb-2">{faq.q}</h3>
                  <p className="text-[#525252] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href="/create"
            className="inline-flex items-center justify-center text-white font-semibold rounded-[14px] hover:bg-[#333] transition-colors"
            style={{
              padding: "16px 32px",
              fontSize: "16px",
              background: "#111",
            }}
          >
            Hemen Davetiye Oluştur →
          </Link>
        </div>
      </div>
    </div>
  );
}
