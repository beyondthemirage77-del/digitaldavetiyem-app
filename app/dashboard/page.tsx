"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { formatEventDate } from "@/lib/utils";
import { getTemplatePreviewBg } from "@/lib/templateData";
import { AuthGuard } from "@/components/AuthGuard";
import { QRCodeCanvas } from "qrcode.react";
import InvitationDownload from "@/components/InvitationDownload";
import type { InvitationStatus, RSVPResponse } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://digitaldavetiyem.com";

function getInvitationTitle(inv: InvitationWithStats): string {
  if (inv.wedding_brideName || inv.wedding_groomName) {
    return `${inv.wedding_brideName || ""} & ${inv.wedding_groomName || ""}`
      .trim()
      .replace(/^&|&$/g, "")
      .trim() || "İsimsiz Davetiye";
  }
  if (inv.kina_brideName) return `${inv.kina_brideName}'nın Kınası`;
  if (inv.babyshower_motherName) return `${inv.babyshower_motherName} - Baby Shower`;
  if (inv.cinsiyet_parentNames) return `${inv.cinsiyet_parentNames} - Cinsiyet Partisi`;
  if (inv.sunnet_childName) return `${inv.sunnet_childName} - Sünnet`;
  if (inv.dogum_childName) {
    return `${inv.dogum_childName}${inv.dogum_age ? ` ${inv.dogum_age} Yaş` : ""} - Doğum Günü`;
  }
  if (inv.mevlut_hostName) return `${inv.mevlut_hostName} - Mevlüt`;
  if (inv.toplanti_eventTitle) return inv.toplanti_eventTitle as string;
  if (inv.toplanti_organizationName) return inv.toplanti_organizationName as string;
  if (inv.acilis_firmaAdi) return `${inv.acilis_firmaAdi} - Açılış`;
  if (inv.brideName || inv.groomName) {
    const s = `${inv.brideName || ""} & ${inv.groomName || ""}`.trim().replace(/^&|&$/g, "").trim();
    if (s) return s;
  }
  return "İsimsiz Davetiye";
}

const RSVP_STATUS_BADGE: Record<
  RSVPResponse,
  { label: string; bg: string; color: string }
> = {
  attending: { label: "🎉 Geliyor", bg: "#dcfce7", color: "#166534" },
  not_attending: { label: "😔 Gelmiyor", bg: "#fee2e2", color: "#991b1b" },
  maybe: { label: "🤔 Belirsiz", bg: "#fef9c3", color: "#854d0e" },
};

interface InvitationWithStats {
  id: string;
  userId: string;
  slug: string;
  status: InvitationStatus;
  isPaid: boolean;
  templateId: number | string;
  brideName: string;
  groomName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  mediaUrls?: string[];
  viewCount?: number;
  attendingCount: number;
  attendingPeople: number;
  declineCount: number;
  maybeCount: number;
  wedding_brideName?: string;
  wedding_groomName?: string;
  kina_brideName?: string;
  babyshower_motherName?: string;
  cinsiyet_parentNames?: string;
  sunnet_childName?: string;
  sunnet_parentNames?: string;
  dogum_childName?: string;
  dogum_age?: string;
  mevlut_hostName?: string;
  toplanti_eventTitle?: string;
  toplanti_organizationName?: string;
  acilis_firmaAdi?: string;
}

interface RSVPEntry {
  id: string;
  guestName: string;
  guestCount: number;
  response: RSVPResponse;
  note: string;
  createdAt: string;
}

function DashboardContent() {
  const [invitations, setInvitations] = useState<InvitationWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [rsvpModalInv, setRsvpModalInv] = useState<InvitationWithStats | null>(null);
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([]);
  const [shareModalInv, setShareModalInv] = useState<InvitationWithStats | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const fetchInvitations = async () => {
      try {
        const q = query(
          collection(db, "invitations"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const list: InvitationWithStats[] = [];

        for (const d of snap.docs) {
          const data = d.data();
          const rsvpsSnap = await getDocs(
            collection(db, "invitations", d.id, "rsvps")
          );
          let attendingCount = 0;
          let attendingPeople = 0;
          let declineCount = 0;
          let maybeCount = 0;
          rsvpsSnap.docs.forEach((rd) => {
            const r = rd.data();
            const resp = r.response || "attending";
            if (resp === "attending") {
              attendingCount += 1;
              attendingPeople += r.guestCount || 1;
            } else if (resp === "not_attending") {
              declineCount += 1;
            } else if (resp === "maybe") {
              maybeCount += 1;
            }
          });

          list.push({
            id: d.id,
            userId: data.userId,
            slug: data.slug || "davetiye",
            status: data.status || "draft",
            isPaid: data.isPaid || false,
            templateId: data.templateId ?? 1,
            brideName: data.brideName || "",
            groomName: data.groomName || "",
            eventDate: data.eventDate || "",
            eventTime: data.eventTime || "",
            venueName: data.venueName || "",
            venueAddress: data.venueAddress || "",
            mediaUrls: data.mediaUrls,
            viewCount: data.viewCount ?? 0,
            attendingCount,
            attendingPeople,
            declineCount,
            maybeCount,
            wedding_brideName: data.wedding_brideName,
            wedding_groomName: data.wedding_groomName,
            kina_brideName: data.kina_brideName,
            babyshower_motherName: data.babyshower_motherName,
            cinsiyet_parentNames: data.cinsiyet_parentNames,
            sunnet_childName: data.sunnet_childName,
            sunnet_parentNames: data.sunnet_parentNames,
            dogum_childName: data.dogum_childName,
            dogum_age: data.dogum_age,
            mevlut_hostName: data.mevlut_hostName,
            toplanti_eventTitle: data.toplanti_eventTitle,
            toplanti_organizationName: data.toplanti_organizationName,
            acilis_firmaAdi: data.acilis_firmaAdi,
          });
        }

        list.sort(
          (a, b) =>
            new Date(b.eventDate || 0).getTime() -
            new Date(a.eventDate || 0).getTime()
        );
        setInvitations(list);
      } catch (err) {
        console.error("Fetch invitations failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const openRsvpModal = async (inv: InvitationWithStats) => {
    setRsvpModalInv(inv);
    try {
      const snap = await getDocs(
        collection(db, "invitations", inv.id, "rsvps")
      );
      const entries: RSVPEntry[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          guestName: data.guestName || "",
          guestCount: data.guestCount ?? 1,
          response: data.response || "attending",
          note: data.note || "",
          createdAt: data.createdAt || "",
        };
      });
      entries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRsvpEntries(entries);
    } catch {
      setRsvpEntries([]);
    }
  };

  const getStatusLabel = (r: RSVPResponse) => RSVP_STATUS_BADGE[r]?.label ?? r;

  const exportRsvpCsv = (inv: InvitationWithStats) => {
    const coupleName = `${inv.brideName}-${inv.groomName}`
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    const headers = ["Ad", "Durum", "KişiSayısı", "Not", "Tarih"];
    const rows = rsvpEntries.map((r) => [
      r.guestName,
      getStatusLabel(r.response),
      r.guestCount,
      r.note,
      r.createdAt ? new Date(r.createdAt).toLocaleString("tr-TR") : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${coupleName}-rsvp.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV indirildi");
  };

  const openShareModal = (inv: InvitationWithStats) => {
    setShareModalInv(inv);
  };

  const fullUrl = (inv: InvitationWithStats) => {
    const base = BASE_URL.replace(/\/$/, "");
    return `${base}/${inv.slug}`;
  };

  const ogTitle = (inv: InvitationWithStats) =>
    `${getInvitationTitle(inv)} Davetiyesi`;

  const downloadQR = () => {
    if (!shareModalInv) return;
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `davetiye-qr-${shareModalInv.slug}.png`;
    a.click();
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      const rsvpsSnap = await getDocs(
        collection(db, "invitations", id, "rsvps")
      );
      for (const rd of rsvpsSnap.docs) {
        await deleteDoc(doc(db, "invitations", id, "rsvps", rd.id));
      }
      await deleteDoc(doc(db, "invitations", id));
      setInvitations((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirm(null);
      showToast("Davetiye silindi");
    } catch {
      showToast("Silme başarısız");
    }
  };

  const totalInvites = rsvpEntries.length;
  const totalAttending = rsvpEntries.filter(
    (r) => r.response === "attending"
  ).length;
  const totalAttendingPeople = rsvpEntries
    .filter((r) => r.response === "attending")
    .reduce((s, r) => s + r.guestCount, 0);
  const totalDecline = rsvpEntries.filter(
    (r) => r.response === "not_attending"
  ).length;
  const totalMaybe = rsvpEntries.filter((r) => r.response === "maybe").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <div className="w-10 h-10 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] pb-24">
      <div style={{ padding: "32px 32px 0" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Davetiyelerim</h1>
      </div>
      <div
        className="mx-auto"
        style={{ maxWidth: 1100, padding: "32px 24px" }}
      >
        {/* Empty state */}
        {invitations.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 80,
              background: "white",
              borderRadius: 16,
              border: "1px solid #eee",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 16 }}>💌</div>
            <p
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#171717",
                marginBottom: 8,
              }}
            >
              Henüz davetiye oluşturmadınız
            </p>
            <Link
              href="/create"
              style={{
                display: "inline-block",
                marginTop: 16,
                padding: "12px 24px",
                background: "#111",
                color: "white",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              İlk Davetiyeni Oluştur
            </Link>
          </div>
        )}

        {/* Cards grid */}
        {invitations.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {invitations.map((inv) => (
              <div
                key={inv.id}
                style={{
                  position: "relative",
                  background: "white",
                  borderRadius: 16,
                  border: "1px solid #eee",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {/* Status badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    background:
                      inv.status === "active"
                        ? "#22c55e"
                        : inv.status === "expired"
                          ? "#ef4444"
                          : "#e5e5e5",
                    color:
                      inv.status === "active"
                        ? "white"
                        : inv.status === "expired"
                          ? "white"
                          : "#666",
                  }}
                >
                  {inv.status === "active"
                    ? "✓ Yayında"
                    : inv.status === "expired"
                      ? "Süresi Doldu"
                      : "Taslak"}
                </div>

                {/* Preview */}
                <div
                  style={{
                    height: 180,
                    background:
                      inv.mediaUrls?.[0]
                        ? `url(${inv.mediaUrls[0]}) center/cover`
                        : getTemplatePreviewBg(inv.templateId),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: 600,
                      textAlign: "center",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      padding: 16,
                    }}
                  >
                    {getInvitationTitle(inv)}
                  </p>
                </div>

                {/* Body */}
                <div style={{ padding: 16 }}>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#171717",
                      margin: "0 0 4px",
                    }}
                  >
                    {getInvitationTitle(inv)}
                  </p>
                  {inv.eventDate && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#666",
                        margin: "0 0 2px",
                      }}
                    >
                      {formatEventDate(inv.eventDate)}
                      {inv.eventTime && ` · ${inv.eventTime}`}
                    </p>
                  )}
                  {inv.venueName && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#666",
                        margin: 0,
                      }}
                    >
                      {inv.venueName}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#fafafa",
                    borderTop: "1px solid #eee",
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  <span>👁 {inv.viewCount ?? 0} Görüntülenme</span>
                  <span>
                    🎉 {inv.attendingCount} Katılacak ({inv.attendingPeople} kişi)
                  </span>
                  <span>❌ {inv.declineCount} Katılmayacak</span>
                  <span>🤔 {inv.maybeCount} Belirsiz</span>
                </div>

                {/* Actions */}
                <div
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <a
                    href={`/${inv.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      background: "white",
                      fontSize: 13,
                      color: "#333",
                      textDecoration: "none",
                    }}
                  >
                    Görüntüle
                  </a>
                  <Link
                    href={`/create?edit=${inv.id}`}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      background: "white",
                      fontSize: 13,
                      color: "#333",
                      textDecoration: "none",
                    }}
                  >
                    Düzenle
                  </Link>
                  <button
                    type="button"
                    onClick={() => openRsvpModal(inv)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      background: "white",
                      fontSize: 13,
                      color: "#333",
                      cursor: "pointer",
                    }}
                  >
                    RSVP
                  </button>
                  <button
                    type="button"
                    onClick={() => openShareModal(inv)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      background: "white",
                      fontSize: 13,
                      color: "#333",
                      cursor: "pointer",
                    }}
                  >
                    Paylaş
                  </button>
                  <InvitationDownload invitationId={inv.id} />
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirm(deleteConfirm === inv.id ? null : inv.id)
                    }
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ef4444",
                      background: "white",
                      fontSize: 13,
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    Sil
                  </button>
                </div>

                {/* Delete confirm */}
                {deleteConfirm === inv.id && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#fef2f2",
                      borderTop: "1px solid #fecaca",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#991b1b" }}>
                      Silmek istediğinize emin misiniz?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(inv.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "#ef4444",
                        color: "white",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Evet, Sil
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "1px solid #999",
                        background: "white",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-[#171717] text-white text-sm font-medium shadow-lg z-50"
        >
          {toast}
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpModalInv && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setRsvpModalInv(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 16px",
              }}
            >
              Katılım Bildirimleri - {getInvitationTitle(rsvpModalInv)}
            </h3>

            {rsvpEntries.length > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 12,
                      textAlign: "center",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                      {totalInvites}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Toplam Davet
                    </div>
                  </div>
                  <div
                    style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 12,
                      textAlign: "center",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                      {totalAttending}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Katılacak ({totalAttendingPeople} kişi)
                    </div>
                  </div>
                  <div
                    style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 12,
                      textAlign: "center",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                      {totalDecline}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Katılmayacak
                    </div>
                  </div>
                  <div
                    style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 12,
                      textAlign: "center",
                      border: "1px solid #eee",
                    }}
                  >
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                      {totalMaybe}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>Belirsiz</div>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                        <th style={{ padding: "10px 12px" }}>Ad Soyad</th>
                        <th style={{ padding: "10px 12px" }}>Durum</th>
                        <th style={{ padding: "10px 12px" }}>Kişi Sayısı</th>
                        <th style={{ padding: "10px 12px" }}>Not</th>
                        <th style={{ padding: "10px 12px" }}>Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvpEntries.map((r, i) => {
                        const badge = RSVP_STATUS_BADGE[r.response];
                        return (
                          <tr
                            key={r.id}
                            style={{
                              background: i % 2 === 1 ? "#fafafa" : "white",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                          >
                            <td style={{ padding: "10px 12px" }}>{r.guestName}</td>
                            <td style={{ padding: "10px 12px" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "4px 10px",
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  background: badge?.bg ?? "#f5f5f5",
                                  color: badge?.color ?? "#333",
                                }}
                              >
                                {getStatusLabel(r.response)}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>{r.guestCount}</td>
                            <td style={{ padding: "10px 12px" }}>{r.note}</td>
                            <td style={{ padding: "10px 12px" }}>
                              {r.createdAt
                                ? new Date(r.createdAt).toLocaleString("tr-TR")
                                : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => exportRsvpCsv(rsvpModalInv)}
                  style={{
                    marginTop: 16,
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  CSV Olarak İndir
                </button>
              </>
            ) : (
              <p
                style={{
                  color: "#666",
                  fontSize: 14,
                  textAlign: "center",
                  padding: 32,
                }}
              >
                Henüz katılım bildirimi yok 💌
              </p>
            )}

            <button
              type="button"
              onClick={() => setRsvpModalInv(null)}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalInv && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShareModalInv(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              maxWidth: 400,
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 16px",
              }}
            >
              Paylaş
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 12,
                wordBreak: "break-all",
              }}
            >
              {fullUrl(shareModalInv)}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(fullUrl(shareModalInv));
                showToast("Link kopyalandı!");
              }}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                fontSize: 14,
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              📋 Linki Kopyala
            </button>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(ogTitle(shareModalInv) + " " + fullUrl(shareModalInv))}`}
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
                }}
              >
                💬 WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(fullUrl(shareModalInv));
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
                  cursor: "pointer",
                }}
              >
                📸 Instagram
              </button>
              <a
                href={`sms:?body=${encodeURIComponent(ogTitle(shareModalInv) + " " + fullUrl(shareModalInv))}`}
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
                }}
              >
                💬 SMS
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(ogTitle(shareModalInv))}&body=${encodeURIComponent(ogTitle(shareModalInv) + "\n\n" + fullUrl(shareModalInv))}`}
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
                }}
              >
                ✉️ E-posta
              </a>
            </div>
            <div ref={qrRef} className="flex justify-center mb-4">
              <QRCodeCanvas value={fullUrl(shareModalInv)} size={180} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={downloadQR}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  background: "#111",
                  color: "white",
                  border: "none",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                QR Kod İndir
              </button>
              <button
                type="button"
                onClick={() => setShareModalInv(null)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  fontSize: 14,
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

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
