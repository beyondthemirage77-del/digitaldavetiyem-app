import type { ArticleSlug } from "./blogData";

export interface BlogArticleContent {
  title: string;
  content: string;
  faqs: { question: string; answer: string }[];
  relatedSlugs: ArticleSlug[];
}

export const BLOG_CONTENT: Partial<Record<ArticleSlug, BlogArticleContent>> = {
  "dijital-davetiye-nasil-yapilir": {
    title: "Dijital Davetiye Nasıl Yapılır? Adım Adım Rehber (2026)",
    content: `Dijital davetiye, modern düğün ve organizasyonların vazgeçilmezi haline geldi. Peki dijital davetiye nasıl yapılır? Bu rehberde adım adım anlatıyoruz.

## Dijital Davetiye Nedir?

Dijital davetiye; kağıt davetiye yerine online olarak oluşturulan, WhatsApp, Instagram ve SMS üzerinden paylaşılan interaktif bir davetiye türüdür. Müzik, fotoğraf, geri sayım sayacı ve RSVP formu içerebilen dijital davetiyeler, geleneksel kağıt davetiyelerden çok daha işlevseldir.

## Neden Dijital Davetiye Tercih Etmeli?

Türkiye'de her geçen yıl daha fazla çift dijital davetiye tercih ediyor. Bunun başlıca nedenleri:

- **Maliyet avantajı:** Dijital davetiye, kağıt davetiyeye kıyasla %70 daha ucuzdur
- **Hız:** Dijital davetiyeniz dakikalar içinde yüzlerce misafire ulaşır
- **Çevre dostu:** Kağıt israfı olmadan özel gününüzü kutlayabilirsiniz
- **Interaktivite:** Müzik, fotoğraf slaytı, geri sayım sayacı ekleyebilirsiniz
- **RSVP takibi:** Misafir katılımını otomatik olarak takip edebilirsiniz

## Dijital Davetiye Nasıl Yapılır? 4 Adımda Rehber

### Adım 1: Şablon Seçin
DigitalDavetiyem.com'da düğün, nişan, baby shower, sünnet, doğum günü, kına, mevlüt ve açılış daveti için 22'den fazla dijital davetiye şablonu bulunur. Kategorinize uygun şablonu seçin.

### Adım 2: Bilgilerinizi Girin
İsimler, tarih, mekan bilgisi ve davetiye notunuzu girin. Her alan kategoriye özel olarak hazırlanmıştır.

### Adım 3: Dijital Davetiyenizi Özelleştirin
- Arka plan müziği ekleyin
- Fotoğraf veya fotoğraf slaytı ekleyin
- Yazı tipi ve renklerini değiştirin
- Geri sayım sayacını aktif edin
- RSVP formunu düzenleyin

### Adım 4: Yayınlayın ve Paylaşın
499₺ tek seferlik ödemeyle dijital davetiyenizi yayınlayın. WhatsApp, Instagram, SMS veya e-posta ile paylaşın.

## Dijital Davetiye İçin En İyi Platform

Türkiye'de dijital davetiye oluşturmak için en kapsamlı platform DigitalDavetiyem.com'dur. 22+ şablon, kolay özelleştirme ve 7/24 destek ile özel gününüzü unutulmaz kılın.`,
    faqs: [
      {
        question: "Dijital davetiye ücretli mi?",
        answer:
          "DigitalDavetiyem.com'da dijital davetiye oluşturmak ücretsizdir. Yayınlamak için 499₺ tek seferlik ödeme yeterlidir.",
      },
      {
        question: "Dijital davetiye telefonda açılır mı?",
        answer:
          "Evet, tüm dijital davetiyelerimiz mobil uyumludur. Her telefon ve tablet modelinde sorunsuz açılır.",
      },
      {
        question: "Dijital davetiyeye müzik eklenebilir mi?",
        answer:
          "Evet, hazır müzik listesinden seçebilir veya kendi müziğinizi yükleyebilirsiniz.",
      },
      {
        question: "Dijital davetiye kaç kişiye gönderilebilir?",
        answer: "Sınırsız. 499₺ ödediğinizde istediğiniz kadar kişiye gönderebilirsiniz.",
      },
      {
        question: "Dijital davetiyeyi yayınladıktan sonra değişiklik yapılabilir mi?",
        answer: "Evet, yayınladıktan sonra da istediğiniz zaman düzenleme yapabilirsiniz.",
      },
    ],
    relatedSlugs: ["dugun-davetiyesi-ornekleri", "whatsapp-davetiye-paylasimi", "kagit-davetiye-mi-dijital-davetiye-mi"],
  },
  "dugun-davetiyesi-ornekleri": {
    title: "2026 Düğün Davetiyesi Örnekleri ve Trendleri",
    content: `2026 yılında düğün davetiyesi trendleri hızla değişiyor. Dijital davetiye artık kağıt davetiyenin yerini tamamen alıyor. En popüler düğün davetiyesi örneklerini ve 2026 trendlerini derledik.

## 2026 Dijital Düğün Davetiyesi Trendleri

### 1. Klasik & Zarif Düğün Davetiyesi
Krem ve altın tonlarıyla hazırlanan klasik dijital düğün davetiyesi her zaman moda. Cormorant Garamond gibi serif fontlar bu tarzı tamamlıyor. Özellikle geleneksel düğünler için ideal dijital davetiye seçeneğidir.

### 2. Modern & Minimal Düğün Davetiyesi
Siyah-beyaz, temiz çizgiler ve bold fontlarla hazırlanan minimal dijital düğün davetiyesi genç çiftlerin favorisi. 2026'te en çok tercih edilen dijital davetiye trendi bu.

### 3. Bohem Tarzı Dijital Davetiye
Pampa çiçekleri, toprak tonları ve el yazısı fontlarıyla hazırlanan bohem dijital davetiyeler doğa sever çiftler için ideal.

## Düğün Davetiyesi Renk Trendleri 2026

- **Sage yeşili + krem:** Doğal ve zarif
- **Terracotta + altın:** Sıcak ve romantik
- **Lacivert + gümüş:** Modern ve şık
- **Bej + kahve:** Minimalist ve sofistike

## Dijital Düğün Davetiyesi Metin Önerileri

### Resmi Metin:
"Sayın misafirimiz, [Tarih] tarihinde gerçekleşecek nikah törenimize teşriflerinizi rica ederiz."

### Samimi Metin:
"Bu mutlu günümüzü sizinle paylaşmak istiyoruz!"

### Modern Metin:
"Save the date! [İsimler] evleniyor 🎉"

## En Güzel Dijital Düğün Davetiyesi Şablonları

DigitalDavetiyem.com'da klasik, modern ve bohem tarzında düğün davetiyesi şablonları bulunur. Hepsini ücretsiz önizleyebilirsiniz.`,
    faqs: [
      {
        question: "Dijital düğün davetiyesi nasıl olmalı?",
        answer:
          "İsimler, tarih, mekan, davetiye notu ve iletişim bilgilerini içermelidir.",
      },
      {
        question: "Düğün davetiyesinde ne yazmalı?",
        answer: "Gelin ve damat isimleri, nikah tarihi ve saati, mekan adı ve adresi.",
      },
      {
        question: "Düğün davetiyesi ne zaman gönderilmeli?",
        answer: "Düğünden en az 3-4 hafta önce gönderilmesi önerilir.",
      },
      {
        question: "En güzel dijital düğün davetiyesi nasıl yapılır?",
        answer: "Kaliteli şablon seçin, kişisel fotoğraf ekleyin, müzik seçin.",
      },
    ],
    relatedSlugs: ["dijital-davetiye-nasil-yapilir", "nisan-davetiyesi-nasil-olmali"],
  },
  "kagit-davetiye-mi-dijital-davetiye-mi": {
    title: "Kağıt Davetiye mi, Dijital Davetiye mi? 2026 Karşılaştırması",
    content: `Düğün planlamasında en çok sorulan sorulardan biri: "Kağıt davetiye mi kullansam, dijital davetiye mi?" Maliyet, pratiklik ve çevre dostu yaklaşım açısından karşılaştırdık.

## Maliyet Karşılaştırması

| | Kağıt Davetiye | Dijital Davetiye |
|---|---|---|
| 100 kişi için | 1.000-3.000₺ | 499₺ |
| 200 kişi için | 2.000-6.000₺ | 499₺ |
| Tasarım ücreti | 200-500₺ ayrıca | Dahil |
| Baskı ücreti | Dahil | Yok |
| Kargo/dağıtım | 200-500₺ | Yok |
| **Toplam (100 kişi)** | **1.400-4.000₺** | **499₺** |

Dijital davetiye ile ortalama 1.500₺ tasarruf edebilirsiniz.

## Pratiklik Karşılaştırması

**Kağıt Davetiye:**
- Adres toplamak gerekir
- Baskı için 1-2 hafta beklenir
- Kargo ile gönderim yapılır
- Değişiklik yapılamaz

**Dijital Davetiye:**
- WhatsApp'tan anında gönderilir
- Dakikalar içinde hazır
- Yayınladıktan sonra da düzenlenebilir
- RSVP otomatik takip edilir

## Çevre Dostu Yaklaşım

Her yıl Türkiye'de milyonlarca kağıt davetiye basılıyor. Dijital davetiye tercih ederek hem para tasarruf eder hem de çevreye katkı sağlarsınız.

## Her İkisini Birlikte Kullanabilirsiniz

Kağıt davetiyenize dijital davetiye QR kodu ekleyebilirsiniz. Bu sayede hem geleneksel hem modern bir deneyim sunarsınız.

## Sonuç: Dijital Davetiye Kazanıyor

2026 yılında dijital davetiye hem ekonomik hem pratik hem de çevre dostu olduğu için açık ara öne çıkıyor. DigitalDavetiyem.com ile 499₺'ye profesyonel dijital davetiye oluşturabilirsiniz.`,
    faqs: [
      {
        question: "Dijital davetiye kağıt davetiyenin yerini tutabilir mi?",
        answer: "Evet, üstelik çok daha fazla özellik sunar.",
      },
      {
        question: "Yaşlı misafirler dijital davetiyeyi kullanabilir mi?",
        answer: "Evet, link tıklamak yeterli. Telefonda kolayca açılır.",
      },
      {
        question: "Hem kağıt hem dijital davetiye kullanılabilir mi?",
        answer: "Evet, QR kod ekleyerek ikisini birleştirebilirsiniz.",
      },
    ],
    relatedSlugs: ["dijital-davetiye-nasil-yapilir", "en-iyi-dijital-davetiye-siteleri", "whatsapp-davetiye-paylasimi"],
  },
  "en-iyi-dijital-davetiye-siteleri": {
    title: "Türkiye'nin En İyi Dijital Davetiye Siteleri 2026",
    content: `Türkiye'de dijital davetiye platformları hızla artıyor. Peki hangi dijital davetiye sitesi en iyi? Detaylı karşılaştırdık.

## Dijital Davetiye Sitesi Seçerken Dikkat Edilmesi Gerekenler

1. **Şablon çeşitliliği:** Ne kadar çok kategori ve şablon o kadar iyi
2. **Özelleştirme:** Font, renk, müzik değiştirilebilmeli
3. **RSVP özelliği:** Misafir takibi olmazsa olmaz
4. **Fiyat:** Tek seferlik mi, aylık abonelik mi?
5. **Mobil uyumluluk:** Tüm telefonlarda açılmalı
6. **Destek:** Sorun çıkınca ulaşılabilmeli

## En İyi Dijital Davetiye Platformu: DigitalDavetiyem.com

DigitalDavetiyem.com Türkiye'nin en kapsamlı dijital davetiye platformudur.

**Öne Çıkan Özellikler:**
- 22+ profesyonel şablon (düğün, nişan, baby shower, sünnet, doğum günü, kına, mevlüt, açılış, toplantı)
- Sınırsız özelleştirme (font, renk, müzik, fotoğraf)
- Gerçek zamanlı RSVP takibi ve CSV dışa aktarma
- Geri sayım sayacı
- Google Haritalar entegrasyonu
- Arka plan müziği ve sesli mesaj
- PNG ve PDF indirme
- WhatsApp önizlemesi
- 499₺ tek seferlik ödeme
- Yayın sonrası düzenleme imkanı

## Dijital Davetiye Fiyat Karşılaştırması

| Platform | Fiyat | Şablon Sayısı | RSVP |
|---|---|---|---|
| DigitalDavetiyem.com | 499₺ tek seferlik | 22+ | Evet |
| Diğer platformlar | Aylık abonelik | Sınırlı | Kısıtlı |

## Sonuç

Dijital davetiye platformu seçerken fiyat, özellik ve kullanım kolaylığını birlikte değerlendirin. DigitalDavetiyem.com tüm bu kriterlerde öne çıkan Türkiye'nin en iyi dijital davetiye sitesidir.`,
    faqs: [
      {
        question: "Türkiye'nin en iyi dijital davetiye sitesi hangisi?",
        answer:
          "Şablon çeşitliliği ve özellikler açısından DigitalDavetiyem.com öne çıkıyor.",
      },
      {
        question: "Dijital davetiye sitesi ücretli mi?",
        answer:
          "DigitalDavetiyem.com'da 499₺ tek seferlik ödemeyle yayınlayabilirsiniz.",
      },
      {
        question: "En ucuz dijital davetiye sitesi hangisi?",
        answer:
          "Tek seferlik ödeme sistemiyle DigitalDavetiyem.com en ekonomik seçenektir.",
      },
    ],
    relatedSlugs: ["dijital-davetiye-nasil-yapilir", "kagit-davetiye-mi-dijital-davetiye-mi"],
  },
  "whatsapp-davetiye-paylasimi": {
    title: "WhatsApp'ta Davetiye Nasıl Paylaşılır?",
    content: `## WhatsApp Davetiye Paylaşımı
Misafirlerinizin %98'i davetiyeyi WhatsApp üzerinden açıyor.

## Adımlar
1. DigitalDavetiyem.com'da davetiyenizi oluşturun
2. Ödeme yapın ve linkinizi alın
3. Linki WhatsApp'ta kopyalayıp yapıştırın
4. Link önizlemesi otomatik görünür (başlık, açıklama, fotoğraf)

## WhatsApp Grup Paylaşımı
Düğün grubuna tek mesajla tüm misafirlerinize ulaşın.

## Toplu Mesaj İpuçları
- Kişiselleştirilmiş mesaj ekleyin
- Sabah 10-12 arası gönderin
- RSVP için son tarih belirtin`,
    faqs: [],
    relatedSlugs: ["dijital-davetiye-nasil-yapilir", "dugun-rsvp-takibi"],
  },
  "dugun-rsvp-takibi": {
    title: "Düğün RSVP Takibi Nasıl Yapılır?",
    content: `## RSVP Nedir?
RSVP (Répondez s'il vous plaît) misafirlerin katılım durumunu bildirmesidir.

## Neden Önemli?
- Catering sayısını önceden bilmek
- Oturma düzeni planlamak
- Ulaşım organizasyonu

## DigitalDavetiyem.com ile RSVP
Davetiyenize RSVP formu ekleyin:
1. Misafir adı
2. Katılım durumu (Geliyor/Gelmiyor/Belirsiz)
3. Kişi sayısı
4. Not

Dashboard'dan tüm yanıtları görüntüleyin ve CSV olarak indirin.

## İpuçları
- Son yanıt tarihi belirtin
- Hatırlatma mesajı gönderin
- 2 hafta öncesinden sorun`,
    faqs: [],
    relatedSlugs: ["dijital-davetiye-nasil-yapilir", "whatsapp-davetiye-paylasimi"],
  },
  "nisan-davetiyesi-nasil-olmali": {
    title: "Nişan Davetiyesi Nasıl Olmalı? Metin ve Tasarım Önerileri",
    content: `## Nişan Davetiyesi Unsurları
Nişan davetiyesinde mutlaka şunlar bulunmalı:
- Nişanlıların adı
- Tarih ve saat
- Mekan bilgisi
- Davetiye notu

## Metin Önerileri
### Resmi:
"[İsim] ile [İsim]'in nişan törenine davetlisiniz."

### Samimi:
"Mutluluğumuzu sizinle paylaşmak istiyoruz!"

## Tasarım İpuçları
- Pembe ve altın tonları nişan için idealdir
- Çiçekli şablonlar romantik atmosfer yaratır
- Çift fotoğrafı eklemek kişiselleştirir

## Dijital Nişan Davetiyesi Avantajları
- Anında paylaşım
- Müzik ekleme imkanı
- RSVP takibi`,
    faqs: [],
    relatedSlugs: ["dugun-davetiyesi-ornekleri", "dijital-davetiye-nasil-yapilir"],
  },
};
