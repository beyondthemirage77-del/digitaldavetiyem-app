"use client";

import { useState } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/blogData";

const CATEGORIES = ["Tümü", "Rehber", "İlham", "Karşılaştırma"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const filtered =
    activeCategory === "Tümü"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1
          className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] mb-3"
          style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
        >
          Blog
        </h1>
        <p className="text-[#666] text-lg mb-10">
          Dijital davetiye ipuçları, düğün planlaması rehberleri ve ilham veren içerikler.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={
                activeCategory === cat
                  ? { background: "#111", color: "white" }
                  : { background: "white", border: "1px solid #ddd", color: "#666" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="block bg-white rounded-2xl overflow-hidden border border-[#eee] hover:shadow-lg hover:border-[#ddd] transition-all group"
            >
              <div className="p-6">
                <span className="text-3xl mb-3 block">{a.emoji}</span>
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-3"
                  style={{
                    background: "rgba(201,162,39,0.15)",
                    color: "#8B6914",
                  }}
                >
                  {a.category}
                </span>
                <h2 className="font-semibold text-[#171717] text-lg mb-2 group-hover:underline">
                  {a.title}
                </h2>
                <p className="text-[#666] text-sm mb-4 line-clamp-2">{a.description}</p>
                <div className="flex justify-between text-xs text-[#888]">
                  <span>{a.readTime}</span>
                  <span>{a.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
            Davetiyenizi Oluşturun →
          </Link>
        </div>
      </div>
    </div>
  );
}
