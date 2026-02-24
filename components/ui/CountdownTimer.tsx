"use client";

import { useState, useEffect } from "react";
import type { CountdownStyleId } from "@/lib/types";

interface CountdownTimerProps {
  eventDate?: string;
  variant?: "classic" | "modern" | "bohemian";
  countdownStyle?: CountdownStyleId;
  textColor?: string;
  compact?: boolean;
  compactVariant?: "default" | "video";
  countdownFontSize?: number;
}

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

export function CountdownTimer({
  eventDate,
  variant = "modern",
  countdownStyle = "classic",
  textColor = "#FFFFFF",
  compact = false,
  compactVariant = "default",
  countdownFontSize: countdownFontSizeProp,
}: CountdownTimerProps) {
  const [diff, setDiff] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!eventDate) {
      setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const target = new Date(eventDate).getTime();

    const tick = () => {
      const now = Date.now();
      const d = Math.max(0, target - now);
      setDiff({
        days: d / (1000 * 60 * 60 * 24),
        hours: (d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        minutes: (d % (1000 * 60 * 60)) / (1000 * 60),
        seconds: (d % (1000 * 60)) / 1000,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  if (diff === null) return null;

  const boxes = [
    { value: pad(diff.days), label: "GÜN" },
    { value: pad(diff.hours), label: "SAAT" },
    { value: pad(diff.minutes), label: "DAKİKA" },
    { value: pad(diff.seconds), label: "SANİYE" },
  ];

  const boxClass: Record<string, string> = {
    classic:
      "bg-transparent border border-current [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]",
    modern: "bg-white/90 border border-white/30 text-[#171717]",
    bohemian:
      "bg-transparent border border-[#E8B4B8] [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]",
  };

  const labelClass: Record<string, string> = {
    classic: "opacity-90",
    modern: "text-[#525252]",
    bohemian: "opacity-80",
  };

  const colorStyle = { color: textColor };

  const videoCompact = compact && compactVariant === "video";
  const boxSize = compact
    ? videoCompact
      ? { width: 46, height: 40, fontSize: 14, labelSize: 8, gap: 6 }
      : { minWidth: 48, height: undefined, fontSize: 18, labelSize: 8, gap: 8 }
    : { minWidth: 56, height: undefined, fontSize: 24, labelSize: 10, gap: 8 };
  const boxSizePx = "width" in boxSize ? boxSize.width : boxSize.minWidth;
  const boxHeight = boxSize.height;
  const numSize = countdownFontSizeProp ?? boxSize.fontSize;
  const lblSize = boxSize.labelSize;
  const boxGap = boxSize.gap;

  if (countdownStyle === "minimal") {
    const str = `${pad(diff.days)} / ${pad(diff.hours)} / ${pad(diff.minutes)} / ${pad(diff.seconds)}`;
    return (
      <p
        className="text-xl font-bold tabular-nums tracking-wide"
        style={{ ...colorStyle, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      >
        {str}
      </p>
    );
  }

  if (countdownStyle === "modern") {
    const modNumSize = countdownFontSizeProp ?? (videoCompact ? 14 : compact ? 18 : 24);
    const modLblSize = compact ? 8 : 10;
    return (
      <div
        className="flex justify-center flex-wrap"
        style={{ gap: boxGap }}
      >
        {boxes.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center"
            style={colorStyle}
          >
            <span
              className="font-bold tabular-nums leading-none [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]"
              style={{ fontSize: modNumSize }}
            >
              {value}
            </span>
            <span
              className="font-medium uppercase tracking-wider mt-0.5 opacity-80"
              style={{ fontSize: modLblSize }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const classicBorder =
    variant === "classic" ? "#C9A96E" : variant === "bohemian" ? "#E8B4B8" : undefined;

  return (
    <div
      className="flex justify-center flex-wrap"
      style={{ gap: boxGap }}
    >
      {boxes.map(({ value, label }) => (
        <div
          key={label}
          className={`flex flex-col items-center justify-center rounded-lg py-2 px-2.5 border ${boxClass[variant]}`}
          style={{
            color: textColor,
            width: videoCompact ? boxSizePx : undefined,
            minWidth: !videoCompact ? boxSizePx : undefined,
            height: boxHeight,
            borderColor:
              variant === "modern" ? "rgba(255,255,255,0.3)" : classicBorder ?? textColor,
          }}
        >
          <span
            className="font-bold tabular-nums leading-none"
            style={{ fontSize: numSize }}
          >
            {value}
          </span>
          <span
            className={`font-medium uppercase tracking-[0.1em] mt-0.5 ${labelClass[variant]}`}
            style={{ fontSize: lblSize }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
