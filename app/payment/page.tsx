"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { generateSlug } from "@/lib/utils";
import { QRCodeCanvas } from "qrcode.react";
import { getTemplateById, getMainTitle, normalizeTemplateId } from "@/lib/templateData";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://digitaldavetiyem.com";

const features = [
  "Sınırsız misafir",
  "1 yıl aktif",
  "RSVP takibi",
  "WhatsApp paylaşım",
  "Arka plan müziği",
  "Geri sayım sayacı",
  "Google Haritalar",
  "Takvime ekle",
  "Özel link",
  "İstatistikler",
  "Sesli mesaj",
  "7/24 destek",
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id") || searchParams.get("invitationId");
  const isCustomizeOnly = searchParams.get("customize") === "true";

  const [invitation, setInvitation] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [slugCheckStatus, setSlugCheckStatus] = useState<"idle" | "checking" | "available" | "taken" | null>(null);
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);
  const [ogUploading, setOgUploading] = useState(false);
  const [toast, setToast] = useState("");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!invitationId || !db) return;

    const fetchInvitation = async () => {
      try {
        const ref_ = doc(db, "invitations", invitationId);
        const snap = await getDoc(ref_);
        if (snap.exists()) {
          const data = snap.data();
          const bride = (data.wedding_brideName as string) || (data.brideName as string) || "";
          const groom = (data.wedding_groomName as string) || (data.groomName as string) || "";
          setInvitation({ id: snap.id, ...data });
          setSlug((data.slug as string) || generateSlug(bride, groom) || "davetiye");
          setOgTitle(
            (data.ogTitle as string) || `${bride} & ${groom} Düğün Davetiyesi`
          );
          setOgDescription(
            (data.ogDescription as string) ||
              "Bu mutlu günümüzü sizinle paylaşmak istiyoruz. Davetimize bekliyoruz!"
          );
          setOgImageUrl((data.ogImageUrl as string) || data.mediaUrls?.[0] || null);
        } else {
          setInvitation(null);
        }
      } catch (err) {
        console.error("Fetch invitation failed:", err);
        setInvitation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const checkSlugAvailability = async () => {
    const trimmed = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "davetiye";
    if (!trimmed) return;

    setSlugCheckStatus("checking");
    try {
      const q = query(collection(db, "invitations"), where("slug", "==", trimmed));
      const snap = await getDocs(q);
      const exists = snap.docs.some((d) => d.id !== invitationId);
      setSlugCheckStatus(exists ? "taken" : "available");
      if (!exists) setSlug(trimmed);
    } catch {
      setSlugCheckStatus(null);
      showToast("Kontrol başarısız");
    }
  };

  const normalizedSlug =
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "davetiye";
  const baseUrl = BASE_URL.replace(/\/$/, "");
  const fullUrl = `${baseUrl}/${normalizedSlug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    showToast("Kopyalandı!");
  };

  const handleOgImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const user = auth.currentUser;
    if (!file || !user || !invitationId) return;

    setOgUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `og-images/${user.uid}/${invitationId}_${Date.now()}.${ext}`;
      const storageRef = ref(storage, path);
      await new Promise<void>((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, file);
        task.on("state_changed", () => {}, reject, async () => {
          const url = await getDownloadURL(storageRef);
          setOgImageUrl(url);
          resolve();
        });
      });
    } catch {
      showToast("Yükleme başarısız");
    } finally {
      setOgUploading(false);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "davetiye-qr.png";
    a.click();
  };

  const handlePayClick = () => {
    showToast("Ödeme sistemi yakında aktif olacak!");
  };

  const handleSaveSlug = async () => {
    if (!invitationId || !db || slugCheckStatus !== "available") {
      showToast(slugCheckStatus !== "available" ? "Önce link uygunluğunu kontrol edin" : "Hata");
      return;
    }
    setPublishing(true);
    try {
      const trimmedSlug =
        slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "davetiye";
      await updateDoc(doc(db, "invitations", invitationId), {
        slug: trimmedSlug,
        updatedAt: new Date().toISOString(),
      });
      showToast("Link güncellendi!");
      setSlugCheckStatus(null);
    } catch {
      showToast("Güncelleme başarısız");
    } finally {
      setPublishing(false);
    }
  };

  const handleFreePublish = async () => {
    if (!invitationId || !db) return;

    setPublishing(true);
    try {
      const trimmedSlug =
        slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "davetiye";
      console.log("Saving invitation with:", {
        slug: trimmedSlug,
        status: "active",
        isPaid: true,
        invitationId,
      });
      const ref_ = doc(db, "invitations", invitationId);
      await updateDoc(ref_, {
        slug: trimmedSlug,
        ogTitle: ogTitle.trim() || `${(invitation?.wedding_brideName ?? invitation?.brideName) ?? ""} & ${(invitation?.wedding_groomName ?? invitation?.groomName) ?? ""} Düğün Davetiyesi`.trim() || "Davetiyeniz",
        ogDescription:
          ogDescription.trim() ||
          "Bu mutlu günümüzü sizinle paylaşmak istiyoruz. Davetimize bekliyoruz!",
        ogImageUrl: ogImageUrl || null,
        status: "active",
        isPaid: true,
        updatedAt: new Date().toISOString(),
      });
      router.replace("/dashboard");
    } catch {
      showToast("Yayınlama başarısız");
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invitationId || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-[#737373]">Davetiye bulunamadı.</p>
      </div>
    );
  }

  const template = getTemplateById(normalizeTemplateId(invitation.templateId as string | number | null | undefined));

  if (isCustomizeOnly) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 32,
            maxWidth: 440,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            🔧 Linkinizi Özelleştirin
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
            digitaldavetiyem.com/davetiye-xxx → ayse-mehmet gibi özel bir link yapın
          </p>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#666" }}>
              {typeof window !== "undefined"
                ? (BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "") || "digitaldavetiyem.com")
                : "digitaldavetiyem.com"}
              /
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugCheckStatus(null);
              }}
              placeholder="ayse-mehmet"
              style={{
                width: "100%",
                marginTop: 8,
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #e5e5e5",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={checkSlugAvailability}
              disabled={slugCheckStatus === "checking"}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "white",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {slugCheckStatus === "checking" ? "Kontrol..." : "Kontrol Et"}
            </button>
            <button
              type="button"
              onClick={handleSaveSlug}
              disabled={slugCheckStatus !== "available" || publishing}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                background: slugCheckStatus === "available" ? "#111" : "#ccc",
                color: "white",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: slugCheckStatus === "available" && !publishing ? "pointer" : "not-allowed",
              }}
            >
              {publishing ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

          {slugCheckStatus === "available" && (
            <p className="text-sm text-green-600 mb-4">✅ Bu link uygun!</p>
          )}
          {slugCheckStatus === "taken" && (
            <p className="text-sm text-red-600 mb-4">❌ Bu link alınmış</p>
          )}

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              background: "white",
              border: "1px solid #ddd",
              fontSize: 14,
              fontWeight: 500,
              color: "#555",
              cursor: "pointer",
            }}
          >
            Paylaşmaya Devam Et →
          </button>

          {toast && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-[#171717] text-white text-sm font-medium shadow-lg z-50"
            >
              {toast}
            </div>
          )}
        </div>
      </div>
    );
  }

  const templateName = template?.name ?? "Davetiye";
  const coupleTitle = getMainTitle(
    template?.category ?? "Düğün",
    invitation as Record<string, string | undefined>
  );
  const eventDate = (invitation.eventDate as string) ?? "";
  const venueName = (invitation.venueName as string) ?? "";

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* 2-column grid: stacks on mobile, side-by-side on md+ */}
      <div
        className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-2 md:grid-rows-1"
      >
      {/* Left Column - Link & Share */}
      <div
        className="overflow-y-auto md:border-r md:border-[#eee] p-5 md:p-8 bg-[#fafafa] min-h-0"
      >
        <h2
          className="sticky top-0 z-10 bg-[#fafafa] pb-4 text-base font-semibold text-[#171717]"
          style={{ marginTop: 0 }}
        >
          🔗 Davetiye Linkinizi Oluşturun
        </h2>

        {/* Slug row */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-[#666] text-sm">
            {typeof window !== "undefined"
              ? (BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "") || "digitaldavetiyem.com")
              : "digitaldavetiyem.com"}
            /
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugCheckStatus(null);
            }}
            placeholder="ad-soyad"
            style={{
              flex: 1,
              minWidth: 140,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e5e5",
              fontSize: 14,
            }}
          />
          <button
            type="button"
            onClick={checkSlugAvailability}
            disabled={slugCheckStatus === "checking"}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {slugCheckStatus === "checking" ? "Kontrol..." : "Kontrol Et"}
          </button>
        </div>
        {slugCheckStatus === "available" && (
          <p className="text-sm text-green-600 mb-3">✅ Uygun!</p>
        )}
        {slugCheckStatus === "taken" && (
          <p className="text-sm text-red-600 mb-3">❌ Bu link alınmış</p>
        )}

        {/* Link Başlığı */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#525252] mb-1.5">
            Link Başlığı
          </label>
          <input
            type="text"
            value={ogTitle}
            onChange={(e) => setOgTitle(e.target.value)}
            placeholder="WhatsApp önizleme başlığı"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e5e5",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Link Açıklaması */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#525252] mb-1.5">
            Link Açıklaması
          </label>
          <textarea
            value={ogDescription}
            onChange={(e) => setOgDescription(e.target.value)}
            placeholder="Sosyal paylaşım önizleme metni"
            rows={3}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e5e5",
              fontSize: 14,
              boxSizing: "border-box",
              resize: "none",
            }}
          />
        </div>

        {/* Kapak Fotoğrafı */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#525252] mb-1">
            📸 Kapak Fotoğrafı
          </label>
          <p className="text-xs text-[#737373] mb-2">
            Yüklenmezse davetiyenizdeki fotoğraf kullanılır
          </p>
          <label
            style={{
              display: "block",
              border: "2px dashed #e5e5e5",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleOgImageChange}
              className="hidden"
            />
            {ogUploading ? (
              <span className="text-sm text-[#737373]">Yükleniyor...</span>
            ) : ogImageUrl ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImageUrl}
                  alt="Kapak"
                  style={{
                    maxHeight: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                    margin: "0 auto 8px",
                  }}
                />
                <span className="text-sm text-[#737373]">Değiştir</span>
              </div>
            ) : (
              <span className="text-sm text-[#737373]">
                Görsel seçmek için tıklayın
              </span>
            )}
          </label>
        </div>

        {/* Link & WhatsApp buttons */}
        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={copyLink}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            📋 Linki Kopyala
          </button>
          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            💬 WhatsApp Önizleme
          </button>
        </div>

        {/* Share buttons (locked state) */}
        <div
          style={{
            background: invitation?.isPaid ? "transparent" : "rgba(0,0,0,0.02)",
            borderRadius: 12,
            border: invitation?.isPaid ? "1px solid #eee" : "2px dashed #ddd",
            padding: 16,
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-[#525252]">
              📤 Davetiyeni Paylaş
            </span>
            {!invitation?.isPaid && (
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                🔒 Kilitli
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {invitation?.isPaid ? (
              <>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(ogTitle + " " + fullUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    minWidth: 100,
                    padding: 10,
                    borderRadius: 10,
                    background: "#25D366",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  💬 WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(fullUrl);
                    showToast("Instagram için link kopyalandı!");
                  }}
                  style={{
                    flex: 1,
                    minWidth: 100,
                    padding: 10,
                    borderRadius: 10,
                    background:
                      "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                    color: "white",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  📸 Instagram
                </button>
                <a
                  href={`sms:?body=${encodeURIComponent(ogTitle + " " + fullUrl)}`}
                  style={{
                    flex: 1,
                    minWidth: 100,
                    padding: 10,
                    borderRadius: 10,
                    background: "#007AFF",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  💬 SMS
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(ogTitle)}&body=${encodeURIComponent(ogTitle + "\n\n" + fullUrl)}`}
                  style={{
                    flex: 1,
                    minWidth: 100,
                    padding: 10,
                    borderRadius: 10,
                    background: "#555",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  ✉️ E-posta
                </a>
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  style={{
                    flex: 1,
                    minWidth: 100,
                    padding: 10,
                    borderRadius: 10,
                    background: "#111",
                    color: "white",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  📱 QR
                </button>
              </>
            ) : (
              <>
                {[
                  { label: "💬 WhatsApp", bg: "#25D366" },
                  {
                    label: "📸 Instagram",
                    bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                  },
                  { label: "💬 SMS", bg: "#007AFF" },
                  { label: "✉️ E-posta", bg: "#555" },
                  { label: "📱 QR", bg: "#111" },
                ].map(({ label, bg }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      showToast("Bu özellik ödeme sonrası aktif olur")
                    }
                    style={{
                      position: "relative",
                      flex: 1,
                      minWidth: 100,
                      padding: 10,
                      borderRadius: 10,
                      background: bg,
                      color: "white",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                    <span style={{ marginLeft: 4, fontSize: 10 }}>🔒</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Payment */}
      <div
        className="flex flex-col overflow-y-auto flex-1 min-h-0 p-5 md:p-8 bg-white"
      >
        {/* Summary card */}
        <div
          style={{
            background: "#f9f9f9",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
            <div>{templateName}</div>
            <div>{coupleTitle}</div>
            <div>{eventDate}</div>
            <div>{venueName}</div>
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            499₺
          </div>
          <div style={{ fontSize: 13, color: "#888" }}>
            tek seferlik • KDV dahil
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 12px",
            marginBottom: 24,
          }}
        >
          {features.map((f) => (
            <div
              key={f}
              style={{
                fontSize: 12,
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span> {f}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "auto" }}>
          <button
            type="button"
            onClick={handlePayClick}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              background: "#111",
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 10,
              cursor: "pointer",
              border: "none",
            }}
          >
            Ödemeye Geç →
          </button>
          <button
            type="button"
            onClick={handleFreePublish}
            disabled={publishing}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              background: "white",
              border: "1px solid #ddd",
              fontSize: 13,
              color: "#666",
              cursor: "pointer",
              opacity: publishing ? 0.6 : 1,
            }}
          >
            🧪 Test: Ücretsiz Yayınla
          </button>
        </div>
      </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-[#171717] text-white text-sm font-medium shadow-lg z-50"
        >
          {toast}
        </div>
      )}

      {/* WhatsApp Preview Modal */}
      {showWhatsAppModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowWhatsAppModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              maxWidth: 360,
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#171717] mb-4">
              💬 WhatsApp Önizleme
            </h3>

            {/* Fake WhatsApp chat bubble */}
            <div
              style={{
                background: "#dcf8c6",
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
                borderTopRightRadius: 4,
              }}
            >
              <div
                style={{
                  background: ogImageUrl ? "transparent" : "#e5e5e5",
                  borderRadius: 8,
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  color: "#999",
                  fontSize: 24,
                  overflow: "hidden",
                }}
              >
                {ogImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ogImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "📸"
                )}
              </div>
              <p
                className="font-semibold text-[#111] text-sm mb-1"
                style={{ lineHeight: 1.3 }}
              >
                {ogTitle || "Davetiye"}
              </p>
              <p
                className="text-xs text-[#666] mb-2"
                style={{ lineHeight: 1.4 }}
              >
                {ogDescription || "Bu mutlu günümüzü sizinle paylaşmak istiyoruz."}
              </p>
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs truncate block"
                style={{ color: "#128C7E" }}
              >
                {fullUrl}
              </a>
            </div>

            <p className="text-xs text-[#737373] mb-5" style={{ lineHeight: 1.5 }}>
              Müşterilerinizin %98&apos;i davetiyeyi WhatsApp ile paylaşıyor
            </p>

            <button
              type="button"
              onClick={() => setShowWhatsAppModal(false)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowQR(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              maxWidth: 320,
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#171717] mb-4">
              📱 QR Kod
            </h3>
            <div ref={qrRef} className="flex justify-center mb-5">
              <QRCodeCanvas value={fullUrl} size={200} />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={downloadQR}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  background: "#111",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                İndir
              </button>
              <button
                type="button"
                onClick={() => setShowQR(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
    </AuthGuard>
  );
}
