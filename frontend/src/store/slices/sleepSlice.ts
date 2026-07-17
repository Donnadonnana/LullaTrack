import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SleepType = "nap" | "night";

export type SleepLog = {
  id: string;
  babyId: string;
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
};

const initialState: SleepState = {
  logs: [],
};

const sleepSlice = createSlice({
  name: "sleep",
  initialState,
  reducers: {
    addSleepLog: (
      state,
      action: PayloadAction<{
        babyId: string;
        type: SleepType;
        sleepNumber: number;
      }>,
    ) => {
      state.logs.push({
        id: crypto.randomUUID(),
        babyId: action.payload.babyId,
        type: action.payload.type,
        sleepNumber: action.payload.sleepNumber,

        onBedTime: "",
        asleepTime: "",
        wakeTime: "",
        pickupTime: "",
        notes: "",
      });
    },

    updateSleepLog: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<SleepLog, "id">>;
      }>,
    ) => {
      const log = state.logs.find(
        (item) => item.id === action.payload.id,
      );

      if (log) {
        Object.assign(log, action.payload.changes);
      }
    },

    removeSleepLog: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.logs = state.logs.filter(
        (log) => log.id !== action.payload,
      );
    },
  },
});

export const {
  addSleepLog,
  updateSleepLog,
  removeSleepLog,
} = sleepSlice.actions;

export default sleepSlice.reducer;