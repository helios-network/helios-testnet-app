import { create } from 'zustand';

interface OnboardingState {
  step: number;
  xp: number;
  setStep: (step: number) => void;
  addXP: (amount: number) => void;
}

export const useStore = create<OnboardingState>((set) => ({
  step: 0,
  xp: 0,
  setStep: (step) => set({ step }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
}));