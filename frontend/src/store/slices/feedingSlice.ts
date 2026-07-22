import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FeedingType = "breastfeeding" | "bottle";

export type BreastSide = "left" | "right" | "both" | "";

export type BottleMilkType = "breast-milk" | "formula" | "mixed" | "";

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

type FeedingState = {
  logs: FeedingLog[];
};

const initialState: FeedingState = {
  logs: [],
};

const feedingSlice = createSlice({
  name: "feeding",
  initialState,
  reducers: {
    addFeedingLog: (
      state,
      action: PayloadAction<{
        babyId: string;
        date: string;
        type: FeedingType;
        feedingNumber: number;
      }>,
    ) => {
      const { babyId, date, type, feedingNumber } = action.payload;

      if (type === "breastfeeding") {
        state.logs.push({
          id: crypto.randomUUID(),
          babyId,
          date,
          type,
          feedingNumber,
          startTime: "",
          endTime: "",
          side: "",
          notes: "",
        });

        return;
      }

      state.logs.push({
        id: crypto.randomUUID(),
        babyId,
        date,
        type,
        feedingNumber,
        startTime: "",
        amountMl: null,
        milkType: "",
        notes: "",
      });
    },

    updateFeedingLog: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<FeedingLog>;
      }>,
    ) => {
      const log = state.logs.find((item) => item.id === action.payload.id);

      if (!log) {
        return;
      }

      Object.assign(log, action.payload.changes);
    },

    deleteFeedingLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },
  },
});

export const { addFeedingLog, updateFeedingLog, deleteFeedingLog } =
  feedingSlice.actions;

export default feedingSlice.reducer;
