"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useWizardStore } from "@/store/wizardStore";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase";
import { generateSlug, formatEventDate, getMusicTrackLabel } from "@/lib/utils";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { getTemplateById, getCategoryConfig } from "@/lib/templateData";
import type { MediaType, AudioType, MusicTrackId, FontFamilyId } from "@/lib/types";

const MEDIA_LABELS: Record<MediaType, string> = {
  image: "Tek Fotoğraf",
  slider: "Fotoğraf Slaytı",
  video: "Video",
};

const AUDIO_LABELS: Record<AudioType, string> = {
  music: "Arka Plan Müziği",
  voice: "Sesli Mesaj",
  none: "Müzik İstemiyorum",
};

const MUSIC_TRACKS = ["romantic-piano", "classical-waltz", "acoustic-guitar", "orchestral", "jazz-lounge"] as const;

const FONT_OPTIONS = [
  { id: "cormorant" as const, label: "Klasik" },
  { id: "inter" as const, label: "Modern" },
  { id: "dancing" as const, label: "Romantik" },
  { id: "playfair" as const, label: "Zarif" },
] as const;

function SectionHeader({
  icon,
  title,
  isOpen,
  onClick,
}: {
  icon: string;
  title: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-left text-base font-medium transition-all ${
        isOpen ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-700"
      }`}
    >
      <span className="flex items-center gap-4">
        <span>{icon}</span>
        {title}
      </span>
      <svg
        className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

const uploadAreaClass =
  "border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50/50 transition-all duration-300";

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-base text-stone-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-stone-900" : "bg-stone-300"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "left-6 translate-x-[-100%]" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export function PreviewStep({ onBack }: { onBack: () => void }) {
  const { formData, updateFormData, invitationId, setInvitationId } = useWizardStore();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("arkaplan");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const template = getTemplateById(formData.templateId);
  const avatar1Ref = useRef<HTMLInputElement>(null);
  const avatar2Ref = useRef<HTMLInputElement>(null);
  const templateBgUrl = template?.bg ?? "";
  const category = template?.category ?? "Düğün";
  const categoryConfig = getCategoryConfig(category);

  const uploadFile = async (file: File, type: "media" | "audio") => {
    const user = auth.currentUser;
    if (!user) {
      setUploadError("Oturum açmanız gerekiyor.");
      return;
    }
    setUploadError(null);
    if (type === "media") {
      setUploading(true);
      setUploadProgress(0);
    } else {
      setAudioUploading(true);
      setAudioProgress(0);
    }
    const storageRef = ref(storage, `${type}/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (type === "media") setUploadProgress(Math.round(progress));
        else setAudioProgress(Math.round(progress));
      },
      (err) => {
        setUploadError(err instanceof Error ? err.message : "Yükleme başarısız.");
        setUploading(false);
        setAudioUploading(false);
        setUploadProgress(null);
        setAudioProgress(null);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        if (type === "media") {
          updateFormData({ mediaUrls: [url], backgroundType: "upload" });
        } else {
          updateFormData({ audioUrl: url });
        }
        setUploading(false);
        setAudioUploading(false);
        setUploadProgress(null);
        setAudioProgress(null);
      }
    );
  };

  const uploadMediaFiles = async (files: File[]) => {
    const user = auth.currentUser;
    if (!user) {
      setUploadError("Oturum açmanız gerekiyor.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    const currentUrls = useWizardStore.getState().formData.mediaUrls ?? [];
    const remaining = Math.max(0, 7 - currentUrls.length);
    const toUpload = Array.from(files).slice(0, remaining);
    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      const storageRef = ref(storage, `media/${user.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const url = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const totalProgress = ((i + progress / 100) / toUpload.length) * 100;
            setUploadProgress(Math.round(totalProgress));
          },
          reject,
          async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
        );
      });
      const latestUrls = useWizardStore.getState().formData.mediaUrls ?? [];
      updateFormData({
        mediaUrls: [...latestUrls, url],
        mediaType: "slider",
        backgroundType: "upload",
      });
    }
    setUploading(false);
    setUploadProgress(null);
  };

  const removeSliderPhoto = (index: number) => {
    const urls = [...(formData.mediaUrls ?? [])];
    urls.splice(index, 1);
    updateFormData({ mediaUrls: urls });
    if (urls.length === 0) updateFormData({ mediaType: "image" });
  };

  const handlePublish = async () => {
    console.log("Publish button clicked");
    setError(null);
    setIsPublishing(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/auth");
        return;
      }

      const slugPart1 =
        formData.wedding_brideName ||
        formData.kina_brideName ||
        formData.babyshower_motherName ||
        formData.cinsiyet_parentNames ||
        formData.sunnet_childName ||
        formData.dogum_childName ||
        formData.mevlut_hostName ||
        formData.toplanti_eventTitle ||
        formData.toplanti_organizationName ||
        formData.acilis_firmaAdi ||
        "davetiye";
      const slugPart2 = formData.wedding_groomName || "";
      const slug = generateSlug(slugPart1, slugPart2);

      const dataToSave = {
        userId: user.uid,
        slug,
        status: "draft",
        isPaid: false,
        templateId: formData.templateId,
        wedding_brideName: formData.wedding_brideName,
        wedding_groomName: formData.wedding_groomName,
        kina_brideName: formData.kina_brideName,
        babyshower_motherName: formData.babyshower_motherName,
        cinsiyet_parentNames: formData.cinsiyet_parentNames,
        sunnet_childName: formData.sunnet_childName,
        sunnet_parentNames: formData.sunnet_parentNames,
        dogum_childName: formData.dogum_childName,
        dogum_age: formData.dogum_age,
        mevlut_hostName: formData.mevlut_hostName,
        mevlut_reason: formData.mevlut_reason,
        toplanti_eventTitle: formData.toplanti_eventTitle,
        toplanti_organizationName: formData.toplanti_organizationName,
        acilis_firmaAdi: formData.acilis_firmaAdi,
        mainTitle: formData.mainTitle,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venueName: formData.venueName,
        venueAddress: formData.venueAddress,
        googleMapsUrl: formData.googleMapsUrl,
        mediaType: formData.mediaType,
        audioType: formData.audioType,
        mediaUrls: formData.mediaUrls,
        audioUrl: formData.audioUrl,
        musicTrack: formData.musicTrack,
        rsvpEnabled: formData.rsvpEnabled,
        backgroundType: formData.backgroundType,
        presetBackground: formData.presetBackground,
        fontFamily: formData.titleFontFamily ?? "cormorant",
        textColor: formData.textColor,
        countdownStyle: formData.countdownStyle,
        fontSizeScale: formData.fontSizeScale,
        titleFontSize: formData.titleFontSize,
        namesFontSize: formData.namesFontSize,
        countdownFontSize: formData.countdownFontSize,
        titleFontFamily: formData.titleFontFamily,
        namesFontFamily: formData.namesFontFamily,
        noteFontFamily: formData.noteFontFamily,
        subtitle: formData.subtitle ?? categoryConfig.defaultSubtitle,
        noteText: formData.noteText ?? categoryConfig.defaultNote,
        showSubtitle: formData.showSubtitle ?? true,
        showDate: formData.showDate ?? true,
        showFamilyNames: formData.showFamilyNames,
        familyNames: formData.familyNames,
        showAvatar: formData.showAvatar,
        avatarUrl1: formData.avatarUrl1,
        avatarUrl2: formData.avatarUrl2,
        avatarShape: formData.avatarShape ?? "circle",
        showCountdown: formData.showCountdown,
        showNote: formData.showNote,
        showVenue: formData.showVenue,
        showReminderButton: formData.showReminderButton,
        showScrollIndicator: formData.showScrollIndicator,
        overlayStrength: formData.overlayStrength ?? template?.overlayStrength ?? "dark",
        viewCount: 0,
        updatedAt: serverTimestamp(),
      };

      let savedId = invitationId ?? null;

      if (invitationId) {
        await updateDoc(doc(db, "invitations", invitationId), dataToSave);
        savedId = invitationId;
      } else {
        const docRef = await addDoc(collection(db, "invitations"), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        savedId = docRef.id;
        setInvitationId(docRef.id);
      }

      if (savedId) {
        router.push(`/payment?id=${savedId}`);
      }
    } catch (err) {
      console.error("Publish error:", err);
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(message);
      alert("Bir hata oluştu: " + message);
    } finally {
      setIsPublishing(false);
    }
  };

  const templateLabel =
    typeof formData.templateId === "number"
      ? getTemplateById(formData.templateId)?.name ?? `Şablon ${formData.templateId}`
      : String(formData.templateId ?? "");

  const previewProps = {
    templateId: formData.templateId,
    wedding_brideName: formData.wedding_brideName,
    wedding_groomName: formData.wedding_groomName,
    kina_brideName: formData.kina_brideName,
    babyshower_motherName: formData.babyshower_motherName,
    cinsiyet_parentNames: formData.cinsiyet_parentNames,
    sunnet_childName: formData.sunnet_childName,
    sunnet_parentNames: formData.sunnet_parentNames,
    dogum_childName: formData.dogum_childName,
    dogum_age: formData.dogum_age,
    mevlut_hostName: formData.mevlut_hostName,
    mevlut_reason: formData.mevlut_reason,
    toplanti_eventTitle: formData.toplanti_eventTitle,
    toplanti_organizationName: formData.toplanti_organizationName,
    acilis_firmaAdi: formData.acilis_firmaAdi,
    mainTitle: formData.mainTitle,
    eventDate: formData.eventDate,
    eventTime: formData.eventTime,
    venueName: formData.venueName,
    venueAddress: formData.venueAddress,
    googleMapsUrl: formData.googleMapsUrl,
    rsvpEnabled: formData.rsvpEnabled,
    mediaUrls: formData.mediaUrls,
    mediaType: formData.mediaType,
    backgroundType: formData.backgroundType,
    presetBackground: formData.presetBackground,
    fontFamily: (formData.titleFontFamily ?? "cormorant") as FontFamilyId,
    textColor: formData.textColor,
    countdownStyle: formData.countdownStyle,
    titleFontSize: formData.titleFontSize,
    namesFontSize: formData.namesFontSize,
    noteFontSize: formData.noteFontSize,
    countdownFontSize: formData.countdownFontSize,
    titleFontFamily: (formData.titleFontFamily ?? "inter") as FontFamilyId,
    namesFontFamily: (formData.namesFontFamily ?? "cormorant") as FontFamilyId,
    noteFontFamily: (formData.noteFontFamily ?? "cormorant") as FontFamilyId,
    subtitle: formData.subtitle ?? categoryConfig.defaultSubtitle,
    noteText: formData.noteText ?? categoryConfig.defaultNote,
    showSubtitle: formData.showSubtitle ?? true,
    showDate: formData.showDate ?? true,
    showFamilyNames: formData.showFamilyNames,
    familyNames: formData.familyNames,
    showAvatar: formData.showAvatar,
    avatarUrl1: formData.avatarUrl1,
    avatarUrl2: formData.avatarUrl2,
    avatarShape: formData.avatarShape ?? "circle",
    showCountdown: formData.showCountdown,
    showNote: formData.showNote,
    showVenue: formData.showVenue,
    showReminderButton: formData.showReminderButton,
    showScrollIndicator: formData.showScrollIndicator,
    overlayStrength: formData.overlayStrength ?? template?.overlayStrength ?? "dark",
  };

  const renderTemplate = () => <TemplateRenderer {...previewProps} />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F4EF]">
      {/* Left panel - phone mockup (lg visible) */}
      <div className="hidden lg:flex lg:w-[45%] items-center justify-center">
        {/* Phone Mockup */}
        <div
          className="rounded-[36px] shadow-2xl overflow-hidden"
          style={{
            width: 280,
            height: 580,
            background: "#111",
            padding: 8,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          }}
        >
          {/* Screen */}
          <div
            className="rounded-[2.25rem] overflow-hidden"
            style={{
              width: 264,
              height: 544,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "390px",
                height: "844px",
                transform: "scale(0.677)",
                transformOrigin: "0 0",
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - 3 layers: header, scroll, sticky bar */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top header (shrink-0) */}
        <div className="shrink-0 px-4 py-4 border-b border-stone-200 bg-[#F7F4EF]">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">Özelleştir</h2>
          <div className="flex justify-between gap-4 text-sm font-medium">
            {["Şablon", "Bilgiler", "Özelleştir", "Yayınla"].map((step, i) => (
              <span key={step} className={i <= 2 ? "text-stone-900" : "text-stone-400"} style={{ flex: 1 }}>
                {step}
              </span>
            ))}
          </div>
          <div className="h-1 mt-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-stone-900 rounded-full" />
          </div>
        </div>

        {/* Middle scroll area (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div>
            <SectionHeader
              icon="🖼️"
              title="Arka Plan"
              isOpen={openSection === "arkaplan"}
              onClick={() => setOpenSection(openSection === "arkaplan" ? null : "arkaplan")}
            />
            {openSection === "arkaplan" && (
              <div className="mt-2 bg-white rounded-xl p-4 border border-stone-100 space-y-6">
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Şablon arka planı</p>
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-stone-200 shrink-0">
                    {templateBgUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={templateBgUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center text-sm text-stone-500">—</div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Görsel ekle</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: "image" as MediaType, label: "Tek Fotoğraf" },
                      { id: "slider" as MediaType, label: "Fotoğraf Slaytı (3-7)" },
                      { id: "video" as MediaType, label: "Video" },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => updateFormData({ mediaType: id })}
                        className={`px-4 py-3 rounded-lg text-base font-medium border transition-all ${
                          formData.mediaType === id ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
            {formData.mediaType === "image" && (
              <div>
                <div onClick={() => document.getElementById("bgImageInput")?.click()} className={uploadAreaClass}>
                  <input id="bgImageInput" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "media"); e.target.value = ""; }} />
                  <p className="text-base text-[#525252]">Fotoğraf yüklemek için tıklayın</p>
                </div>
                {(formData.mediaUrls ?? [])[0] && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[#e5e5e5] max-w-[120px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={(formData.mediaUrls ?? [])[0]} alt="" className="w-full aspect-square object-cover" />
                  </div>
                )}
              </div>
            )}
            {formData.mediaType === "slider" && (
              <div>
                <div onClick={() => document.getElementById("bgSliderInput")?.click()} className={uploadAreaClass}>
                  <input id="bgSliderInput" type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const files = e.target.files; if (files?.length) uploadMediaFiles(Array.from(files)); e.target.value = ""; }} />
                  <p className="text-base text-[#525252]">3-7 fotoğraf yükleyin</p>
                </div>
                {(formData.mediaUrls ?? []).length > 0 && (
                  <div className="flex gap-4 flex-wrap mt-2">
                    {(formData.mediaUrls ?? []).map((url, i) => (
                      <div key={`${url}-${i}`} className="relative group rounded-xl overflow-hidden border border-[#e5e5e5] w-16 h-16 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeSliderPhoto(i)} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-sm leading-none" aria-label="Kaldır">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {formData.mediaType === "video" && (
              <div>
                <div onClick={() => document.getElementById("bgVideoInput")?.click()} className={uploadAreaClass}>
                  <input id="bgVideoInput" type="file" accept="video/mp4" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "media"); e.target.value = ""; }} />
                  <p className="text-base text-[#525252]">MP4 video yükleyin (max 50MB)</p>
                </div>
                {(formData.mediaUrls ?? [])[0] && <p className="text-sm text-[#737373] mt-2">Video yüklendi ✓</p>}
              </div>
            )}
            {(uploadProgress !== null || uploading) && (
              <div className="h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#171717] transition-all" style={{ width: `${uploadProgress ?? 0}%` }} />
              </div>
            )}
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Ses</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: "music" as AudioType, label: "Arka Plan Müziği" },
                      { id: "voice" as AudioType, label: "Sesli Mesaj" },
                      { id: "none" as AudioType, label: "Müzik İstemiyorum" },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => updateFormData({ audioType: id })}
                        className={`px-4 py-3 rounded-lg text-base font-medium border transition-all ${
                          formData.audioType === id ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {formData.audioType === "music" && (
                    <select
                      value={formData.musicTrack}
                      onChange={(e) => updateFormData({ musicTrack: e.target.value as MusicTrackId })}
                      className="mt-2 w-full border border-stone-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900"
                    >
                      {MUSIC_TRACKS.map((t) => (
                        <option key={t} value={t}>{getMusicTrackLabel(t)}</option>
                      ))}
                    </select>
                  )}
                  {formData.audioType === "voice" && (
                    <div className="mt-3">
                      <div onClick={() => document.getElementById("bgAudioInput")?.click()} className={uploadAreaClass}>
                        <input id="bgAudioInput" type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "audio"); e.target.value = ""; }} />
                        <p className="text-base text-stone-600">Ses dosyası yükle</p>
                      </div>
                      {formData.audioUrl && <p className="text-sm text-stone-500 mt-2">Ses yüklendi ✓</p>}
                      {(audioProgress !== null || audioUploading) && (
                        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-stone-900 transition-all" style={{ width: `${audioProgress ?? 0}%` }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
            {uploadError && <p className="text-base text-red-600/90">{uploadError}</p>}
                {formData.mediaType === "slider" && (formData.mediaUrls ?? []).length > 0 && (formData.mediaUrls ?? []).length < 3 && (
                  <p className="text-base text-amber-600">⚠ Slayt için en az 3 fotoğraf yükleyin</p>
                )}
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Overlay Yoğunluğu</p>
                  <div className="flex flex-wrap gap-4">
                    {(["light", "medium", "dark"] as const).map((level) => {
                      const effectiveOverlay = formData.overlayStrength ?? template?.overlayStrength ?? "dark";
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateFormData({ overlayStrength: level })}
                          className={`px-4 py-3 rounded-lg text-base font-medium border transition-all ${
                            effectiveOverlay === level ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          {level === "light" ? "Açık" : level === "medium" ? "Orta" : "Koyu"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              icon="✏️"
              title="Metinleri Düzenle"
              isOpen={openSection === "texts"}
              onClick={() => setOpenSection(openSection === "texts" ? null : "texts")}
            />
            {openSection === "texts" && (
              <div className="mt-2 bg-white rounded-xl p-4 border border-stone-100 space-y-4">
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Ana Başlık</p>
                  <input
                    type="text"
                    value={formData.mainTitle ?? categoryConfig.getMainTitle(formData as unknown as Record<string, string | undefined>) ?? ""}
                    onChange={(e) => updateFormData({ mainTitle: e.target.value })}
                    placeholder={categoryConfig.getMainTitle(formData as unknown as Record<string, string | undefined>) ?? ""}
                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900"
                  />
                </div>
                <div>
                  <Toggle
                    label="Üst Başlık"
                    value={formData.showSubtitle !== false}
                    onChange={(v) => updateFormData({ showSubtitle: v })}
                  />
                  {formData.showSubtitle !== false && (
                    <input
                      type="text"
                      value={formData.subtitle ?? categoryConfig.defaultSubtitle}
                      onChange={(e) => updateFormData({ subtitle: e.target.value })}
                      placeholder={categoryConfig.defaultSubtitle}
                      className="mt-2 w-full border border-stone-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900"
                    />
                  )}
                </div>
                {categoryConfig.defaultNote !== "" && (
                  <div>
                    <p className="text-base font-medium text-stone-700 mb-2">Davetiye Notu</p>
                    <textarea
                      value={formData.noteText ?? categoryConfig.defaultNote}
                      onChange={(e) => updateFormData({ noteText: e.target.value })}
                      placeholder={categoryConfig.defaultNote}
                      rows={3}
                      className="w-full border border-stone-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 resize-none"
                    />
                  </div>
                )}
                {category === "Mevlüt" && (
                  <div>
                    <p className="text-base font-medium text-stone-700 mb-2">Mevlüt Sebebi</p>
                    <textarea
                      value={formData.mevlut_reason ?? ""}
                      onChange={(e) => updateFormData({ mevlut_reason: e.target.value })}
                      placeholder="Hayırlı olsun, şükran..."
                      rows={2}
                      className="w-full border border-stone-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              icon="🎨"
              title="Yazı & Renk & Boyutlar"
              isOpen={openSection === "yazi"}
              onClick={() => setOpenSection(openSection === "yazi" ? null : "yazi")}
            />
            {openSection === "yazi" && (
              <div className="mt-2 bg-white rounded-xl p-4 border border-stone-100 space-y-6">
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Yazı Tipleri</p>
                  {(
                    [
                      { label: "Başlık", key: "titleFontFamily" as const },
                      { label: "İsimler", key: "namesFontFamily" as const },
                      { label: "Davetiye Notu", key: "noteFontFamily" as const },
                    ] as const
                  ).map(({ label, key }) => {
                    const val = formData[key] ?? (key === "titleFontFamily" ? "inter" : "cormorant");
                    return (
                      <div key={key} className="mb-3">
                        <p className="text-sm text-stone-500 mb-1">{label}</p>
                        <div className="flex flex-wrap gap-4">
                          {FONT_OPTIONS.map(({ id, label: l }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => updateFormData({ [key]: id })}
                              className={`px-4 py-3 rounded-lg text-base font-medium border transition-all ${
                                val === id ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Metin Rengi</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    {["#FFFFFF", "#FAF7F2", "#C9A96E", "#E8B4B8", "#1a1a1a"].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => updateFormData({ textColor: hex })}
                        className={`w-10 h-10 rounded-full border-2 shrink-0 transition-transform ${
                          formData.textColor === hex ? "ring-2 ring-offset-2 ring-stone-900 scale-110" : "border-stone-200"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                    <label className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-200 cursor-pointer shrink-0 flex items-center justify-center text-stone-400 hover:border-stone-400">
                      <span className="text-lg">+</span>
                      <input
                        type="color"
                        value={typeof formData.textColor === "string" && formData.textColor.startsWith("#") ? formData.textColor : "#ffffff"}
                        onChange={(e) => updateFormData({ textColor: e.target.value })}
                        className="absolute w-0 h-0 opacity-0"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium text-stone-700 mb-2">Font Boyutları</p>
                  <div className="space-y-3">
                    {[
                      { label: "Başlık", key: "titleFontSize" as const, value: formData.titleFontSize ?? 12, min: 8, max: 72 },
                      { label: "İsimler", key: "namesFontSize" as const, value: formData.namesFontSize ?? 38, min: 20, max: 56 },
                      { label: "Geri Sayım", key: "countdownFontSize" as const, value: formData.countdownFontSize ?? 24, min: 12, max: 36 },
                      { label: "Davetiye Notu", key: "noteFontSize" as const, value: formData.noteFontSize ?? 13, min: 10, max: 22 },
                    ].map(({ label, key, value, min, max }) => (
                      <div key={key} className="flex items-center gap-4 py-3">
                        <span className="text-base text-stone-700 w-24 shrink-0">{label}</span>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={value}
                          onChange={(e) =>
                            updateFormData({
                              [key]: key === "noteFontSize" ? Number(e.target.value) : parseInt(e.target.value, 10),
                            })
                          }
                          className="flex-1 h-2 rounded-lg accent-stone-900"
                        />
                        <span className="text-base font-medium text-stone-700 w-10">{value}px</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              icon="👨‍👩‍👧"
              title="Aile İsimleri"
              isOpen={openSection === "family"}
              onClick={() => setOpenSection(openSection === "family" ? null : "family")}
            />
            {openSection === "family" && (
              <div className="mt-2 bg-white rounded-xl p-4 border border-stone-100 space-y-4">
                <Toggle
                  label="Aile isimlerini göster"
                  value={!!formData.showFamilyNames}
                  onChange={(v) => updateFormData({ showFamilyNames: v })}
                />
                {formData.showFamilyNames && (
                  <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "brideMotherName" as const, placeholder: "Gelin Ailesi - Anne" },
                  { key: "brideFatherName" as const, placeholder: "Gelin Ailesi - Baba" },
                  { key: "groomMotherName" as const, placeholder: "Damat Ailesi - Anne" },
                  { key: "groomFatherName" as const, placeholder: "Damat Ailesi - Baba" },
                  { key: "brideFamilySurname" as const, placeholder: "Gelin Ailesi Soyadı" },
                  { key: "groomFamilySurname" as const, placeholder: "Damat Ailesi Soyadı" },
                ].map(({ key, placeholder }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={placeholder}
                    value={formData.familyNames?.[key] ?? ""}
                    onChange={(e) =>
                      updateFormData({
                        familyNames: {
                          brideMotherName: "",
                          brideFatherName: "",
                          groomMotherName: "",
                          groomFatherName: "",
                          brideFamilySurname: "",
                          groomFamilySurname: "",
                          ...(formData.familyNames ?? {}),
                          [key]: e.target.value,
                        },
                      })
                    }
                    className="col-span-1 border border-stone-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900"
                  />
                ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              icon="⏱️"
              title="Geri Sayım"
              isOpen={openSection === "countdown"}
              onClick={() => setOpenSection(openSection === "countdown" ? null : "countdown")}
            />
            {openSection === "countdown" && (
              <div className="mt-2 bg-white rounded-xl p-4 border border-stone-100 space-y-4">
                <Toggle
                  label="Geri sayımı göster"
                  value={formData.showCountdown !== false}
                  onChange={(v) => updateFormData({ showCountdown: v })}
                />
                {formData.showCountdown !== false && (
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: "classic" as const, label: "Klasik" },
                      { id: "modern" as const, label: "Modern" },
                      { id: "minimal" as const, label: "Minimal" },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => updateFormData({ countdownStyle: id })}
                        className={`px-4 py-3 rounded-lg text-base font-medium border transition-all ${
                          formData.countdownStyle === id ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              icon="🎛️"
              title="Elementleri Düzenle"
              isOpen={openSection === "elements"}
              onClick={() => setOpenSection(openSection === "elements" ? null : "elements")}
            />
            {openSection === "elements" && (
              <div className="mt-2 bg-white rounded-xl p-4 border border-stone-100">
            {categoryConfig.templateElements?.includes("subtitle") && (
              <Toggle
                label="📝 Üst Başlık"
                value={formData.showSubtitle !== false}
                onChange={(v) => updateFormData({ showSubtitle: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("avatar") && (
              <Toggle
                label="👤 Profil Fotoğrafı"
                value={formData.showAvatar === true}
                onChange={(v) => updateFormData({ showAvatar: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("note") && (
              <Toggle
                label="💬 Davetiye Notu"
                value={formData.showNote !== false}
                onChange={(v) => updateFormData({ showNote: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("date") && (
              <Toggle
                label="📅 Tarih"
                value={formData.showDate !== false}
                onChange={(v) => updateFormData({ showDate: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("venue") && (
              <Toggle
                label="📍 Mekan Bilgisi"
                value={formData.showVenue !== false}
                onChange={(v) => updateFormData({ showVenue: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("countdown") && (
              <Toggle
                label="⏱ Geri Sayım"
                value={formData.showCountdown !== false}
                onChange={(v) => updateFormData({ showCountdown: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("reminderBtn") && (
              <Toggle
                label="🔔 Hatırlatıcı Butonu"
                value={formData.showReminderButton !== false}
                onChange={(v) => updateFormData({ showReminderButton: v })}
              />
            )}
            {categoryConfig.templateElements?.includes("scrollIndicator") && (
              <Toggle
                label="↓ Kaydırma İkonu"
                value={formData.showScrollIndicator !== false}
                onChange={(v) => updateFormData({ showScrollIndicator: v })}
              />
            )}
            {formData.showAvatar && (
              <div style={{ marginTop: 12, padding: 16, background: "#f9f9f9", borderRadius: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Gelin Fotoğrafı</p>
                <div
                  onClick={() => avatar1Ref.current?.click()}
                  style={{
                    border: "2px dashed #ddd",
                    borderRadius: 10,
                    padding: 20,
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: 12,
                    background: "white",
                  }}
                >
                  {formData.avatarUrl1 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={formData.avatarUrl1}
                      alt=""
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover",
                        margin: "0 auto",
                        display: "block",
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 28 }}>📷</div>
                      <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Tıkla veya sürükle</p>
                    </>
                  )}
                </div>
                <input
                  ref={avatar1Ref}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const { getStorage, ref: storageRefFn, uploadBytes: uploadBytesFn, getDownloadURL: getDownloadURLFn } = await import("firebase/storage");
                      const storageInstance = getStorage();
                      const user = auth.currentUser;
                      if (!user) return;
                      const storageRef = storageRefFn(storageInstance, `avatars/${user.uid}/${Date.now()}_avatar1`);
                      await uploadBytesFn(storageRef, file);
                      const url = await getDownloadURLFn(storageRef);
                      updateFormData({ avatarUrl1: url });
                    } catch (err) {
                      console.error("Avatar upload error:", err);
                    }
                    e.target.value = "";
                  }}
                />
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Damat Fotoğrafı</p>
                <div
                  onClick={() => avatar2Ref.current?.click()}
                  style={{
                    border: "2px dashed #ddd",
                    borderRadius: 10,
                    padding: 20,
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: 12,
                    background: "white",
                  }}
                >
                  {formData.avatarUrl2 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={formData.avatarUrl2}
                      alt=""
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover",
                        margin: "0 auto",
                        display: "block",
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 28 }}>📷</div>
                      <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Tıkla veya sürükle</p>
                    </>
                  )}
                </div>
                <input
                  ref={avatar2Ref}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const { getStorage, ref: storageRefFn, uploadBytes: uploadBytesFn, getDownloadURL: getDownloadURLFn } = await import("firebase/storage");
                      const storageInstance = getStorage();
                      const user = auth.currentUser;
                      if (!user) return;
                      const storageRef = storageRefFn(storageInstance, `avatars/${user.uid}/${Date.now()}_avatar2`);
                      await uploadBytesFn(storageRef, file);
                      const url = await getDownloadURLFn(storageRef);
                      updateFormData({ avatarUrl2: url });
                    } catch (err) {
                      console.error("Avatar upload error:", err);
                    }
                    e.target.value = "";
                  }}
                />
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Fotoğraf Şekli</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { value: "circle", label: "⬤ Yuvarlak" },
                    { value: "rounded", label: "▣ Yuvarlatılmış" },
                    { value: "square", label: "■ Kare" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => updateFormData({ avatarShape: s.value as "circle" | "square" | "rounded" })}
                      style={{
                        flex: 1,
                        padding: "8px 4px",
                        borderRadius: 8,
                        fontSize: 12,
                        border: formData.avatarShape === s.value ? "2px solid #111" : "1px solid #ddd",
                        background: formData.avatarShape === s.value ? "#111" : "white",
                        color: formData.avatarShape === s.value ? "white" : "#111",
                        cursor: "pointer",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
              </div>
            )}
          </div>

            {/* Özet Kartı */}
          <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
            <div className="space-y-3 text-base">
            <SummaryRow label="Şablon" value={templateLabel} />
            <SummaryRow
              label="Ana Başlık"
              value={
                categoryConfig.getMainTitle({
                  wedding_brideName: formData.wedding_brideName,
                  wedding_groomName: formData.wedding_groomName,
                  kina_brideName: formData.kina_brideName,
                  babyshower_motherName: formData.babyshower_motherName,
                  cinsiyet_parentNames: formData.cinsiyet_parentNames,
                  sunnet_childName: formData.sunnet_childName,
                  sunnet_parentNames: formData.sunnet_parentNames,
                  dogum_childName: formData.dogum_childName,
                  dogum_age: formData.dogum_age,
                  mevlut_hostName: formData.mevlut_hostName,
                  toplanti_eventTitle: formData.toplanti_eventTitle,
                  toplanti_organizationName: formData.toplanti_organizationName,
                  acilis_firmaAdi: formData.acilis_firmaAdi,
                }) || "-"
              }
            />
            <SummaryRow
              label="Tarih"
              value={
                formData.eventDate
                  ? `${formatEventDate(formData.eventDate)}, ${formData.eventTime}`
                  : "-"
              }
            />
            <SummaryRow label="Mekan" value={formData.venueName || "-"} />
            <SummaryRow label="Medya" value={MEDIA_LABELS[formData.mediaType ?? "image"]} />
            <SummaryRow
              label="Ses"
              value={
                formData.audioType === "music"
                  ? getMusicTrackLabel(formData.musicTrack ?? "romantic-piano")
                  : AUDIO_LABELS[formData.audioType ?? "none"]
              }
            />
          </div>
            <div className="mt-4 pt-4 border-t border-stone-100">
              <Toggle
                label="RSVP Formu Aktif"
                value={!!formData.rsvpEnabled}
                onChange={(v) => updateFormData({ rsvpEnabled: v })}
              />
            </div>
          </div>

          <div className="h-6" />
        </div>

        {/* Bottom sticky bar (shrink-0) - OUTSIDE scroll */}
        <div className="shrink-0 px-6 py-4 bg-[#F7F4EF] border-t border-stone-100">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3.5 rounded-xl border border-stone-200 text-stone-500 text-base font-medium hover:bg-stone-100 hover:border-stone-300 transition-all whitespace-nowrap"
            >
              ← Geri
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 py-3.5 rounded-xl bg-stone-900 text-white text-base font-semibold hover:bg-stone-800 active:scale-[0.99] transition-all shadow-lg tracking-wide disabled:opacity-70"
            >
              {isPublishing ? "Yayınlanıyor..." : "Davetiyemi Yayınla →"}
            </button>
          </div>
          <p className="text-center text-sm text-stone-400 mt-2 pb-1">
            Yayınladıktan sonra da değişiklik yapabilirsiniz
          </p>
          {error && <p className="text-center text-base text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-stone-500 shrink-0">{label}</span>
      <span className="text-stone-800 text-right truncate">{value}</span>
    </div>
  );
}
