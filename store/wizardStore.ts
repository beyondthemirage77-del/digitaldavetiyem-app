import { create } from "zustand";
import type { WizardStep, InvitationFormData, MusicTrackId, TemplateId } from "@/lib/types";

const VALID_MUSIC_TRACKS: MusicTrackId[] = [
  "romantic-piano",
  "classical-waltz",
  "acoustic-guitar",
  "orchestral",
  "jazz-lounge",
];

const defaultFormData: InvitationFormData = {
  templateId: null as TemplateId,
  eventDate: "",
  eventTime: "",
  venueName: "",
  venueAddress: "",
  googleMapsUrl: "",
  mediaType: "image",
  audioType: "none",
  backgroundType: "upload",
  presetBackground: "cream",
  mediaUrls: [],
  audioUrl: "",
  musicTrack: "romantic-piano",
  textColor: "#FFFFFF",
  titleFontSize: 12,
  namesFontSize: 38,
  countdownFontSize: 24,
  titleFontFamily: "inter",
  namesFontFamily: "cormorant",
  noteFontFamily: "cormorant",
  subtitle: "Nikahımıza Davetlisiniz",
  noteText: "Bu mutlu günümüzü sizinle paylaşmak istiyoruz",
  showSubtitle: true,
  showAvatar: false,
  showNote: true,
  showDate: true,
  showVenue: true,
  showCountdown: true,
  showReminderButton: true,
  showScrollIndicator: true,
  avatarShape: "circle",
  rsvpEnabled: true,
  countdownStyle: "classic",
};

interface WizardState {
  currentStep: WizardStep;
  formData: InvitationFormData;
  invitationId: string | null;
  isLoading: boolean;
  error: string | null;
  setStep: (step: WizardStep) => void;
  updateFormData: (data: Partial<InvitationFormData>) => void;
  setInvitationId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

const initialState = {
  currentStep: "template" as WizardStep,
  formData: defaultFormData,
  invitationId: null as string | null,
  isLoading: false,
  error: null as string | null,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,

  setStep: (currentStep) => set({ currentStep, error: null }),

  setInvitationId: (invitationId) => set({ invitationId }),

  updateFormData: (data) =>
    set((state) => {
      const next = { ...state.formData, ...data };
      if (data.musicTrack !== undefined && !VALID_MUSIC_TRACKS.includes(data.musicTrack as MusicTrackId)) {
        next.musicTrack = "romantic-piano";
      }
      return { formData: next, error: null };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  resetStore: () => set(initialState),
}));
