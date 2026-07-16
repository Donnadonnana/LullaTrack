import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BabyGender = "boy" | "girl";
export type FeedingMethod =
  | "breastfeeding"
  | "bottle"
  | "combination";

export type Baby = {
  id: string;
  name: string;
  gender: BabyGender;
  ageMonths: number;
  feedingMethod: FeedingMethod;
  daySleepHours: number;
  nightSleepHours: number;
};

export type OnboardingMode = "create" | "add" | "restart";

export type BabyDraft = {
  name: string;
  gender: BabyGender | "";
  ageMonths: number | null;
  feedingMethod: FeedingMethod | "";
  daySleepHours: number | null;
  nightSleepHours: number | null;
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
  ageMonths: null,
  feedingMethod: "",
  daySleepHours: null,
  nightSleepHours: null,
};

const initialState: BabyState = {
  babies: [],
  activeBabyId: null,

  onboarding: {
    mode: "create",
    step: 0,
    draft: emptyDraft,
  },
};

const babySlice = createSlice({
  name: "babies",
  initialState,
  reducers: {
    startOnboarding: (
      state,
      action: PayloadAction<OnboardingMode>
    ) => {
      const mode = action.payload;

      state.onboarding.mode = mode;
      state.onboarding.step = 0;

      if (mode === "restart" && state.activeBabyId) {
        const activeBaby = state.babies.find(
          (baby) => baby.id === state.activeBabyId
        );

        if (activeBaby) {
          state.onboarding.draft = {
            name: activeBaby.name,
            gender: activeBaby.gender,
            ageMonths: activeBaby.ageMonths,
            feedingMethod: activeBaby.feedingMethod,
            daySleepHours: activeBaby.daySleepHours,
            nightSleepHours: activeBaby.nightSleepHours,
          };

          return;
        }
      }

      state.onboarding.draft = { ...emptyDraft };
    },

    updateBabyDraft: (
      state,
      action: PayloadAction<Partial<BabyDraft>>
    ) => {
      state.onboarding.draft = {
        ...state.onboarding.draft,
        ...action.payload,
      };
    },

    nextOnboardingStep: (state) => {
      state.onboarding.step += 1;
    },

    previousOnboardingStep: (state) => {
      state.onboarding.step = Math.max(
        0,
        state.onboarding.step - 1
      );
    },

    finishOnboarding: (state) => {
      const draft = state.onboarding.draft;

      if (
        !draft.name ||
        !draft.gender ||
        draft.ageMonths === null ||
        !draft.feedingMethod ||
        draft.daySleepHours === null ||
        draft.nightSleepHours === null
      ) {
        return;
      }

      const babyData = {
        name: draft.name,
        gender: draft.gender,
        ageMonths: draft.ageMonths,
        feedingMethod: draft.feedingMethod,
        daySleepHours: draft.daySleepHours,
        nightSleepHours: draft.nightSleepHours,
      };

      if (
        state.onboarding.mode === "restart" &&
        state.activeBabyId
      ) {
        const index = state.babies.findIndex(
          (baby) => baby.id === state.activeBabyId
        );

        if (index !== -1) {
          state.babies[index] = {
            id: state.activeBabyId,
            ...babyData,
          };
        }
      } else {
        const newBaby: Baby = {
          id: crypto.randomUUID(),
          ...babyData,
        };

        state.babies.push(newBaby);
        state.activeBabyId = newBaby.id;
      }

      state.onboarding.step = 0;
      state.onboarding.draft = { ...emptyDraft };
    },

    setActiveBaby: (
      state,
      action: PayloadAction<string>
    ) => {
      state.activeBabyId = action.payload;
    },

    clearBabyState: (state) => {
        state.babies = [];
        state.activeBabyId = null;
      
        state.onboarding = {
          mode: "create",
          step: 0,
          draft: { ...emptyDraft },
        };
      },
  },
});

export const {
  startOnboarding,
  updateBabyDraft,
  nextOnboardingStep,
  previousOnboardingStep,
  finishOnboarding,
  setActiveBaby,
  clearBabyState
} = babySlice.actions;

export default babySlice.reducer;