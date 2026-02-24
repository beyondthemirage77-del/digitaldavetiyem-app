export const ARTICLES = [
  {
    slug: "dijital-davetiye-nasil-yapilir",
    title: "Dijital Davetiye Nasıl Yapılır? Adım Adım Rehber",
    description:
      "Online dijital davetiye oluşturmanın en kolay yolu. Şablon seçiminden WhatsApp paylaşımına kadar her şey.",
    category: "Rehber",
    readTime: "5 dk",
    date: "2026-01-15",
    emoji: "📋",
  },
  {
    slug: "dugun-davetiyesi-ornekleri",
    title: "2026 Düğün Davetiyesi Örnekleri ve Trendleri",
    description:
      "Bu yılın en popüler düğün davetiyesi tasarımları, renk paletleri ve metin önerileri.",
    category: "İlham",
    readTime: "4 dk",
    date: "2026-01-20",
    emoji: "💒",
  },
  {
    slug: "kagit-davetiye-mi-dijital-davetiye-mi",
    title: "Kağıt Davetiye mi, Dijital Davetiye mi?",
    description:
      "Maliyet, çevre dostu yaklaşım ve pratiklik açısından ikisini karşılaştırdık.",
    category: "Karşılaştırma",
    readTime: "3 dk",
    date: "2026-01-25",
    emoji: "⚖️",
  },
  {
    slug: "whatsapp-davetiye-paylasimi",
    title: "WhatsApp'ta Davetiye Nasıl Paylaşılır?",
    description:
      "Misafirlerinize dijital davetiyenizi WhatsApp üzerinden göndermenin en etkili yolları.",
    category: "Rehber",
    readTime: "3 dk",
    date: "2026-02-01",
    emoji: "💬",
  },
  {
    slug: "dugun-rsvp-takibi",
    title: "Düğün RSVP Takibi Nasıl Yapılır?",
    description:
      "Misafir listesini dijital olarak yönetmenin faydaları ve RSVP sistemini etkili kullanma rehberi.",
    category: "Rehber",
    readTime: "4 dk",
    date: "2026-02-05",
    emoji: "✅",
  },
  {
    slug: "nisan-davetiyesi-nasil-olmali",
    title: "Nişan Davetiyesi Nasıl Olmalı? Metin ve Tasarım Önerileri",
    description:
      "Nişan davetiyesinde kullanılacak metinler, tasarım ipuçları ve dikkat edilmesi gerekenler.",
    category: "İlham",
    readTime: "5 dk",
    date: "2026-02-10",
    emoji: "💍",
  },
  {
    slug: "en-iyi-dijital-davetiye-siteleri",
    title: "Türkiye'nin En İyi Dijital Davetiye Siteleri 2026",
    description:
      "Türkiye'de dijital davetiye platformları karşılaştırması. Hangi dijital davetiye sitesi en iyi?",
    category: "Rehber",
    readTime: "4 dk",
    date: "2026-02-15",
    emoji: "🏆",
  },
] as const;

export type ArticleSlug = (typeof ARTICLES)[number]["slug"];
