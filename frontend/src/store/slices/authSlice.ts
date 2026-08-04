import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { getCurrentUser, loginUser, registerUser } from "../../api/authApi";

import type { LoginRequest, RegisterRequest, User } from "../../types/auth";

import type { Baby } from "./babySlice";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export type RegistrationDraft = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthSession = {
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
  error: string | unknown;
  registrationDraft: RegistrationDraft | null;
};

const STORAGE_KEY = "lullatrack-auth";

function getStoredSession(): AuthSession | null {
  try {
    const storedSession = localStorage.getItem(STORAGE_KEY);

    if (!storedSession) {
      return null;
    }

    return JSON.parse(storedSession) as AuthSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);

    return null;
  }
}

const parsedSession = getStoredSession();

const initialState: AuthState = {
  user: parsedSession?.user ?? null,

  idToken: parsedSession?.idToken ?? null,
  refreshToken: parsedSession?.refreshToken ?? null,
  expiresAt: parsedSession?.expiresAt ?? null,

  status: parsedSession ? "authenticated" : "idle",

  error: null,

  // Do not persist this because it contains the password.
  registrationDraft: null,
};

export const registerAccount = createAsyncThunk<AuthSession, RegisterRequest>(
  "auth/register",
  async (request): Promise<AuthSession> => {
    const registration = await registerUser(request);

    const session = await loginUser({
      email: request.email,
      password: request.password,
    });

    return {
      user: registration.user,
      babies: [registration.baby],
      idToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt: Date.now() + Number(session.expiresIn) * 1000,
    };
  },
);

export const signInAccount = createAsyncThunk<AuthSession, LoginRequest>(
  "auth/login",
  async (request): Promise<AuthSession> => {
    const session = await loginUser(request);

    const profile = await getCurrentUser(session.idToken);

    return {
      user: profile.user,
      babies: profile.babies,
      idToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt: Date.now() + Number(session.expiresIn) * 1000,
    };
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setRegistrationDraft: (state, action: PayloadAction<RegistrationDraft>) => {
      state.registrationDraft = action.payload;

      state.error = null;
    },

    clearRegistrationDraft: (state) => {
      state.registrationDraft = null;
    },

    signOutUser: (state) => {
      state.user = null;

      state.idToken = null;
      state.refreshToken = null;
      state.expiresAt = null;

      state.status = "idle";
      state.error = null;

      state.registrationDraft = null;

      localStorage.removeItem(STORAGE_KEY);
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    restoreUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "authenticated";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Register
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

        // Clear the temporary email/password data.
        state.registrationDraft = null;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      })

      .addCase(registerAccount.rejected, (state, action) => {
        state.status = "error";

        state.error = action.payload ?? "Unable to register.";
      })

      // Sign in
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

        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      })

      .addCase(signInAccount.rejected, (state, action) => {
        state.status = "error";

        state.error = action.payload ?? "Unable to sign in.";
      });
  },
});

export const {
  setRegistrationDraft,
  clearRegistrationDraft,
  signOutUser,
  clearAuthError,
  restoreUser,
} = authSlice.actions;

export default authSlice.reducer;
