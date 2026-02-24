"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Hide on auth page
  if (pathname === "/auth") return null;

  // Known app routes - always show header
  const knownAppRoutes = [
    "/dashboard",
    "/create",
    "/payment",
    "/blog",
    "/sablonlar",
    "/kvkk",
    "/gizlilik",
    "/iletisim",
    "/hakkimizda",
  ];
  if (knownAppRoutes.some((route) => pathname?.startsWith(route))) {
    // Show header - continue to return JSX below
  } else {
    // Unknown single-segment path = invitation slug page, hide header
    const segments = pathname?.split("/").filter(Boolean) || [];
    if (segments.length === 1) return null;
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50 border-b border-[#eee]"
      style={{
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left - Logo */}
        <Link
          href="/"
          className="text-lg font-semibold text-[#171717] hover:text-[#333]"
        >
          💌 DigitalDavetiyem
        </Link>

        {/* Center - Navigation links */}
        <div className="hidden md:flex items-center gap-8 text-base text-[#525252]">
          <Link href="/#ozellikler" className="hover:text-[#171717]">
            Özellikler
          </Link>
          <Link href="/#fiyatlar" className="hover:text-[#171717]">
            Fiyatlar
          </Link>
          <Link href="/#sss" className="hover:text-[#171717]">
            SSS
          </Link>
          <Link href="/blog" className="hover:text-[#171717]">
            Blog
          </Link>
        </div>

        {/* Right - User menu or login/CTA */}
        {user ? (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f5f5f5",
                border: "none",
                borderRadius: 20,
                padding: "6px 12px 6px 6px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#111",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "#333",
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.displayName || user.email?.split("@")[0]}
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4.5l3 3 3-3"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                  onClick={() => setMenuOpen(false)}
                />
                {/* Dropdown */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 40,
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid #eee",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    minWidth: 180,
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Giriş yapıldı
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#111",
                        marginTop: 2,
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/dashboard");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      fontSize: 13,
                      cursor: "pointer",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    📋 Davetiyelerim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/create");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      fontSize: 13,
                      cursor: "pointer",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    ✨ Yeni Davetiye
                  </button>
                  <div style={{ borderTop: "1px solid #f5f5f5" }}>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        fontSize: 13,
                        cursor: "pointer",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      🚪 Çıkış Yap
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="px-4 py-2 text-base font-medium text-[#525252] border border-[#ddd] rounded-[10px] hover:bg-[#f5f5f5]"
            >
              Giriş Yap
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 text-base font-medium text-white bg-[#111] rounded-[10px] hover:bg-[#333]"
            >
              Başla →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
