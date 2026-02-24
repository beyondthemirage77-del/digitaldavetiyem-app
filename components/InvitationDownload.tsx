"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getTemplateById } from "@/lib/templateData";
import type { TemplateRendererProps } from "@/components/templates/TemplateRenderer";
import type { PresetBackgroundId } from "@/lib/types";

const proxyUrl = (url: string) =>
  `/api/proxy-image?url=${encodeURIComponent(url)}`;

interface Props {
  invitationId: string;
  /** Optional: pass if already available to avoid extra fetch */
  invitation?: Record<string, unknown>;
}

function buildRendererProps(data: Record<string, unknown>): TemplateRendererProps {
  const get = (k: string) => data[k];
  const str = (k: string) => (get(k) != null ? String(get(k)) : undefined);
  return {
    templateId: (get("templateId") as number) ?? 1,
    variant: "preview",
    wedding_brideName: str("wedding_brideName") ?? str("brideName"),
    wedding_groomName: str("wedding_groomName") ?? str("groomName"),
    kina_brideName: str("kina_brideName") ?? str("brideName"),
    babyshower_motherName: str("babyshower_motherName") ?? str("motherName"),
    cinsiyet_parentNames: str("cinsiyet_parentNames") ?? str("parentNames"),
    sunnet_childName: str("sunnet_childName") ?? str("childName"),
    sunnet_parentNames: str("sunnet_parentNames"),
    dogum_childName: str("dogum_childName") ?? str("childName"),
    dogum_age: str("dogum_age") ?? str("age"),
    mevlut_hostName: str("mevlut_hostName") ?? str("hostName"),
    mevlut_reason: str("mevlut_reason") ?? str("mevlutReason"),
    toplanti_eventTitle: str("toplanti_eventTitle") ?? str("eventTitle"),
    toplanti_organizationName:
      str("toplanti_organizationName") ?? str("organizationName"),
    acilis_firmaAdi: str("acilis_firmaAdi"),
    mainTitle: str("mainTitle"),
    brideName: str("brideName"),
    groomName: str("groomName"),
    eventDate: str("eventDate") ?? "",
    eventTime: str("eventTime") ?? "",
    venueName: str("venueName") ?? "",
    venueAddress: str("venueAddress") ?? "",
    googleMapsUrl: str("googleMapsUrl") ?? "",
    mediaUrls: (get("mediaUrls") as string[] | undefined) ?? [],
    mediaType: (get("mediaType") as "image" | "slider" | "video") ?? "image",
    backgroundType: (get("backgroundType") as "upload" | "preset") ?? "upload",
    presetBackground: (get("presetBackground") as PresetBackgroundId) ?? "cream",
    fontFamily:
      (get("fontFamily") as TemplateRendererProps["fontFamily"]) ?? "cormorant",
    textColor: str("textColor") ?? "#FFFFFF",
    countdownStyle:
      (get("countdownStyle") as TemplateRendererProps["countdownStyle"]) ??
      "classic",
    fontSizeScale: (get("fontSizeScale") as number) ?? 1.0,
    titleFontSize: (get("titleFontSize") as number) ?? 12,
    namesFontSize: (get("namesFontSize") as number) ?? 38,
    countdownFontSize: (get("countdownFontSize") as number) ?? 24,
    titleFontFamily:
      (get("titleFontFamily") as TemplateRendererProps["titleFontFamily"]) ??
      "cormorant",
    namesFontFamily:
      (get("namesFontFamily") as TemplateRendererProps["namesFontFamily"]) ??
      "cormorant",
    noteFontFamily:
      (get("noteFontFamily") as TemplateRendererProps["noteFontFamily"]) ??
      "cormorant",
    subtitle:
      str("subtitle") ?? str("titleText") ?? "Nikahımıza Davetlisiniz",
    noteText:
      str("noteText") ?? "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
    showFamilyNames: Boolean(get("showFamilyNames")),
    familyNames: get("familyNames") as TemplateRendererProps["familyNames"],
    showAvatar: get("showAvatar") as boolean | undefined,
    avatarUrl1: str("avatarUrl1"),
    avatarUrl2: str("avatarUrl2"),
    avatarShape: get("avatarShape") as
      | "circle"
      | "square"
      | "rounded"
      | undefined,
    showCountdown: false,
    showNote: (get("showNote") as boolean | undefined) ?? true,
    showVenue: true,
    showReminderButton: false,
    showScrollIndicator: false,
    showSubtitle: (get("showSubtitle") as boolean | undefined) ?? true,
    showDate: true,
    overlayStrength: get("overlayStrength") as
      | "light"
      | "medium"
      | "dark"
      | undefined,
    _blobBgUrl: get("_blobBgUrl") as string | undefined,
  };
}

export default function InvitationDownload({
  invitationId,
  invitation: invitationProp,
}: Props) {
  const [loading, setLoading] = useState<"pdf" | "png" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [captureData, setCaptureData] = useState<{
    formData: Record<string, unknown>;
    type: "png" | "pdf";
    resolve: (canvas: HTMLCanvasElement) => void;
  } | null>(null);

  useEffect(() => {
    if (!captureData || !previewRef.current) return;

    const runCapture = async () => {
      try {
        const container = previewRef.current;
        if (!container) return;

        const images = container.querySelectorAll("img");
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                  return;
                }
                img.onload = () => resolve();
                img.onerror = () => resolve();
                setTimeout(resolve, 3000);
              })
          )
        );

        await new Promise((r) => setTimeout(r, 1000));

        const canvas = await html2canvas(container, {
          width: 390,
          height: 844,
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
        });

        captureData.resolve(canvas);
      } catch (err) {
        console.error("Capture error:", err);
        captureData.resolve(document.createElement("canvas"));
      } finally {
        setCaptureData(null);
      }
    };

    runCapture();
  }, [captureData]);

  const downloadPNG = async () => {
    setLoading("png");
    try {
      let data: Record<string, unknown>;
      if (db) {
        const ref = doc(db, "invitations", invitationId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Davetiye bulunamadı");
        data = { id: snap.id, ...snap.data() };
      } else if (invitationProp) {
        data = { ...invitationProp, id: invitationId };
      } else {
        throw new Error("Veri yüklenemedi");
      }

      const tmpl = getTemplateById((data.templateId as number) ?? 1);
      const bgUrl = tmpl?.bg ?? null;

      const downloadFormData = {
        ...data,
        showCountdown: false,
        showScrollIndicator: false,
        showReminderButton: false,
        showVenue: true,
        showDate: true,
        bgKey: (data.bgKey as string) || tmpl?.bgKey,
        _blobBgUrl: bgUrl ? proxyUrl(bgUrl) : undefined,
      };

      const canvas = await new Promise<HTMLCanvasElement>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Yükleme zaman aşımına uğradı")),
          20000
        );
        setCaptureData({
          formData: downloadFormData,
          type: "png",
          resolve: (c) => {
            clearTimeout(timeout);
            resolve(c);
          },
        });
      });

      const link = document.createElement("a");
      link.download = `davetiye-${invitationId}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      console.error("PNG download error:", err);
      alert(
        "PNG indirme hatası: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(null);
    }
  };

  const downloadPDF = async () => {
    setLoading("pdf");
    try {
      let data: Record<string, unknown>;
      if (db) {
        const ref = doc(db, "invitations", invitationId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Davetiye bulunamadı");
        data = { id: snap.id, ...snap.data() };
      } else if (invitationProp) {
        data = { ...invitationProp, id: invitationId };
      } else {
        throw new Error("Veri yüklenemedi");
      }

      const tmpl = getTemplateById((data.templateId as number) ?? 1);
      const bgUrl = tmpl?.bg ?? null;

      const downloadFormData = {
        ...data,
        showCountdown: false,
        showScrollIndicator: false,
        showReminderButton: false,
        showVenue: true,
        showDate: true,
        bgKey: (data.bgKey as string) || tmpl?.bgKey,
        _blobBgUrl: bgUrl ? proxyUrl(bgUrl) : undefined,
      };

      const canvas = await new Promise<HTMLCanvasElement>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Yükleme zaman aşımına uğradı")),
          20000
        );
        setCaptureData({
          formData: downloadFormData,
          type: "pdf",
          resolve: (c) => {
            clearTimeout(timeout);
            resolve(c);
          },
        });
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = 210;
      const pageHeight = 297;
      const invWidth = 90;
      const invHeight = 90 * (844 / 390);
      const x = (pageWidth - invWidth) / 2;
      const y = (pageHeight - invHeight) / 2;
      pdf.addImage(imgData, "PNG", x, y, invWidth, invHeight);
      pdf.save(`davetiye-${invitationId}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert(
        "PDF indirme hatası: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(null);
    }
  };

  const rendererProps = captureData
    ? buildRendererProps(captureData.formData)
    : null;

  return (
    <>
      {captureData && (
        <div
          ref={previewRef}
          style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "390px",
            height: "844px",
            overflow: "hidden",
            zIndex: -1,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {rendererProps && <TemplateRenderer {...rendererProps} />}
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={downloadPNG}
          disabled={loading !== null}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "white",
            fontSize: 12,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {loading === "png" ? "⏳" : "🖼️"} PNG
        </button>
        <button
          type="button"
          onClick={downloadPDF}
          disabled={loading !== null}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "white",
            fontSize: 12,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {loading === "pdf" ? "⏳" : "📄"} PDF
        </button>
      </div>
    </>
  );
}
