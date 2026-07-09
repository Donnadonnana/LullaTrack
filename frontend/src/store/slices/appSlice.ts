import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  selectedBabyId: string | null;
};

const initialState: AppState = {
  selectedBabyId: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedBabyId: (state, action: PayloadAction<string>) => {
      state.selectedBabyId = action.payload;
    },
  },
});

export const { setSelectedBabyId } = appSlice.actions;
export default appSlice.reducer;