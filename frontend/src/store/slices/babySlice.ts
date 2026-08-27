import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  registerAccount,
  signInAccount,
  signOutUser,
  restoreSession,
} from "./authSlice";
import { createBabyApi, getBabiesApi, updateBabyApi } from "../../api/babyApi";
import type { RootState } from "../store";

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
  status: "idle" | "loading" | "error";
  error: string | null;

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
  status: "idle",
  error: null,
  onboarding: createInitialOnboardingState(),
};

export const fetchBabies = createAsyncThunk<Baby[], void, { state: RootState }>(
  "babies/fetchAll",
  async (_, thunkApi) => {
    const idToken = thunkApi.getState().auth.idToken;

    if (!idToken) {
      throw new Error("Not authenticated.");
    }

    return getBabiesApi(idToken);
  },
);

export const createBaby = createAsyncThunk<
  Baby,
  BabyDraft,
  { state: RootState }
>("babies/create", async (draft, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;

  if (!idToken) {
    throw new Error("Not authenticated.");
  }

  if (!draft.gender || !draft.feedingMethod) {
    throw new Error("Baby details are incomplete.");
  }

  return createBabyApi(
    {
      name: draft.name,
      gender: draft.gender,
      feedingMethod: draft.feedingMethod,
      dateOfBirth: draft.dateOfBirth,
    },
    idToken,
  );
});

type UpdateBabyArgs = {
  babyId: string;
  changes: Partial<Omit<BabyDraft, "gender" | "feedingMethod">> & {
    gender?: BabyGender;
    feedingMethod?: FeedingMethod;
  };
};

export const updateBaby = createAsyncThunk<
  Baby,
  UpdateBabyArgs,
  { state: RootState }
>("babies/update", async ({ babyId, changes }, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;

  if (!idToken) {
    throw new Error("Not authenticated.");
  }

  return updateBabyApi(babyId, changes, idToken);
});

const babySlice = createSlice({
  name: "babies",
  initialState,

  reducers: {
    startOnboarding: (state, action: PayloadAction<OnboardingMode>) => {
      const mode = action.payload;

      state.onboarding.mode = mode;
      state.onboarding.step = 0;
      state.error = null;

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
      state.status = "idle";
      state.error = null;

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
        state.status = "idle";
        state.error = null;

        state.onboarding = createInitialOnboardingState();
      })

      .addCase(restoreSession.fulfilled, (state, action) => {
        state.babies = action.payload.babies;

        const activeBabyStillExists = action.payload.babies.some(
          (baby) => baby.id === state.activeBabyId,
        );

        state.activeBabyId = activeBabyStillExists
          ? state.activeBabyId
          : (action.payload.babies[0]?.id ?? null);
      })

      // Fetch all babies
      .addCase(fetchBabies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchBabies.fulfilled, (state, action) => {
        state.status = "idle";
        state.babies = action.payload;

        const activeBabyStillExists = action.payload.some(
          (baby) => baby.id === state.activeBabyId,
        );

        state.activeBabyId = activeBabyStillExists
          ? state.activeBabyId
          : (action.payload[0]?.id ?? null);
      })

      .addCase(fetchBabies.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Unable to load babies.";
      })

      // Create a baby (the "Add a baby" flow — NOT registration)
      .addCase(createBaby.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createBaby.fulfilled, (state, action) => {
        state.status = "idle";
        state.babies.push(action.payload);
        state.activeBabyId = action.payload.id;
        state.onboarding = createInitialOnboardingState();
      })

      .addCase(createBaby.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Unable to create baby.";
      })

      // Update a baby (the "restart"/edit flow)
      .addCase(updateBaby.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateBaby.fulfilled, (state, action) => {
        state.status = "idle";

        const index = state.babies.findIndex(
          (baby) => baby.id === action.payload.id,
        );

        if (index !== -1) {
          state.babies[index] = action.payload;
        }

        state.onboarding = createInitialOnboardingState();
      })

      .addCase(updateBaby.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Unable to update baby.";
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
