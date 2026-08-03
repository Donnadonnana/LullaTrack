import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { getCurrentUser, loginUser, registerUser } from "../../api/authApi";

import type {
  Baby,
  LoginRequest,
  RegisterRequest,
  User,
} from "../../types/auth";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

type AuthSession = {
  user: User;
  babies: Baby[];
  idToken: string;
  refreshToken: string;
  expiresAt: number;
};

type AuthState = {
  user: User | null;
  idToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  status: AuthStatus;
  error: string | null;
};

const storedSession = localStorage.getItem("lullatrack-auth");

const parsedSession: AuthSession | null = storedSession
  ? (JSON.parse(storedSession) as AuthSession)
  : null;

const initialState: AuthState = {
  user: parsedSession?.user ?? null,
  idToken: parsedSession?.idToken ?? null,
  refreshToken: parsedSession?.refreshToken ?? null,
  expiresAt: parsedSession?.expiresAt ?? null,
  status: parsedSession ? "authenticated" : "idle",
  error: null,
};

export const registerAccount = createAsyncThunk<
  AuthSession,
  RegisterRequest,
  {
    rejectValue: string;
  }
>("auth/register", async (request, thunkApi) => {
  try {
    // Creates Firebase Auth user, Firestore user,
    // and the first baby.
    const registration = await registerUser(request);

    // Admin createUser does not sign in the browser,
    // so call the login endpoint afterward.
    const session = await loginUser({
      email: request.email,
      password: request.password,
    });

    const expiresAt = Date.now() + session.expiresIn * 1000;

    return {
      user: registration.user,
      babies: [registration.baby],
      idToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(
      error instanceof Error ? error.message : "Unable to register.",
    );
  }
});

export const signInAccount = createAsyncThunk<
  AuthSession,
  LoginRequest,
  {
    rejectValue: string;
  }
>("auth/login", async (request, thunkApi) => {
  try {
    const session = await loginUser(request);

    const profile = await getCurrentUser(session.idToken);

    const expiresAt = Date.now() + session.expiresIn * 1000;

    return {
      user: profile.user,
      babies: profile.babies,
      idToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(
      error instanceof Error ? error.message : "Unable to sign in.",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOutUser: (state) => {
      state.user = null;
      state.idToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("lullatrack-auth");
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    restoreUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "authenticated";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.idToken = action.payload.idToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.status = "authenticated";
        state.error = null;

        localStorage.setItem("lullatrack-auth", JSON.stringify(action.payload));
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Unable to register.";
      })

      .addCase(signInAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInAccount.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.idToken = action.payload.idToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.status = "authenticated";
        state.error = null;

        localStorage.setItem("lullatrack-auth", JSON.stringify(action.payload));
      })
      .addCase(signInAccount.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Unable to sign in.";
      });
  },
});

export const { signOutUser, clearAuthError, restoreUser } = authSlice.actions;

export default authSlice.reducer;
