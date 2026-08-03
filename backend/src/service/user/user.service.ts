import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service.js";

import type { UpdateUserRequest, User } from "../../types/user.model.js";

@injectable()
export class UserService {
  private readonly collectionName = "users";

  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public async getById(userId: string): Promise<User | null> {
    const snapshot = await this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(userId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as User;
  }

  public async update(
    userId: string,
    data: UpdateUserRequest,
  ): Promise<User | null> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(userId);

    const existingUser = await reference.get();

    if (!existingUser.exists) {
      return null;
    }

    const allowedUpdates: UpdateUserRequest = {};

    if (data.firstName !== undefined) {
      allowedUpdates.firstName = data.firstName.trim();
    }

    if (data.lastName !== undefined) {
      allowedUpdates.lastName = data.lastName.trim();
    }

    await reference.update({
      ...allowedUpdates,
      updatedAt: this.firebaseAdminService.fieldValue.serverTimestamp(),
    });

    return this.getById(userId);
  }
}
