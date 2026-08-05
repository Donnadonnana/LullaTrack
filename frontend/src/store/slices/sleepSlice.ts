import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "../store";

import {
  createSleepLogApi,
  deleteSleepLogApi,
  getSleepLogsApi,
  updateSleepLogApi,
  type CreateSleepLogRequest,
  type UpdateSleepLogRequest,
} from "../../api/sleepApi";

export type SleepType = "nap" | "night";

export type SleepLog = {
  id: string;
  userId: string;
  babyId: string;
  date: string;
  type: SleepType;
  sleepNumber: number;

  onBedTime: string;
  asleepTime: string;
  wakeTime: string;
  pickupTime: string;
  notes: string;
};

type SleepState = {
  logs: SleepLog[];
  loading: boolean;
  savingIds: string[];
  deletingIds: string[];
  error: string | null;
};

const initialState: SleepState = {
  logs: [],
  loading: false,
  savingIds: [],
  deletingIds: [],
  error: null,
};

function getToken(state: RootState): string {
  const idToken = state.auth.idToken;

  if (!idToken) {
    throw new Error("Authentication is required.");
  }

  return idToken;
}

export const fetchSleepLogs = createAsyncThunk<
  SleepLog[],
  {
    babyId: string;
    date: string;
  },
  {
    state: RootState;
  }
>("sleep/fetchSleepLogs", async ({ babyId, date }, thunkApi) => {
  return getSleepLogsApi(babyId, date, getToken(thunkApi.getState()));
});

export const createSleepLog = createAsyncThunk<
  SleepLog,
  CreateSleepLogRequest,
  {
    state: RootState;
  }
>("sleep/createSleepLog", async (request, thunkApi) => {
  return createSleepLogApi(request, getToken(thunkApi.getState()));
});

export const saveSleepLog = createAsyncThunk<
  SleepLog,
  {
    id: string;
    changes: UpdateSleepLogRequest;
  },
  {
    state: RootState;
  }
>("sleep/saveSleepLog", async ({ id, changes }, thunkApi) => {
  return updateSleepLogApi(id, changes, getToken(thunkApi.getState()));
});

export const deleteSleepLog = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
  }
>("sleep/deleteSleepLog", async (sleepLogId, thunkApi) => {
  await deleteSleepLogApi(sleepLogId, getToken(thunkApi.getState()));

  return sleepLogId;
});

const sleepSlice = createSlice({
  name: "sleep",
  initialState,

  reducers: {
    clearSleepError: (state) => {
      state.error = null;
    },

    clearSleepLogs: (state) => {
      state.logs = [];
    },

    replaceSleepLogLocally: (state, action: PayloadAction<SleepLog>) => {
      const index = state.logs.findIndex((log) => log.id === action.payload.id);

      if (index !== -1) {
        state.logs[index] = action.payload;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSleepLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSleepLogs.fulfilled, (state, action) => {
        state.loading = false;

        const { babyId, date } = action.meta.arg;

        state.logs = [
          ...state.logs.filter(
            (log) => !(log.babyId === babyId && log.date === date),
          ),
          ...action.payload,
        ];
      })
      .addCase(fetchSleepLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unable to load sleep logs.";
      })

      .addCase(createSleepLog.pending, (state) => {
        state.error = null;
      })
      .addCase(createSleepLog.fulfilled, (state, action) => {
        state.logs.push(action.payload);
      })
      .addCase(createSleepLog.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to create sleep log.";
      })

      .addCase(saveSleepLog.pending, (state, action) => {
        state.error = null;

        if (!state.savingIds.includes(action.meta.arg.id)) {
          state.savingIds.push(action.meta.arg.id);
        }
      })
      .addCase(saveSleepLog.fulfilled, (state, action) => {
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
      .addCase(saveSleepLog.rejected, (state, action) => {
        state.savingIds = state.savingIds.filter(
          (id) => id !== action.meta.arg.id,
        );

        state.error = action.error.message ?? "Unable to save sleep log.";
      })

      .addCase(deleteSleepLog.pending, (state, action) => {
        state.error = null;

        if (!state.deletingIds.includes(action.meta.arg)) {
          state.deletingIds.push(action.meta.arg);
        }
      })
      .addCase(deleteSleepLog.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.payload,
        );

        state.logs = state.logs.filter((log) => log.id !== action.payload);
      })
      .addCase(deleteSleepLog.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg,
        );

        state.error = action.error.message ?? "Unable to delete sleep log.";
      });
  },
});

export const { clearSleepError, clearSleepLogs, replaceSleepLogLocally } =
  sleepSlice.actions;

export default sleepSlice.reducer;
