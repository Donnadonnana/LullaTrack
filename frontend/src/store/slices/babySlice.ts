import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { registerAccount, signInAccount, signOutUser } from "./authSlice";

export type BabyGender = "boy" | "girl";

export type FeedingMethod = "breastfeeding" | "bottle" | "combination";

export type Baby = {
  id: string;
  name: string;
  gender: BabyGender;
  feedingMethod: FeedingMethod;
  dateOfBirth: string;
};

export type OnboardingMode = "create" | "add" | "restart";

export type BabyDraft = {
  name: string;
  gender: BabyGender | "";
  feedingMethod: FeedingMethod | "";
  dateOfBirth: string;
};

type BabyState = {
  babies: Baby[];
  activeBabyId: string | null;

  onboarding: {
    mode: OnboardingMode;
    step: number;
    draft: BabyDraft;
  };
};

const emptyDraft: BabyDraft = {
  name: "",
  gender: "",
  feedingMethod: "",
  dateOfBirth: "",
};

function createInitialOnboardingState(): BabyState["onboarding"] {
  return {
    mode: "create",
    step: 0,
    draft: {
      ...emptyDraft,
    },
  };
}

function loadStoredBabies(): Baby[] {
  try {
    const storedSession = localStorage.getItem("lullatrack-auth");

    if (!storedSession) {
      return [];
    }

    const parsedSession = JSON.parse(storedSession) as {
      babies?: Baby[];
    };

    return parsedSession.babies ?? [];
  } catch {
    return [];
  }
}

const storedBabies = loadStoredBabies();

const initialState: BabyState = {
  babies: storedBabies,

  activeBabyId: storedBabies[0]?.id ?? null,

  onboarding: createInitialOnboardingState(),
};

const babySlice = createSlice({
  name: "babies",
  initialState,

  reducers: {
    startOnboarding: (state, action: PayloadAction<OnboardingMode>) => {
      const mode = action.payload;

      state.onboarding.mode = mode;
      state.onboarding.step = 0;

      if (mode === "restart" && state.activeBabyId) {
        const activeBaby = state.babies.find(
          (baby) => baby.id === state.activeBabyId,
        );

        if (activeBaby) {
          state.onboarding.draft = {
            name: activeBaby.name,
            gender: activeBaby.gender,
            dateOfBirth: activeBaby.dateOfBirth,
            feedingMethod: activeBaby.feedingMethod,
          };

          return;
        }
      }

      state.onboarding.draft = {
        ...emptyDraft,
      };
    },

    updateBabyDraft: (state, action: PayloadAction<Partial<BabyDraft>>) => {
      state.onboarding.draft = {
        ...state.onboarding.draft,
        ...action.payload,
      };
    },

    nextOnboardingStep: (state) => {
      state.onboarding.step += 1;
    },

    previousOnboardingStep: (state) => {
      state.onboarding.step = Math.max(0, state.onboarding.step - 1);
    },

    /*
     * The backend now creates the first baby
     * during registration.
     *
     * This action only resets onboarding after
     * registerAccount succeeds.
     */
    finishOnboarding: (state) => {
      state.onboarding = createInitialOnboardingState();
    },

    setActiveBaby: (state, action: PayloadAction<string>) => {
      const babyExists = state.babies.some(
        (baby) => baby.id === action.payload,
      );

      if (babyExists) {
        state.activeBabyId = action.payload;
      }
    },

    clearBabyState: (state) => {
      state.babies = [];
      state.activeBabyId = null;

      state.onboarding = createInitialOnboardingState();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.babies = action.payload.babies;

        state.activeBabyId = action.payload.babies[0]?.id ?? null;

        state.onboarding = createInitialOnboardingState();
      })

      .addCase(signInAccount.fulfilled, (state, action) => {
        const previousActiveBabyId = state.activeBabyId;

        state.babies = action.payload.babies;

        const activeBabyStillExists = state.babies.some(
          (baby) => baby.id === previousActiveBabyId,
        );

        state.activeBabyId = activeBabyStillExists
          ? previousActiveBabyId
          : (state.babies[0]?.id ?? null);

        state.onboarding = createInitialOnboardingState();
      })

      .addCase(signOutUser, (state) => {
        state.babies = [];
        state.activeBabyId = null;

        state.onboarding = createInitialOnboardingState();
      });
  },
});

export const {
  startOnboarding,
  updateBabyDraft,
  nextOnboardingStep,
  previousOnboardingStep,
  finishOnboarding,
  setActiveBaby,
  clearBabyState,
} = babySlice.actions;

export default babySlice.reducer;
