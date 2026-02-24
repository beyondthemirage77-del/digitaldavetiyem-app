import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dijital Davetiye Blog - İpuçları ve İlham | DigitalDavetiyem.com",
  description:
    "Dijital davetiye hakkında ipuçları, düğün planlaması rehberi, davetiye örnekleri ve daha fazlası.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
