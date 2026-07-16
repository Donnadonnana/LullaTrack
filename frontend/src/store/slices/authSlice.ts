import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

// TODO: this is dummy data , need to replace with real auth data later once auth logic is done
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<{ email: string }>) => {
      state.user = {
        id: crypto.randomUUID(),
        email: action.payload.email,
      };
    },

    signInUser: (state, action: PayloadAction<{ email: string }>) => {
      state.user = {
        id: "dummy-existing-user",
        email: action.payload.email,
      };
    },

    signOutUser: (state) => {
      state.user = null;
    },
  },
});

export const { registerUser, signInUser, signOutUser } = authSlice.actions;

export default authSlice.reducer;
