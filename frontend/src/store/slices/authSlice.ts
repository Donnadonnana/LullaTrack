import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  refreshAuthToken,
} from "../../api/authApi";
import type { RootState } from "../store";
import type { LoginRequest, RegisterRequest, User } from "../../types/auth";
import type { Baby } from "./babySlice";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";
const STORAGE_KEY = "lullatrack-auth";

// Firebase idTokens live ~1hr. Refresh this many ms before actual expiry
// so we never fire a request with a token that's about to die mid-flight.
const REFRESH_BUFFER_MS = 60_000;

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
  error: any;
  registrationDraft: RegistrationDraft | null;
  initialized: boolean;
};

type StoredSession = {
  idToken: string;
  refreshToken: string;
  expiresAt: number;
};

function getStoredSession(): StoredSession | null {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return null;
    }
    const parsed = JSON.parse(storedValue) as Partial<StoredSession>;
    if (
      typeof parsed.idToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      idToken: parsed.idToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
const storedSession = getStoredSession();

const initialState: AuthState = {
  user: null,
  idToken: storedSession?.idToken ?? null,
  refreshToken: storedSession?.refreshToken ?? null,
  expiresAt: storedSession?.expiresAt ?? null,
  status: storedSession ? "loading" : "idle",
  initialized: false,
  error: null,
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

export const restoreSession = createAsyncThunk<
  {
    user: User;
    babies: Baby[];
    refreshed?: {
      idToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  },
  void,
  {
    state: RootState;
  }
>("auth/restoreSession", async (_, thunkApi) => {
  const { idToken, refreshToken, expiresAt } = thunkApi.getState().auth;

  if (!idToken || !refreshToken) {
    throw new Error("No saved token.");
  }

  const isExpiredOrExpiringSoon =
    !expiresAt || Date.now() >= expiresAt - REFRESH_BUFFER_MS;

  // The common case on a fresh page load: the stored idToken is already
  // past its ~1hr lifetime. Refresh first instead of calling
  // getCurrentUser with a token we know will 401 and log the user out.
  if (isExpiredOrExpiringSoon) {
    const refreshedTokens = await refreshAuthToken(refreshToken);

    const refreshed = {
      idToken: refreshedTokens.idToken,
      refreshToken: refreshedTokens.refreshToken,
      expiresAt: Date.now() + refreshedTokens.expiresIn * 1000,
    };

    saveSession(refreshed);

    const profile = await getCurrentUser(refreshed.idToken);
    return {
      user: profile.user,
      babies: profile.babies,
      refreshed,
    };
  }

  const profile = await getCurrentUser(idToken);

  return {
    user: profile.user,
    babies: profile.babies,
  };
});

function saveSession(session: {
  idToken: string;
  refreshToken: string;
  expiresAt: number;
}) {
  localStorage.setItem(
    STORAGE_KEY,

    JSON.stringify({
      idToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
    }),
  );
}

export const refreshSession = createAsyncThunk<
  {
    idToken: string;
    refreshToken: string;
    expiresAt: number;
  },
  void,
  {
    state: RootState;
  }
>("auth/refreshSession", async (_, thunkApi) => {
  const refreshToken = thunkApi.getState().auth.refreshToken;

  if (!refreshToken) {
    throw new Error("No refresh token.");
  }

  const session = await refreshAuthToken(refreshToken);

  return {
    idToken: session.idToken,
    refreshToken: session.refreshToken,
    expiresAt: Date.now() + session.expiresIn * 1000,
  };
});

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

    markAuthInitialized: (state) => {
      state.initialized = true;
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
        state.initialized = true;
        state.error = null;
        state.registrationDraft = null;

        saveSession(action.payload);
      })

      .addCase(registerAccount.rejected, (state, action) => {
        state.status = "error";

        state.error = action.payload ?? "Unable to register.";
      })

      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = "authenticated";
        state.error = null;
        state.initialized = true;
        if (action.payload.refreshed) {
          state.idToken = action.payload.refreshed.idToken;
          state.refreshToken = action.payload.refreshed.refreshToken;
          state.expiresAt = action.payload.refreshed.expiresAt;
        }
      })

      .addCase(restoreSession.rejected, (state, action) => {
        console.error("Restore session failed:", action.error);

        state.user = null;
        state.idToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.status = "idle";
        state.error = null;
        state.initialized = true;

        localStorage.removeItem("lullatrack-auth");
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
        state.initialized = true;
        state.error = null;

        saveSession(action.payload);
      })

      .addCase(refreshSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(refreshSession.fulfilled, (state, action) => {
        state.idToken = action.payload.idToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.status = "authenticated";
        state.error = null;
        state.initialized = true;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            idToken: action.payload.idToken,
            refreshToken: action.payload.refreshToken,
            expiresAt: action.payload.expiresAt,
          }),
        );
      })

      .addCase(refreshSession.rejected, (state) => {
        // NOW it is appropriate to log the user out.
        state.user = null;
        state.idToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.status = "idle";
        state.initialized = true;

        localStorage.removeItem(STORAGE_KEY);
      });
  },
});

export const {
  setRegistrationDraft,
  clearRegistrationDraft,
  signOutUser,
  clearAuthError,
  restoreUser,
  markAuthInitialized,
} = authSlice.actions;

export default authSlice.reducer;
