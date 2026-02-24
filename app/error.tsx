"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fafaf8]">
      <h2 className="text-xl font-semibold text-[#171717] mb-2">
        Bir şeyler ters gitti
      </h2>
      <p className="text-[#737373] text-sm text-center mb-6 max-w-md">
        Sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-[12px] bg-[#111] text-white font-medium hover:bg-[#333] transition-colors"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-[12px] border border-[#e5e5e5] text-[#525252] font-medium hover:bg-[#f5f5f5] transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
