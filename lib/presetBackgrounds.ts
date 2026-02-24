import type { PresetBackgroundId } from "./types";

export const PRESET_BACKGROUNDS: {
  id: PresetBackgroundId;
  label: string;
  style: React.CSSProperties;
  className?: string;
}[] = [
  {
    id: "cream",
    label: "Krem Zemin",
    style: { backgroundColor: "#FAF7F2" },
  },
  {
    id: "navy",
    label: "Gece Mavisi",
    style: { backgroundColor: "#1a1a2e" },
  },
  {
    id: "dusty-rose",
    label: "Gül Kurusu",
    style: { backgroundColor: "#E8B4B8" },
  },
  {
    id: "sage",
    label: "Orman Yeşili",
    style: { backgroundColor: "#87A878" },
  },
  {
    id: "gold",
    label: "Altın Varak",
    style: {
      background: "linear-gradient(180deg, #D4AF37 0%, #FAF7F2 100%)",
    },
  },
  {
    id: "marble",
    label: "Mermer",
    style: {
      background:
        "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 25%, #f5f5f5 50%, #eeeeee 75%, #fafafa 100%)",
    },
  },
];
