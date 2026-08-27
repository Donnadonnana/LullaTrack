import { createAsyncThunk, createSlice, type Reducer } from "@reduxjs/toolkit";

import {
  createFeedingLogApi,
  deleteFeedingLogApi,
  getFeedingLogsApi,
  updateFeedingLogApi,
  type UpdateFeedingLogRequest,
} from "../../api/feedingApi";

import type { RootState } from "../store";

export type FeedingType = "breastfeeding" | "bottle";

export type BreastSide = "left" | "right" | "both" | "";

export type BottleMilkType = "breast-milk" | "formula" | "combination" | "";

type FeedingLogBase = {
  id: string;
  babyId: string;
  date: string;
  feedingNumber: number;
  startTime: string;
  notes: string;
};

export type BreastfeedingLog = FeedingLogBase & {
  type: "breastfeeding";
  endTime: string;
  side: BreastSide;
};

export type BottleFeedingLog = FeedingLogBase & {
  type: "bottle";
  amountMl: number | null;
  milkType: BottleMilkType;
};

export type FeedingLog = BreastfeedingLog | BottleFeedingLog;

export type FeedingState = {
  logs: FeedingLog[];
  loading: boolean;
  error: string | null;
  savingIds: string[];
  deletingIds: string[];
};

const initialState: FeedingState = {
  logs: [],
  loading: false,
  error: null,
  savingIds: [],
  deletingIds: [],
};

export const fetchFeedingLogs = createAsyncThunk<
  FeedingLog[],
  { babyId: string; date: string },
  { state: RootState }
>("feeding/fetchByDate", async ({ babyId, date }, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;

  if (!idToken) {
    throw new Error("Not authenticated.");
  }

  return getFeedingLogsApi(babyId, date, idToken);
});

export const createFeedingLog = createAsyncThunk<
  FeedingLog,
  { babyId: string; date: string; type: FeedingType; feedingNumber: number },
  { state: RootState }
>("feeding/create", async (payload, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;

  if (!idToken) {
    throw new Error("Not authenticated.");
  }

  return createFeedingLogApi(payload, idToken);
});

export const saveFeedingLog = createAsyncThunk<
  FeedingLog,
  { id: string; changes: UpdateFeedingLogRequest },
  { state: RootState }
>("feeding/save", async ({ id, changes }, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;

  if (!idToken) {
    throw new Error("Not authenticated.");
  }

  return updateFeedingLogApi(id, changes, idToken);
});

export const deleteFeedingLog = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("feeding/delete", async (id, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;

  if (!idToken) {
    throw new Error("Not authenticated.");
  }

  await deleteFeedingLogApi(id, idToken);
  return id;
});

const feedingSlice = createSlice({
  name: "feeding",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFeedingLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFeedingLogs.fulfilled, (state, action) => {
        state.loading = false;

        // Replace only the logs for this babyId + date, so fetches for
        // other dates already in the store aren't clobbered.
        const { babyId, date } = action.meta.arg;

        state.logs = [
          ...state.logs.filter(
            (log) => !(log.babyId === babyId && log.date === date),
          ),
          ...action.payload,
        ];
      })

      .addCase(fetchFeedingLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unable to load feeding logs.";
      })

      // Create
      .addCase(createFeedingLog.fulfilled, (state, action) => {
        state.logs.push(action.payload);
      })

      .addCase(createFeedingLog.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to create feeding log.";
      })

      // Save (update)
      .addCase(saveFeedingLog.pending, (state, action) => {
        state.savingIds.push(action.meta.arg.id);
      })

      .addCase(saveFeedingLog.fulfilled, (state, action) => {
        state.savingIds = state.savingIds.filter(
          (id) => id !== action.payload.id,
        );

        const index = state.logs.findIndex(
          (log) => log.id === action.payload.id,
        );

        if (index !== -1) {
          state.logs[index] = action.payload;
        }
      })

      .addCase(saveFeedingLog.rejected, (state, action) => {
        state.savingIds = state.savingIds.filter(
          (id) => id !== action.meta.arg.id,
        );
        state.error = action.error.message ?? "Unable to save feeding log.";
      })

      // Delete
      .addCase(deleteFeedingLog.pending, (state, action) => {
        state.deletingIds.push(action.meta.arg);
      })

      .addCase(deleteFeedingLog.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.payload,
        );
        state.logs = state.logs.filter((log) => log.id !== action.payload);
      })

      .addCase(deleteFeedingLog.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.error = action.error.message ?? "Unable to delete feeding log.";
      });
  },
});

// Explicit annotation breaks the circular type inference with store.ts —
// see the same fix applied to authSlice/babySlice/sleepSlice.
const feedingReducer: Reducer<FeedingState> = feedingSlice.reducer;

export default feedingReducer;
