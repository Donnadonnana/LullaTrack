import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service.js";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  FirebaseLoginResponse,
  FirebaseAuthErrorResponse,
} from "../../types/auth.model.js";
import { defineSecret } from "firebase-functions/params";

@injectable()
export class AuthService {
  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public async register(request: RegisterRequest): Promise<RegisterResponse> {
    const { email, password, user, baby } = request;

    const authUser = await this.firebaseAdminService.auth.createUser({
      email,
      password,
      displayName: `${user.firstName} ${user.lastName}`.trim(),
    });

    try {
      const userRef = this.firebaseAdminService.db
        .collection("users")
        .doc(authUser.uid);

      const babyRef = userRef.collection("babies").doc();

      const timestamp = this.firebaseAdminService.fieldValue.serverTimestamp();

      const userData = {
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const babyData = {
        name: baby.name,
        dateOfBirth: baby.dateOfBirth,
        gender: baby.gender,
        feedingMethod: baby.feedingMethod,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const batch = this.firebaseAdminService.db.batch();

      batch.set(userRef, userData);
      batch.set(babyRef, babyData);

      await batch.commit();

      return {
        user: {
          id: authUser.uid,
          email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        baby: {
          id: babyRef.id,
          name: baby.name,
          dateOfBirth: baby.dateOfBirth,
          gender: baby.gender,
          feedingMethod: baby.feedingMethod,
        },
      };
    } catch (error) {
      // Firebase Authentication and Firestore cannot participate
      // in the same transaction. Remove the Auth user if Firestore
      // registration fails.
      await this.firebaseAdminService.auth
        .deleteUser(authUser.uid)
        .catch(() => undefined);

      throw error;
    }
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;
    if (!email?.trim() || !password) {
      throw new Error("Email and password are required.");
    }

    const firebaseApiKey = defineSecret("LULLATRACK_FIREBASE_API_KEY");

    const apiKey = firebaseApiKey.value();

    if (!apiKey) {
      throw new Error("LULLATRACK_FIREBASE_API_KEY is not configured.");
    }

    const authBaseUrl = process.env.LULLATRACK_FIREBASE_AUTH_EMULATOR_HOST
      ? `http://${process.env.LULLATRACK_FIREBASE_AUTH_EMULATOR_HOST}`
      : "https://identitytoolkit.googleapis.com";
    const response = await fetch(
      `${authBaseUrl}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          returnSecureToken: true,
        }),
      },
    );
    const result = (await response.json()) as
      | FirebaseLoginResponse
      | FirebaseAuthErrorResponse;
    if (!response.ok || !("idToken" in result)) {
      const firebaseMessage =
        "error" in result ? result.error?.message : undefined;

      throw new Error(this.getLoginErrorMessage(firebaseMessage));
    }
    return {
      user: {
        id: result.localId,
        email: result.email,
        displayName: result.displayName ?? null,
      },
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: Number(result.expiresIn),
    };
  }

  private getLoginErrorMessage(firebaseMessage?: string): string {
    switch (firebaseMessage) {
      case "EMAIL_NOT_FOUND":
      case "INVALID_PASSWORD":
      case "INVALID_LOGIN_CREDENTIALS":
        return "Invalid email or password.";

      case "USER_DISABLED":
        return "This account has been disabled.";

      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        return "Too many login attempts. Please try again later.";

      default:
        return "Unable to sign in.";
    }
  }
}
