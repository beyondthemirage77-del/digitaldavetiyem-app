"use client";

export function VideoPlayer({ src }: { src: string }) {
  if (!src) return null;
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <video
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        playsInline
        muted
        loop
        autoPlay
      />
    </div>
  );
}
