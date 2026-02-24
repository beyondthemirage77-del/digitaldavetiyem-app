"use client";

import { useRef, useState, useEffect } from "react";
import { TemplateCardContent } from "@/components/TemplateCardContent";
import type { TemplateItem } from "@/lib/templateData";

const REF_WIDTH = 180;
const REF_HEIGHT = 320; // 9:16

interface ScalableTemplatePreviewProps {
  template: TemplateItem & { bg: string };
  className?: string;
}

/** Renders a template card scaled to fit its container. */
export function ScalableTemplatePreview({ template, className = "" }: ScalableTemplatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0) {
        const s = Math.min(w / REF_WIDTH, h / REF_HEIGHT, 1);
        setScale(s);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [template.id]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        style={{
          width: REF_WIDTH,
          height: REF_HEIGHT,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <TemplateCardContent template={template} compact />
        </div>
      </div>
    </div>
  );
}
