"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { EventDetailsSection, RSVPSection } from "@/components/templates/layouts/LayoutShared";

const W = 360;
const H = 640;
const DURATION = 20;

type Scene = "hook" | "problem" | "solution" | "proof" | "whatsapp" | "cta";

const SCENE_TIMING: { scene: Scene; start: number; end: number }[] = [
  { scene: "hook", start: 0, end: 3 },
  { scene: "problem", start: 3, end: 6.5 },
  { scene: "solution", start: 6.5, end: 10 },
  { scene: "proof", start: 10, end: 14 },
  { scene: "whatsapp", start: 14, end: 17 },
  { scene: "cta", start: 17, end: DURATION },
];

export default function ReelsDemoPage() {
  const [currentScene, setCurrentScene] = useState<Scene>("hook");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const restart = useCallback(() => {
    setCurrentScene("hook");
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const t = (now - startRef.current) / 1000;
      if (t >= DURATION) {
        setCurrentScene("cta");
        setIsPlaying(false);
        return;
      }
      const active = SCENE_TIMING.find((s) => t >= s.start && t < s.end);
      if (active) setCurrentScene(active.scene);
      rafRef.current = requestAnimationFrame(tick);
    };
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const handleRecord = useCallback(async () => {
    try {
      setRecordingStatus("Tab seçin...");
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: 1080 }, height: { ideal: 1920 }, frameRate: { ideal: 30 } },
        audio: false,
      });
      streamRef.current = displayStream;
      displayStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      });

      setRecordingStatus("Kayıt başladı (20 sn)...");
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4";
      const recorder = new MediaRecorder(displayStream, {
        mimeType: mime,
        videoBitsPerSecond: 8_000_000,
      });
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const ext = mime.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `davetiye-reels-${Date.now()}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        setRecordingStatus("");
        setIsRecording(false);
      };
      recorder.start(1000);
      setIsRecording(true);
      setTimeout(() => {
        if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      }, DURATION * 1000);
    } catch (err) {
      setRecordingStatus(err instanceof Error ? err.message : "Kayıt başarısız");
      setIsRecording(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 gap-6">
      <div
        ref={containerRef}
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: W, height: H }}
      >
        <div
          ref={scrollRef}
          className="w-full h-full overflow-hidden relative bg-black"
          style={{ width: W, height: H }}
        >
          <AnimatePresence mode="wait">
            {currentScene === "hook" && (
              <motion.div
                key="hook"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-950 to-amber-950"
              >
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-center text-white font-bold text-2xl px-6"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                >
                  Davetiye ulaşmadı mı? 😤
                </motion.p>
              </motion.div>
            )}

            {currentScene === "problem" && (
              <motion.div
                key="problem"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
              >
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-center text-white font-medium text-lg px-6 leading-relaxed"
                >
                  Kağıt davetiyeler kaybolur, geç gelir, hatta hiç ulaşmaz...
                </motion.p>
              </motion.div>
            )}

            {currentScene === "solution" && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 overflow-hidden"
              >
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: 0 }}
                  className="w-full h-full overflow-y-auto overscroll-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div style={{ transform: `scale(${W / 390})`, transformOrigin: "top center" }}>
                    <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <TemplateRenderer
                      variant="live"
                      templateId={3}
                      wedding_brideName="Zişan"
                      wedding_groomName="Muhammed"
                      eventDate="2026-10-10"
                      eventTime="18:00"
                      venueName="Bebek Otel"
                      venueAddress="Beşiktaş, İstanbul"
                      googleMapsUrl=""
                      rsvpEnabled={true}
                      brideName="Zişan"
                      groomName="Muhammed"
                      eventTitle="Nikah"
                      mainTitle="Zişan & Muhammed"
                      titleText="Zişan & Muhammed"
                      noteText="Bu mutlu günümüzü sizinle paylaşmak istiyoruz"
                      showSubtitle={true}
                      showDate={true}
                    />
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-0 right-0 text-center"
                >
                  <span className="inline-block px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium">
                    Dijital davetiye anında ulaşır ✉️
                  </span>
                </motion.div>
              </motion.div>
            )}

            {currentScene === "proof" && (
              <motion.div
                key="proof"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 overflow-hidden"
              >
                <motion.div
                  animate={{ y: [0, -400, -850, -1250] }}
                  transition={{
                    duration: 3.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    times: [0, 0.2, 0.5, 1],
                  }}
                  className="flex flex-col"
                >
                  <div style={{ width: 390, transform: `scale(${W / 390})`, transformOrigin: "top center" }}>
                    <TemplateRenderer
                      variant="live"
                      templateId={3}
                      wedding_brideName="Zişan"
                      wedding_groomName="Muhammed"
                      eventDate="2026-10-10"
                      eventTime="18:00"
                      venueName="Bebek Otel"
                      venueAddress="Beşiktaş, İstanbul"
                      rsvpEnabled={true}
                      brideName="Zişan"
                      groomName="Muhammed"
                      eventTitle="Nikah"
                      mainTitle="Zişan & Muhammed"
                      titleText="Zişan & Muhammed"
                      noteText="Bu mutlu günümüzü sizinle paylaşmak istiyoruz"
                      showSubtitle={true}
                      showDate={true}
                    />
                  </div>
                  <div style={{ width: 390, transform: `scale(${W / 390})`, transformOrigin: "top center" }} className="flex-shrink-0">
                    <EventDetailsSection
                      eventDate="2026-10-10"
                      eventTime="18:00"
                      venueName="Bebek Otel"
                      venueAddress="Beşiktaş, İstanbul"
                    />
                  </div>
                  <div style={{ width: 390, transform: `scale(${W / 390})`, transformOrigin: "top center" }} className="flex-shrink-0">
                    <RSVPSection />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {currentScene === "whatsapp" && (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col bg-[#e5ddd5]"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                <div className="flex items-center justify-between px-4 py-1.5 bg-[#075e54] text-white">
                  <span className="text-[10px] font-medium">9:41</span>
                  <div className="flex gap-0.5">
                    <span className="text-[10px]">📶</span>
                    <span className="text-[10px]">🔋</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#075e54]">
                  <div className="w-6 h-6 rounded-full bg-white/20" />
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-white">Davetiye Grubu</p>
                    <p className="text-[8px] text-white/80">Çevrimiçi</p>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-3 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-lg px-3 py-2" style={{ background: "#d9fdd3", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      <div className="rounded-lg overflow-hidden border border-[#e0e0e0] bg-white mb-1">
                        <div className="relative w-full" style={{ aspectRatio: "9/16", minHeight: 120 }}>
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#5c2d2d] to-[#3d1a1a] text-white px-4 py-2">
                            <p className="text-[8px] uppercase tracking-widest opacity-90">Zişan & Muhammed</p>
                            <p className="text-[12px] font-bold mt-1">Zişan & Muhammed</p>
                            <p className="text-[7px] mt-1 opacity-90">10 Ekim 2026 · Bebek Otel</p>
                            <p className="text-[6px] mt-0.5 opacity-70">Beşiktaş, İstanbul</p>
                          </div>
                        </div>
                        <p className="text-[7px] text-[#666] px-2 py-1 text-center">digitaldavetiyem.com/zisan-muhammed</p>
                      </div>
                      <p className="text-[8px] text-[#667781]">9:42</p>
                    </div>
                  </motion.div>
                  <div className="flex justify-end mt-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366]">
                      <span className="text-[10px]">📤</span>
                      <span className="text-[9px] font-medium text-white">WhatsApp&apos;ta Paylaş</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentScene === "cta" && (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 to-rose-900"
              >
                <motion.p
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-white font-bold text-xl text-center px-6 mb-4"
                >
                  Fiziksel davetiye sorununa son! 🎉
                </motion.p>
                <motion.a
                  href="https://digitaldavetiyem.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: 0.4 }}
                  className="px-8 py-4 rounded-2xl bg-white text-[#171717] font-bold text-lg shadow-xl"
                >
                  digitaldavetiyem.com
                </motion.a>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/90 text-sm mt-3"
                >
                  Hemen oluştur ✨
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={restart}
          className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20"
        >
          Yeniden Oynat
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRecord}
          disabled={isRecording}
          className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] disabled:opacity-70"
        >
          {isRecording ? "Kaydediliyor..." : "Kaydet (20 sn)"}
        </motion.button>
      </div>
      {recordingStatus && (
        <p className="text-sm text-white/70 max-w-xs text-center">{recordingStatus}</p>
      )}
      <p className="text-xs text-white/50 text-center max-w-sm">
        9:16 Reels formatında. Kaydet için butona tıkla, tarayıcıda &quot;Bu sekme&quot;yi seç. 20 sn sonra otomatik indirilir.
      </p>
    </div>
  );
}
