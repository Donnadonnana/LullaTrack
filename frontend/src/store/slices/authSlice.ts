import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, registerUser } from "../../api/authApi";
import type { RootState } from "../store";
import type { LoginRequest, RegisterRequest, User } from "../../types/auth";
import type { Baby } from "./babySlice";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";
const STORAGE_KEY = "lullatrack-auth";

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
  },
  void,
  {
    state: RootState;
  }
>("auth/restoreSession", async (_, thunkApi) => {
  const idToken = thunkApi.getState().auth.idToken;
  if (!idToken) {
    throw new Error("No saved token.");
  }
  return getCurrentUser(idToken);
});

function saveSession(session: AuthSession) {
  localStorage.setItem(
    STORAGE_KEY,

    JSON.stringify({
      idToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
    }),
  );
}

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
