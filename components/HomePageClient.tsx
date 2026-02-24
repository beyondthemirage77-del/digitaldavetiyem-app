"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { TEMPLATES, CATEGORY_TABS } from "@/lib/templateData";
import { TemplateCardContent } from "@/components/TemplateCardContent";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";

export default function HomePageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");

  const scrollToDemo = useCallback(() => {
    document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const faqs = [
    {
      q: "Davetiye ne kadar süre aktif kalır?",
      a: "1 yıl boyunca aktif kalır.",
    },
    {
      q: "Kaç misafir görebilir?",
      a: "Sınırsız misafir erişimi.",
    },
    {
      q: "Ödeme nasıl yapılır?",
      a: "Kredi kartı, havale veya EFT.",
    },
    {
      q: "Davetiye oluşturduktan sonra değiştirebilir miyim?",
      a: "Evet, yayınlamadan önce istediğiniz kadar düzenleyebilirsiniz.",
    },
    {
      q: "Hangi platformlarda paylaşılabilir?",
      a: "WhatsApp, Instagram, SMS, e-posta.",
    },
  ];

  const pricingFeatures = [
    "Sınırsız misafir erişimi",
    "1 yıl aktif kalma garantisi",
    "RSVP formu ve misafir takibi",
    "WhatsApp & sosyal medya paylaşımı",
    "Arka plan müziği veya sesli mesaj",
    "Geri sayım sayacı",
    "Google Haritalar entegrasyonu",
    "Takvime ekle butonu",
    "Özel davetiye linki",
    "Görüntülenme istatistikleri",
    "Fotoğraf slaytı desteği",
  ];

  return (
    <div className="min-h-screen">
      {/* Section 1 - Hero */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center pt-28 pb-20 px-4 sm:px-6"
        style={{ background: "#FAF9F7", minHeight: "66.67vh" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            style={{
              border: "1px solid #C9A227",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "13px",
              display: "inline-block",
              marginBottom: "24px",
              color: "#525252",
            }}
          >
            ✨ Türkiye&apos;nin En Şık Dijital Davetiyesi
          </div>
          <h1
            className="font-[family-name:var(--font-cormorant)] font-bold leading-[1.1] text-[#171717] mb-6"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              whiteSpace: "pre-line",
            }}
          >
            Düğün Davetiyenizi{"\n"}Dijitale Taşıyın
          </h1>
          <p
            className="text-[#666] max-w-2xl mx-auto mb-8 text-xl"
            style={{ lineHeight: 1.6 }}
          >
            Kağıt davetiye yerine müzikli, fotoğraflı, geri sayımlı dijital
            davetiye. Misafirleriniz WhatsApp&apos;tan açar, RSVP bildirir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/create"
              className="inline-flex justify-center items-center text-white font-semibold rounded-[14px] hover:bg-[#333] transition-colors"
              style={{
                padding: "16px 32px",
                fontSize: "16px",
                background: "#111",
              }}
            >
              Ücretsiz Dene →
            </Link>
            <button
              type="button"
              onClick={scrollToDemo}
              className="inline-flex justify-center items-center font-semibold rounded-[14px] border-2 border-[#171717] text-[#171717] hover:bg-[#f5f5f5] transition-colors"
              style={{ padding: "16px 32px", fontSize: "16px" }}
            >
              Örnek Davetiye Gör
            </button>
          </div>
          <p className="text-base text-[#888]">
            ⭐️⭐️⭐️⭐️⭐️ 500+ çift tarafından kullanıldı
          </p>
        </div>
      </section>

      {/* Section 2 - Social Proof */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            <div>
              <p
                className="font-bold text-[#171717] mb-1"
                style={{ fontSize: "48px" }}
              >
                500+
              </p>
              <p className="text-sm text-[#888]">Mutlu Çift</p>
            </div>
            <div>
              <p
                className="font-bold text-[#171717] mb-1"
                style={{ fontSize: "48px" }}
              >
                98%
              </p>
              <p className="text-sm text-[#888]">WhatsApp ile paylaşım</p>
            </div>
            <div>
              <p
                className="font-bold text-[#171717] mb-1"
                style={{ fontSize: "48px" }}
              >
                4.9★
              </p>
              <p className="text-sm text-[#888]">Ortalama puan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - How it works (animated steps) */}
      <HowItWorksSteps />

      {/* Section 4 - Features */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] text-center mb-16"
            style={{ fontSize: "clamp(28px, 4vw, 36px)" }}
          >
            Her Şey Dahil
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "🎵",
                title: "Arka Plan Müziği",
                desc: "Sevdiğiniz müzikle davetiye",
              },
              {
                icon: "📸",
                title: "Fotoğraf Galerisi",
                desc: "Çift fotoğrafları slayt gösterisi",
              },
              {
                icon: "⏱",
                title: "Geri Sayım",
                desc: "Düğüne kalan günü gösterir",
              },
              {
                icon: "✅",
                title: "RSVP Takibi",
                desc: "Kim geliyor, kim gelmiyor",
              },
              {
                icon: "🗺",
                title: "Konum",
                desc: "Google Haritalar entegrasyonu",
              },
              {
                icon: "🎙",
                title: "Sesli Mesaj",
                desc: "Kendi sesinizle davet edin",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6"
                style={{ border: "1px solid #eee" }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3
                  className="font-semibold text-[#171717] mb-1 text-lg"
                >
                  {f.title}
                </h3>
                <p className="text-base text-[#888]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Templates */}
      <section
        id="templates"
        className="py-24 px-4 sm:px-6"
        style={{ background: "#FAF9F7" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] text-center mb-3"
            style={{ fontSize: "clamp(28px, 4vw, 36px)" }}
          >
            Her Organizasyon İçin Şablon
          </h2>
          <p className="text-center text-[#666] mb-12 max-w-2xl mx-auto" style={{ fontSize: "16px", lineHeight: 1.5 }}>
            Düğünden doğum gününe, toplantıdan baby shower&apos;a - her etkinlik için özel tasarımlar
          </p>

          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORY_TABS.map((cat) => (
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

          {/* Template cards grid */}
          <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {TEMPLATES.filter(
              (t) => activeCategory === "Tümü" || t.filterCategory === activeCategory
            ).map((t) => (
              <div key={t.id} className="flex flex-col gap-3">
                <div
                  className="relative overflow-hidden rounded-3xl cursor-pointer w-full aspect-[9/16]"
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) (img as HTMLImageElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) (img as HTMLImageElement).style.transform = "scale(1)";
                  }}
                >
                  <TemplateCardContent template={t} />
                </div>
                <p className="font-medium text-[#171717] text-sm text-center">{t.name}</p>
                <Link
                  href="/create"
                  className="block w-full bg-stone-900 text-white rounded-xl py-2.5 text-sm text-center font-medium hover:bg-stone-800 transition-colors"
                >
                  Tasarımı İncele
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-[#888] text-sm mb-6">
            Tüm şablonlar yakında eklenecek. Şu an 3 düğün şablonu mevcut.
          </p>
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
              Davetiyemi Oluştur →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6 - Pricing */}
      <section
        id="fiyatlar"
        className="py-24 px-4 sm:px-6"
        style={{ background: "#FAF9F7" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] text-center mb-16"
            style={{ fontSize: "clamp(28px, 4vw, 36px)" }}
          >
            Şeffaf Fiyatlandırma
          </h2>
          <div
            className="mx-auto max-w-md bg-white rounded-2xl p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]"
            style={{ border: "1px solid #eee" }}
          >
            <div
              className="inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: "rgba(201,162,39,0.15)",
                color: "#8B6914",
                border: "1px solid rgba(201,162,39,0.4)",
              }}
            >
              Tek Seferlik Ödeme
            </div>
            <p
              className="font-bold text-[#171717] mb-1"
              style={{ fontSize: "42px" }}
            >
              499 ₺
            </p>
            <p className="text-sm text-[#888] mb-6">KDV dahil</p>
            <ul className="space-y-2 mb-8 text-base text-[#525252]">
              {pricingFeatures.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Link
              href="/create"
              className="block w-full py-4 rounded-xl text-center text-white font-semibold hover:bg-[#333] transition-colors mb-4"
              style={{
                background: "#111",
                fontSize: "16px",
              }}
            >
              Hemen Başla →
            </Link>
            <p className="text-center text-sm text-[#888]">
              Kredi kartı, havale veya EFT ile ödeme
            </p>
          </div>
        </div>
      </section>

      {/* Section 7 - Testimonials */}
      <section style={{ padding: "80px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p
              style={{
                fontSize: 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#888",
                marginBottom: 12,
              }}
            >
              KULLANICI YORUMLARI
            </p>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#111",
                marginBottom: 16,
              }}
            >
              Binlerce mutlu kullanıcı
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#666",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              Her türlü organizasyon için dijital davetiye oluşturanların yorumları
            </p>
            {/* Overall rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {"★★★★★".split("").map((s, i) => (
                  <span
                    key={i}
                    style={{ color: "#f59e0b", fontSize: 20 }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>4.9</span>
              <span style={{ fontSize: 14, color: "#888" }}>/ 5 • 500+ değerlendirme</span>
            </div>
          </div>

          {/* Masonry-style grid */}
          <div
            style={{
              columns: "3 300px",
              columnGap: 24,
            }}
          >
            {[
              {
                name: "Ayşe & Mehmet K.",
                event: "Düğün Davetiyesi",
                emoji: "💒",
                text: "Davetiyemizi dakikalar içinde oluşturduk. WhatsApp'tan paylaştık, misafirlerimizin %90'ı aynı gün RSVP gönderdi. Kağıt davetiyeye kıyasla hem çok daha uygun hem de çok daha şık oldu!",
                location: "İstanbul",
              },
              {
                name: "Merve & Emre T.",
                event: "Nişan Davetiyesi",
                emoji: "💍",
                text: "Nişan davetiyemizi özelleştirirken çok eğlendik. Arka plan müziği ve geri sayım sayacı misafirlerimizi çok etkiledi. Herkes nasıl yaptığımızı sordu!",
                location: "Ankara",
              },
              {
                name: "Fatma Y.",
                event: "Baby Shower",
                emoji: "🍼",
                text: "Baby shower organizasyonum için mükemmeldi. Şirin şablonlar, kolay kullanım. Tüm arkadaşlarıma önerdim zaten 3 kişi de kullandı.",
                location: "İzmir",
              },
              {
                name: "Zeynep A.",
                event: "Doğum Günü Partisi",
                emoji: "🎂",
                text: "Kızımın 5. yaş günü için kullandım. Fotoğraf ve müzik ekleme özelliği harikaydı. Davetiye o kadar güzel oldu ki ekran görüntüsünü alan bile oldu!",
                location: "Bursa",
              },
              {
                name: "Ali & Selin M.",
                event: "Kına Gecesi",
                emoji: "🌹",
                text: "Kına gecesi davetiyesi için birebir. Romantik şablonlar ve özelleştirme seçenekleri çok geniş. Misafirlerimiz davetiyeyi görünce etkinliğe olan heyecanları daha da arttı.",
                location: "Konya",
              },
              {
                name: "Hasan K.",
                event: "Sünnet Töreni",
                emoji: "🕌",
                text: "Oğlumun sünnet töreni için kullandık. Hem aile büyüklerimize hem gençlere kolayca iletebildik. RSVP özelliği sayesinde kaç kişinin geleceğini önceden bildik, organizasyon çok kolay oldu.",
                location: "Gaziantep",
              },
              {
                name: "Ahmet Yılmaz",
                event: "Mevlüt",
                emoji: "☪️",
                text: "Mevlüt davetiyesi için kullandım. Sade ve şık şablonlar mevcut. Mahalle sakinlerine WhatsApp gruptan gönderdim, çok beğendiler. Kesinlikle tavsiye ederim.",
                location: "Trabzon",
              },
              {
                name: "Elif Demir",
                event: "Açılış Daveti",
                emoji: "🎊",
                text: "Butik mağazamın açılışı için kullandım. Kurumsal şablonlar çok profesyoneldi. Müşterilerimiz davetiyeyi görünce açılışa katılım çok yüksek oldu. İş dünyası için de mükemmel!",
                location: "İstanbul",
              },
              {
                name: "Mustafa Şahin",
                event: "Kurumsal Toplantı",
                emoji: "🏢",
                text: "Şirketimizin yıllık toplantısı için kullandık. Çalışanlara gönderdiğimizde çok profesyonel bir izlenim bıraktı. Artık tüm kurumsal etkinliklerimizde kullanıyoruz.",
                location: "Ankara",
              },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  breakInside: "avoid",
                  marginBottom: 24,
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  border: "1px solid #eee",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {"★★★★★".split("").map((s, j) => (
                    <span
                      key={j}
                      style={{ color: "#f59e0b", fontSize: 14 }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {/* Text */}
                <p
                  style={{
                    fontSize: 14,
                    color: "#444",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  &quot;{t.text}&quot;
                </p>
                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {t.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {t.event} • {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 - FAQ */}
      <section
        id="sss"
        className="py-24 px-4 sm:px-6"
        style={{ background: "#FAF9F7" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-[family-name:var(--font-cormorant)] font-bold text-[#171717] text-center mb-16"
            style={{ fontSize: "clamp(28px, 4vw, 36px)" }}
          >
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  border: "1px solid #eee",
                  background: "white",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center font-medium text-[#171717] text-base hover:bg-[#fafafa]"
                >
                  {faq.q}
                  <span
                    className="text-[#888] text-xl"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s",
                    }}
                  >
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    className="px-6 pb-4 text-[#666] text-base leading-relaxed"
                    style={{ marginTop: "-8px" }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9 - Final CTA */}
      <section className="py-24 px-4 sm:px-6 text-white" style={{ background: "#111" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-[family-name:var(--font-cormorant)] font-bold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
          >
            Davetiyenizi Bugün Oluşturun
          </h2>
          <p className="text-[#999] mb-8" style={{ fontSize: "16px" }}>
            500+ çiftin tercih ettiği dijital davetiye platformu
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center text-[#111] font-semibold rounded-[14px] bg-white hover:bg-[#f0f0f0] transition-colors"
            style={{ padding: "16px 32px", fontSize: "16px" }}
          >
            Ücretsiz Başla →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-20 px-4 sm:px-6"
        style={{ background: "#111", color: "#888" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">💌</span>
            <span className="font-semibold text-white">DigitalDavetiyem.com</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/sablonlar" className="hover:text-white transition-colors">
              Şablonlar
            </Link>
            <Link href="/reels-demo" className="hover:text-white transition-colors">
              📱 Reels (Düğün)
            </Link>
            <Link href="/reels-demo/acilis" className="hover:text-white transition-colors">
              📱 Reels (Açılış)
            </Link>
            <Link href="/kvkk" className="hover:text-white transition-colors">
              KVKK
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/iletisim" className="hover:text-white transition-colors">
              İletişim
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-[#666] mt-8">
          © 2026 DigitalDavetiyem.com. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
}
