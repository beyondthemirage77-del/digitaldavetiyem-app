"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { normalizeTemplateId } from "@/lib/templateData";
import AudioPlayer from "@/components/media/AudioPlayer";
import { formatEventDate, generateIcsContent } from "@/lib/utils";
import type { Invitation, RSVPResponse } from "@/lib/types";

const SITE_NAME = "DigitalDavetiyem.com";

export default function InvitationPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? null;
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    guestName: "",
    guestCount: 1,
    response: "" as RSVPResponse | "",
    note: "",
  });

  useEffect(() => {
    if (invitation?.id && typeof window !== "undefined") {
      if (localStorage.getItem(`rsvp_${invitation.id}`)) {
        setRsvpSubmitted(true);
      }
    }
  }, [invitation?.id]);

  useEffect(() => {
    if (!slug || !db) return;

    const fetchInvitation = async () => {
      try {
        console.log("Looking for slug:", slug);
        const q = query(
          collection(db, "invitations"),
          where("slug", "==", slug)
          // TEMPORARILY remove: where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        console.log("Query result empty:", snap.empty);
        console.log("Query result size:", snap.size);
        if (snap.empty) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const found = snap.docs[0];
        const data = found.data();
        const inv: Invitation = {
          id: found.id,
          userId: data.userId,
          slug: data.slug,
          status: data.status,
          isPaid: data.isPaid,
          templateId: normalizeTemplateId(data.templateId) ?? 1,
          brideName: data.brideName ?? "",
          groomName: data.groomName ?? "",
          motherName: data.motherName ?? "",
          fatherName: data.fatherName ?? "",
          childName: data.childName ?? "",
          age: data.age ?? "",
          parentNames: data.parentNames ?? "",
          hostName: data.hostName ?? "",
          mevlutReason: data.mevlutReason ?? "",
          eventTitle: data.eventTitle ?? "",
          organizationName: data.organizationName ?? "",
          wedding_brideName: data.wedding_brideName ?? data.brideName,
          wedding_groomName: data.wedding_groomName ?? data.groomName,
          kina_brideName: data.kina_brideName ?? data.brideName,
          babyshower_motherName: data.babyshower_motherName ?? data.motherName,
          cinsiyet_parentNames: data.cinsiyet_parentNames ?? data.parentNames,
          sunnet_childName: data.sunnet_childName ?? data.childName,
          sunnet_parentNames: data.sunnet_parentNames,
          dogum_childName: data.dogum_childName ?? data.childName,
          dogum_age: data.dogum_age ?? data.age,
          mevlut_hostName: data.mevlut_hostName ?? data.hostName,
          mevlut_reason: data.mevlut_reason ?? data.mevlutReason,
          toplanti_eventTitle: data.toplanti_eventTitle ?? data.eventTitle,
          toplanti_organizationName: data.toplanti_organizationName ?? data.organizationName,
          acilis_firmaAdi: data.acilis_firmaAdi,
          mainTitle: data.mainTitle,
          eventDate: data.eventDate ?? "",
          eventTime: data.eventTime ?? "",
          venueName: data.venueName ?? "",
          venueAddress: data.venueAddress ?? "",
          googleMapsUrl: data.googleMapsUrl ?? "",
          mediaType: data.mediaType ?? "image",
          audioType: data.audioType ?? "none",
          backgroundType: data.backgroundType ?? "upload",
          presetBackground: data.presetBackground ?? "cream",
          mediaUrls: data.mediaUrls ?? [],
          audioUrl: data.audioUrl ?? "",
          musicTrack: data.musicTrack ?? "romantic-piano",
          fontFamily: data.fontFamily ?? "cormorant",
          textColor: data.textColor ?? "#FFFFFF",
          countdownStyle: data.countdownStyle ?? "classic",
          fontSizeScale: data.fontSizeScale ?? 1.0,
          showFamilyNames: data.showFamilyNames ?? false,
          showAvatar: data.showAvatar,
          avatarUrl1: data.avatarUrl1,
          avatarUrl2: data.avatarUrl2,
          avatarShape: data.avatarShape,
          showCountdown: data.showCountdown,
          showNote: data.showNote,
          showVenue: data.showVenue,
          showSubtitle: data.showSubtitle ?? true,
          showDate: data.showDate ?? true,
          showReminderButton: data.showReminderButton,
          showScrollIndicator: data.showScrollIndicator,
          subtitle: data.subtitle ?? data.titleText,
          titleText: data.titleText,
          noteText: data.noteText,
          familyNames: data.familyNames ?? {
            brideMotherName: "",
            brideFatherName: "",
            groomMotherName: "",
            groomFatherName: "",
            brideFamilySurname: "",
            groomFamilySurname: "",
          },
          rsvpEnabled: data.rsvpEnabled ?? false,
          viewCount: data.viewCount ?? 0,
          createdAt: data.createdAt ?? "",
          updatedAt: data.updatedAt ?? "",
        };
        setInvitation(inv);

        try {
          const ref = doc(db, "invitations", found.id);
          await updateDoc(ref, { viewCount: increment(1) });
        } catch {
          // viewCount update may fail for unauthenticated viewers (owner-only write)
        }
      } catch (err) {
        console.error("Fetch invitation error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]);

  const handleAddToCalendar = () => {
    if (!invitation) return;
    const part1 = invitation.wedding_brideName ?? invitation.kina_brideName ?? invitation.brideName ?? "";
    const part2 = invitation.wedding_groomName ?? invitation.groomName ?? "";
    const ics = generateIcsContent(
      part1,
      part2,
      invitation.eventDate ?? "",
      invitation.eventTime ?? "",
      invitation.venueName ?? "",
      invitation.venueAddress ?? ""
    );
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nikah-${invitation.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation || !rsvpForm.guestName.trim() || !rsvpForm.response) return;
    const key = `rsvp_${invitation.id}`;
    if (typeof window !== "undefined" && localStorage.getItem(key)) {
      setRsvpSubmitted(true);
      return;
    }
    setRsvpSending(true);
    try {
      await addDoc(collection(db, "invitations", invitation.id, "rsvps"), {
        guestName: rsvpForm.guestName.trim(),
        guestCount: Math.min(10, Math.max(1, rsvpForm.guestCount)),
        response: rsvpForm.response as RSVPResponse,
        note: rsvpForm.note.trim(),
        createdAt: new Date().toISOString(),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(key, "1");
      }
      setRsvpSubmitted(true);
    } catch (err) {
      console.error("RSVP submit error:", err);
    } finally {
      setRsvpSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-10 h-10 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>💌</div>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
          Davetiye Bulunamadı
        </h1>
        <p style={{ color: "#888", fontSize: 14 }}>
          Bu davetiye mevcut değil veya yayından kaldırılmış olabilir.
        </p>
        <Link
          href="/"
          className="mt-6 text-[#171717] underline hover:no-underline"
        >
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1 - Template */}
      <div className="w-full max-w-[390px] mx-auto">
        <TemplateRenderer
          variant="live"
          templateId={invitation.templateId}
          wedding_brideName={invitation.wedding_brideName}
          wedding_groomName={invitation.wedding_groomName}
          kina_brideName={invitation.kina_brideName}
          babyshower_motherName={invitation.babyshower_motherName}
          cinsiyet_parentNames={invitation.cinsiyet_parentNames}
          sunnet_childName={invitation.sunnet_childName}
          sunnet_parentNames={invitation.sunnet_parentNames}
          dogum_childName={invitation.dogum_childName}
          dogum_age={invitation.dogum_age}
          mevlut_hostName={invitation.mevlut_hostName}
          mevlut_reason={invitation.mevlut_reason}
          toplanti_eventTitle={invitation.toplanti_eventTitle}
          toplanti_organizationName={invitation.toplanti_organizationName}
          acilis_firmaAdi={invitation.acilis_firmaAdi}
          mainTitle={invitation.mainTitle}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
          motherName={invitation.motherName}
          fatherName={invitation.fatherName}
          childName={invitation.childName}
          age={invitation.age}
          parentNames={invitation.parentNames}
          hostName={invitation.hostName}
          mevlutReason={invitation.mevlutReason}
          eventTitle={invitation.eventTitle}
          organizationName={invitation.organizationName}
          eventDate={invitation.eventDate}
          eventTime={invitation.eventTime}
          venueName={invitation.venueName}
          venueAddress={invitation.venueAddress}
          googleMapsUrl={invitation.googleMapsUrl}
          rsvpEnabled={invitation.rsvpEnabled}
          mediaUrls={invitation.mediaUrls}
          mediaType={invitation.mediaType}
          backgroundType={invitation.backgroundType}
          presetBackground={invitation.presetBackground}
          fontFamily={invitation.fontFamily as "cormorant" | "inter" | "dancing" | "playfair"}
          textColor={invitation.textColor}
          countdownStyle={invitation.countdownStyle as "classic" | "modern" | "minimal"}
          fontSizeScale={invitation.fontSizeScale ?? 1.0}
          titleFontSize={invitation.titleFontSize ?? 12}
          namesFontSize={invitation.namesFontSize ?? 38}
          countdownFontSize={invitation.countdownFontSize ?? 24}
          titleFontFamily={invitation.titleFontFamily as "cormorant" | "inter" | "dancing" | "playfair"}
          namesFontFamily={invitation.namesFontFamily as "cormorant" | "inter" | "dancing" | "playfair"}
          noteFontFamily={invitation.noteFontFamily as "cormorant" | "inter" | "dancing" | "playfair"}
          subtitle={invitation.subtitle ?? invitation.titleText ?? "Nikahımıza Davetlisiniz"}
          noteText={invitation.noteText ?? "Bu mutlu günümüzü sizinle paylaşmak istiyoruz"}
          showFamilyNames={invitation.showFamilyNames ?? false}
          familyNames={invitation.familyNames}
          showAvatar={invitation.showAvatar}
          avatarUrl1={invitation.avatarUrl1}
          avatarUrl2={invitation.avatarUrl2}
          avatarShape={invitation.avatarShape as "circle" | "square" | "rounded" | undefined}
          showCountdown={invitation.showCountdown}
          showNote={invitation.showNote}
          showVenue={invitation.showVenue}
          showSubtitle={invitation.showSubtitle ?? true}
          showDate={invitation.showDate ?? true}
          showReminderButton={invitation.showReminderButton}
          showScrollIndicator={invitation.showScrollIndicator}
          overlayStrength={invitation.overlayStrength as "light" | "medium" | "dark" | undefined}
        />
      </div>

      {/* Section 2 - Event Details (matches template styling exactly) */}
      <section className="w-full max-w-[390px] mx-auto px-6 py-12">
        <div style={{ background: "white", padding: "40px 24px", textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "24px" }}>
            Etkinlik Detayları
          </h3>
          <div style={{ border: "1px solid #eee", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
            <div style={{ fontSize: "16px", fontWeight: 500 }}>
              {formatEventDate(invitation.eventDate) || "-"}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              {invitation.eventTime || "-"}
            </div>
          </div>
          <div style={{ border: "1px solid #eee", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📍</div>
            <div style={{ fontSize: "16px", fontWeight: 500 }}>
              {invitation.venueName || "-"}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              {invitation.venueAddress || "-"}
            </div>
            {invitation.googleMapsUrl && (
              <a
                href={invitation.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  padding: "8px 20px",
                  background: "#111",
                  color: "white",
                  borderRadius: "20px",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                Konuma Git →
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCalendar}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              background: "white",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            📅 Takvime Ekle
          </button>
        </div>
      </section>

      {/* Section 3 - Audio Player */}
      {invitation.audioType !== "none" && (
        <AudioPlayer
          audioType={invitation.audioType}
          audioUrl={invitation.audioUrl}
          musicTrack={invitation.musicTrack}
        />
      )}

      {/* Section 4 - RSVP Form */}
      {invitation.rsvpEnabled && (
        <section className="max-w-lg mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] border border-[#f0f0f0] p-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#171717] mb-6 text-center">
              Katılım Bildirimi
            </h2>
            {rsvpSubmitted ? (
              <p className="text-center text-[#171717] py-8">
                Teşekkürler! Katılımınızı kaydettik 🎉
              </p>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.guestName}
                    onChange={(e) =>
                      setRsvpForm((f) => ({ ...f, guestName: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-[12px] border border-[#e5e5e5] focus:border-[#171717] focus:outline-none"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-2">
                    Kaç kişi geliyorsunuz?
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rsvpForm.guestCount}
                    onChange={(e) =>
                      setRsvpForm((f) => ({
                        ...f,
                        guestCount: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-[12px] border border-[#e5e5e5] focus:border-[#171717] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-2">
                    Gelecek misiniz? *
                  </label>
                  <div className="flex flex-col gap-2">
                    {(
                      [
                        { id: "attending" as RSVPResponse, label: "Evet, Geliyorum 🎉" },
                        { id: "not_attending" as RSVPResponse, label: "Maalesef Gelemiyorum" },
                        { id: "maybe" as RSVPResponse, label: "Henüz Bilmiyorum" },
                      ] as const
                    ).map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setRsvpForm((f) => ({ ...f, response: id }))
                        }
                        className={`py-3 rounded-[12px] border-2 text-left px-4 transition-colors ${
                          rsvpForm.response === id
                            ? "border-[#171717] bg-[#fafafa]"
                            : "border-[#e5e5e5] hover:border-[#d4d4d4]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-2">
                    Not ekleyin (isteğe bağlı)
                  </label>
                  <textarea
                    value={rsvpForm.note}
                    onChange={(e) =>
                      setRsvpForm((f) => ({ ...f, note: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-[12px] border border-[#e5e5e5] focus:border-[#171717] focus:outline-none resize-none"
                    placeholder="Mesajınız..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={rsvpSending || !rsvpForm.guestName.trim() || !rsvpForm.response}
                  className="w-full py-3 rounded-[12px] bg-[#171717] text-white font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rsvpSending ? "Gönderiliyor..." : "Bildirimi Gönder"}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Section 5 - Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-[#737373]">
          Bu davetiye {SITE_NAME} ile oluşturuldu
        </p>
        <Link
          href="/"
          className="inline-block mt-2 text-sm text-[#171717] underline hover:no-underline"
        >
          Ana sayfaya dön
        </Link>
      </footer>
    </div>
  );
}
