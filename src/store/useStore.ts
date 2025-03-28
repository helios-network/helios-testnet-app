import { create } from 'zustand';
import { api, User, OnboardingProgress } from '../services/api';

interface OnboardingState {
  step: number;
  xp: number;
  user: User | null;
  onboardingProgress: OnboardingProgress | null;
  setStep: (step: number) => void;
  addXP: (amount: number) => void;
  setUser: (user: User) => void;
  setOnboardingProgress: (progress: OnboardingProgress) => void;
  fetchOnboardingProgress: () => Promise<void>;
}

export const useStore = create<OnboardingState>((set, get) => ({
  step: 0,
  xp: 0,
  user: null,
  onboardingProgress: null,
  setStep: (step) => set({ step }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  setUser: (user) => set({ user }),
  setOnboardingProgress: (progress) => set({ onboardingProgress: progress }),
  fetchOnboardingProgress: async () => {
    try {
      const progress = await api.getOnboardingProgress();
      set({ onboardingProgress: progress });
    } catch (error) {
      console.error('Failed to fetch onboarding progress:', error);
    }
  },
}));