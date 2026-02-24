import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/lib/blogData";
import { BLOG_CONTENT } from "@/lib/blogContent";
import { BlogContent } from "@/components/blog/BlogContent";

type Props = { params: Promise<{ slug: string }> };
const BASE = "https://digitaldavetiyem.com";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  return {
    title: article
      ? `${article.title} | DigitalDavetiyem.com`
      : "Yazı Bulunamadı",
    description: article?.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  const content = BLOG_CONTENT[slug as keyof typeof BLOG_CONTENT];

  if (!article) notFound();

  const title = content?.title ?? article.title;
  const bodyContent = content?.content ?? "";
  const faqs = content?.faqs ?? [];
  const relatedSlugs = content?.relatedSlugs ?? [];

  const relatedArticles = relatedSlugs
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: article.description,
    datePublished: article.date,
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "DigitalDavetiyem.com",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "DigitalDavetiyem.com",
      url: BASE,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}/blog/${slug}`,
    },
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div
        className="mx-auto px-4 sm:px-6 py-16"
        style={{ maxWidth: 720 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#666] hover:text-[#171717] text-sm mb-8"
        >
          ← Bloğa dön
        </Link>

        <span
          className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-4"
          style={{
            background: "rgba(201,162,39,0.15)",
            color: "#8B6914",
          }}
        >
          {article.category}
        </span>

        <h1
          className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 36px)", lineHeight: 1.3 }}
        >
          {title}
        </h1>

        <div className="flex gap-4 text-sm text-[#888] mb-10">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime} okuma</span>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#eee] mb-12">
          <BlogContent content={bodyContent} />
        </div>

        {faqs.length > 0 && (
          <section className="mb-12">
            <h2
              className="font-semibold text-[#171717] mb-6 text-xl"
            >
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6 bg-white border border-[#eee]"
                >
                  <h3 className="font-semibold text-[#171717] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-[#525252] text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="mb-12">
            <h2
              className="font-semibold text-[#171717] mb-6 text-lg"
            >
              İlgili Makaleler
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((a) => (
                <Link
                  key={a!.slug}
                  href={`/blog/${a!.slug}`}
                  className="block p-4 rounded-xl bg-white border border-[#eee] hover:border-[#ddd] hover:shadow-md transition-all"
                >
                  <span className="text-xl mb-2 block">{a!.emoji}</span>
                  <h3 className="font-medium text-[#171717] text-sm line-clamp-2">
                    {a!.title}
                  </h3>
                  <span className="text-xs text-[#888]">{a!.category}</span>
                </Link>
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
            Hemen Dijital Davetiye Oluştur →
          </Link>
        </div>
      </div>
    </div>
  );
}
