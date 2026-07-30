import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service.js";
import type {
  RegisterRequest,
  RegisterResponse,
} from "../../types/auth.model.js";

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
}
