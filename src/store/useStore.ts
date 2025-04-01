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
  initialize: () => Promise<void>;
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
  initialize: async () => {
    // Check if we have a JWT token
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        // Fetch initial onboarding progress
        const progress = await api.getOnboardingProgress();
        set({ onboardingProgress: progress });
        
        // Set appropriate step based on progress
        if (progress.completedSteps.length >= 3) {
          set({ step: 7 }); // Go to dashboard
        } else if (progress.completedSteps.length > 0) {
          // Find the next step
          const stepMapping: { [key: string]: number } = {
            'add_helios_network': 3,
            'claim_from_faucet': 4,
            'mint_early_bird_nft': 5
          };
          const lastCompletedStep = progress.completedSteps[progress.completedSteps.length - 1];
          const nextStep = stepMapping[lastCompletedStep] + 1;
          set({ step: nextStep });
        } else {
          set({ step: 2 }); // Start onboarding
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
        set({ step: 0 }); // Go to connect wallet if initialization fails
      }
    } else {
      set({ step: 0 }); // No token, go to connect wallet
    }
  }
}));