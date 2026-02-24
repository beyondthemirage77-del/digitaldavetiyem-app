"use client";

import { useState, useEffect } from "react";

export function ImageSlider({
  images,
  interval = 3000,
}: {
  images: string[];
  interval?: number;
}) {
  const [current, setCurrent] = useState(0);
  const list = images ?? [];

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % list.length);
    }, interval);
    return () => clearInterval(timer);
  }, [list.length, interval]);

  if (list.length === 0) return null;

  if (list.length === 1) {
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={list[0]} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {list.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: index === current ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
