import { TEMPLATES } from "@/lib/templateData";

export const CATEGORY_SLUGS = {
  "dugun-davetiyesi": { name: "Düğün Davetiyesi", filter: "Düğün" },
  "nisan-davetiyesi": { name: "Nişan Davetiyesi", filter: "Nişan" },
  "baby-shower-davetiyesi": { name: "Baby Shower Davetiyesi", filter: "Baby Shower" },
  "sunnet-davetiyesi": { name: "Sünnet Töreni Davetiyesi", filter: "Sünnet" },
  "dogum-gunu-davetiyesi": { name: "Doğum Günü Davetiyesi", filter: "Parti" }, // Parti + name contains Doğum
  "kina-gecesi-davetiyesi": { name: "Kına Gecesi Davetiyesi", filter: "Kına" },
  "mevlut-davetiyesi": { name: "Mevlüt Davetiyesi", filter: "Mevlüt" },
  "acilis-daveti": { name: "Açılış Daveti", filter: "Açılış" },
  "kurumsal-toplanti": { name: "Kurumsal Toplantı Davetiyesi", filter: "Toplantı" },
} as const;

export type CategorySlug = keyof typeof CATEGORY_SLUGS;

export function getTemplatesForCategory(slug: CategorySlug) {
  const config = CATEGORY_SLUGS[slug];
  if (!config) return [];

  if (slug === "dogum-gunu-davetiyesi") {
    return TEMPLATES.filter((t) => t.name.includes("Doğum Günü"));
  }

  return TEMPLATES.filter(
    (t) => t.filterCategory === config.filter || t.category === config.filter
  );
}

export function getCategoryDescription(slug: CategorySlug): string {
  const descriptions: Record<CategorySlug, string> = {
    "dugun-davetiyesi":
      "Düğün davetiyesi şablonları ile nikah ve düğün töreninize misafirlerinizi davet edin. Klasik, modern ve bohem tarzda düğün davetiyesi tasarımları. Müzikli, fotoğraflı ve geri sayımlı dijital düğün davetiyesi oluşturun. WhatsApp ile anında paylaşın, RSVP ile misafir takibini yapın.",
    "nisan-davetiyesi":
      "Nişan davetiyesi şablonları ile nişan töreninize özel davetiyeler oluşturun. Romantik ve şık nişan davetiyesi tasarımları. Dijital nişan davetiyesi ile maliyetten tasarruf edin, anında paylaşın.",
    "baby-shower-davetiyesi":
      "Baby shower davetiyesi şablonları ile bebeğinizin gelişini kutlayın. Sevimli ve modern baby shower davetiye tasarımları. Dijital baby shower davetiyesi oluşturup WhatsApp ile paylaşın.",
    "sunnet-davetiyesi":
      "Sünnet davetiyesi şablonları ile sünnet töreninize misafir davet edin. Geleneksel ve modern sünnet davetiyesi tasarımları. Dijital sünnet davetiyesi ile kolay paylaşım.",
    "dogum-gunu-davetiyesi":
      "Doğum günü davetiyesi şablonları ile partinize özel davetler oluşturun. Yetişkin ve çocuk doğum günü davetiyesi tasarımları. Dijital doğum günü davetiyesi ile hızlı ve ekonomik davet.",
    "kina-gecesi-davetiyesi":
      "Kına davetiyesi şablonları ile kına gecesinize misafir çağırın. Geleneksel ve modern kına davetiyesi tasarımları. Dijital kına davetiyesi oluşturup WhatsApp ile paylaşın.",
    "mevlut-davetiyesi":
      "Mevlüt davetiyesi şablonları ile mevlüt programınıza davet oluşturun. Özel mevlüt davetiyesi tasarımları. Dijital mevlüt davetiyesi ile anında paylaşım.",
    "acilis-daveti":
      "Açılış daveti şablonları ile işletmenizin, mağazanızın veya ofisinizin açılışına davet oluşturun. Kurumsal açılış davetiyesi tasarımları. Dijital açılış davetiyesi ile profesyonel görünüm.",
    "kurumsal-toplanti":
      "Toplantı davetiyesi şablonları ile kurumsal etkinliklerinize davet oluşturun. Profesyonel toplantı ve seminer davetiyesi tasarımları. Dijital toplantı davetiyesi ile hızlı dağıtım.",
  };
  return descriptions[slug] ?? "";
}

export function getCategoryFaq(slug: CategorySlug): { q: string; a: string }[] {
  const faqs: Record<CategorySlug, { q: string; a: string }[]> = {
    "dugun-davetiyesi": [
      { q: "Düğün davetiyesi ne zaman gönderilmeli?", a: "Nikah tarihinden 2-3 ay önce gönderilmesi önerilir." },
      { q: "Kaç tane düğün davetiyesi şablonu var?", a: "6 farklı düğün davetiyesi şablonu mevcuttur." },
      { q: "Düğün davetiyesine müzik eklenebilir mi?", a: "Evet, arka plan müziği veya sesli mesaj ekleyebilirsiniz." },
      { q: "Misafir listesi takip edilebilir mi?", a: "Evet, RSVP formu ile katılım durumunu takip edebilirsiniz." },
      { q: "Düğün davetiyesi ne kadar süre aktif kalır?", a: "1 yıl boyunca aktif kalır." },
    ],
    "nisan-davetiyesi": [
      { q: "Nişan davetiyesi ne zaman gönderilir?", a: "Nişan tarihinden 3-4 hafta önce gönderilmesi uygundur." },
      { q: "Nişan davetiyesine fotoğraf eklenebilir mi?", a: "Evet, çift fotoğraflarınızı ekleyebilirsiniz." },
      { q: "Nişan davetiyesi kaça mal olur?", a: "499₺ tek seferlik ödeme ile sınırsız paylaşım." },
      { q: "Nişan davetiyesi WhatsApp'tan paylaşılabilir mi?", a: "Evet, linki WhatsApp ile paylaşabilirsiniz." },
      { q: "Nişan davetiyesi değiştirilebilir mi?", a: "Yayınlamadan önce istediğiniz kadar düzenleyebilirsiniz." },
    ],
    "baby-shower-davetiyesi": [
      { q: "Baby shower davetiyesi ne zaman gönderilir?", a: "Etkinlik tarihinden 2-3 hafta önce gönderilir." },
      { q: "Baby shower davetiyesine bebek fotoğrafı eklenebilir mi?", a: "Evet, ultrasound veya bebek fotoğrafı ekleyebilirsiniz." },
      { q: "Cinsiyet partisi davetiyesi de var mı?", a: "Evet, cinsiyet partisi şablonları da mevcuttur." },
      { q: "Baby shower davetiyesi maliyeti nedir?", a: "499₺ tek seferlik ödeme." },
      { q: "Kaç misafir davet edebilirim?", a: "Sınırsız misafir erişimi vardır." },
    ],
    "sunnet-davetiyesi": [
      { q: "Sünnet davetiyesi ne zaman gönderilir?", a: "Tören tarihinden 2-4 hafta önce gönderilmesi uygundur." },
      { q: "Sünnet davetiyesine çocuk fotoğrafı eklenebilir mi?", a: "Evet, çocuğunuzun fotoğrafını ekleyebilirsiniz." },
      { q: "Sünnet davetiyesi kaç şablon var?", a: "2 farklı sünnet davetiyesi şablonu mevcuttur." },
      { q: "Sünnet davetiyesi RSVP içerir mi?", a: "Evet, katılım bildirimi formu eklenebilir." },
      { q: "Sünnet davetiyesi ne kadar aktif kalır?", a: "1 yıl boyunca aktif kalır." },
    ],
    "dogum-gunu-davetiyesi": [
      { q: "Doğum günü davetiyesi ne zaman gönderilir?", a: "Parti tarihinden 1-2 hafta önce gönderilir." },
      { q: "Yetişkin doğum günü davetiyesi var mı?", a: "Evet, 30. yaş gibi yetişkin partiler için şablonlar mevcut." },
      { q: "Doğum günü davetiyesi özelleştirilebilir mi?", a: "Evet, yaş, tema ve metin özelleştirilebilir." },
      { q: "Doğum günü davetiyesi maliyeti?", a: "499₺ tek seferlik ödeme." },
      { q: "Çocuk doğum günü için uygun mu?", a: "Evet, çocuk partileri için de kullanılabilir." },
    ],
    "kina-gecesi-davetiyesi": [
      { q: "Kına davetiyesi ne zaman gönderilir?", a: "Kına gecesinden 2-3 hafta önce gönderilir." },
      { q: "Kına davetiyesi şablonu kaç tane?", a: "2 farklı kına davetiyesi şablonu mevcuttur." },
      { q: "Kına davetiyesine müzik eklenir mi?", a: "Evet, arka plan müziği ekleyebilirsiniz." },
      { q: "Kına davetiyesi WhatsApp paylaşımı nasıl?", a: "Linki kopyalayıp WhatsApp'ta paylaşmanız yeterli." },
      { q: "Kına davetiyesi kaça mal olur?", a: "499₺ tek seferlik ödeme." },
    ],
    "mevlut-davetiyesi": [
      { q: "Mevlüt davetiyesi ne zaman gönderilir?", a: "Mevlüt tarihinden 2-3 hafta önce gönderilir." },
      { q: "Mevlüt davetiyesine sebep yazılır mı?", a: "Evet, mevlüt sebebini (doğum, vefat vb.) ekleyebilirsiniz." },
      { q: "Mevlüt davetiyesi şablonu var mı?", a: "Evet, 2 farklı mevlüt davetiyesi şablonu mevcuttur." },
      { q: "Mevlüt davetiyesi özelleştirilebilir mi?", a: "Evet, tüm metinler özelleştirilebilir." },
      { q: "Mevlüt davetiyesi maliyeti?", a: "499₺ tek seferlik ödeme." },
    ],
    "acilis-daveti": [
      { q: "Açılış daveti ne zaman gönderilir?", a: "Açılış tarihinden 1-2 hafta önce gönderilir." },
      { q: "Açılış davetinde firma adı nasıl yazılır?", a: "Firma/mekan adı ana başlıkta gösterilir." },
      { q: "Açılış daveti şablonu kaç tane?", a: "2 farklı açılış daveti şablonu mevcuttur." },
      { q: "Açılış daveti kurumsal görünüm sağlar mı?", a: "Evet, profesyonel ve kurumsal tasarımlar sunulur." },
      { q: "Açılış daveti maliyeti nedir?", a: "499₺ tek seferlik ödeme." },
    ],
    "kurumsal-toplanti": [
      { q: "Toplantı davetiyesi ne zaman gönderilir?", a: "Toplantı tarihinden 1-2 hafta önce gönderilir." },
      { q: "Toplantı davetiyesine organizasyon adı eklenir mi?", a: "Evet, organizasyon ve etkinlik adı eklenebilir." },
      { q: "Toplantı davetiyesi şablonu var mı?", a: "Evet, 2 farklı toplantı davetiyesi şablonu mevcuttur." },
      { q: "Toplantı davetiyesi takvime eklenebilir mi?", a: "Evet, misafirler takvime ekleyebilir butonu vardır." },
      { q: "Toplantı davetiyesi maliyeti?", a: "499₺ tek seferlik ödeme." },
    ],
  };
  return faqs[slug] ?? [];
}
