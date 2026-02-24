import type { Metadata } from "next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    if (!db || !slug) {
      return { title: "Davetiye" };
    }

    const qry = query(collection(db, "invitations"), where("slug", "==", slug));
    const snap = await getDocs(qry);

    if (snap.empty) {
      return {
        title: "Davetiye Bulunamadı",
        robots: { index: false, follow: false },
      };
    }

    const data = snap.docs[0]!.data();
    const weddingBride = data.wedding_brideName ?? data.brideName ?? "";
    const weddingGroom = data.wedding_groomName ?? data.groomName ?? "";
    const acilisFirma = data.acilis_firmaAdi ?? "";
    const kinaBride = data.kina_brideName ?? "";
    const mainTitle = data.mainTitle
      ?? (weddingBride && weddingGroom ? `${weddingBride} & ${weddingGroom} Davetiyesi` : null)
      ?? (acilisFirma ? `${acilisFirma} Açılış Davetiyesi` : null)
      ?? (kinaBride ? `${kinaBride} Kına Davetiyesi` : null)
      ?? "Davetiye";

    const title = (data.ogTitle as string) || mainTitle || "Davetiye";
    const description = (data.ogDescription as string) || "Düğün davetiyemize davetlisiniz.";
    const image = (data.ogImageUrl as string) || "/og-image.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630 }],
        type: "website",
        locale: "tr_TR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: "Davetiye" };
  }
}

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
