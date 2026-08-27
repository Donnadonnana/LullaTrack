import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service";

import type {
  Baby,
  CreateBabyRequest,
  UpdateBabyRequest,
} from "../../types/baby.model";

@injectable()
export class BabyService {
  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  private babiesCollection(userId: string) {
    return this.firebaseAdminService.db
      .collection("users")
      .doc(userId)
      .collection("babies");
  }

  public async getAll(userId: string): Promise<Baby[]> {
    const snapshot = await this.babiesCollection(userId).get();

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Baby[];
  }

  public async getById(userId: string, babyId: string): Promise<Baby | null> {
    const snapshot = await this.babiesCollection(userId).doc(babyId).get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Baby;
  }

  public async create(
    userId: string,
    data: Omit<CreateBabyRequest, "userId">,
  ): Promise<Baby> {
    const reference = this.babiesCollection(userId).doc();

    const timestamp = this.firebaseAdminService.fieldValue.serverTimestamp();

    await reference.set({
      ...data,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return (await this.getById(userId, reference.id)) as Baby;
  }

  public async update(
    userId: string,
    babyId: string,
    data: UpdateBabyRequest,
  ): Promise<Baby | null> {
    const reference = this.babiesCollection(userId).doc(babyId);

    const existingBaby = await reference.get();

    if (!existingBaby.exists) {
      return null;
    }

    await reference.update({
      ...data,
      updatedAt: this.firebaseAdminService.fieldValue.serverTimestamp(),
    });

    return this.getById(userId, babyId);
  }

  public async delete(userId: string, babyId: string): Promise<boolean> {
    const reference = this.babiesCollection(userId).doc(babyId);

    const existingBaby = await reference.get();

    if (!existingBaby.exists) {
      return false;
    }

    await reference.delete();

    return true;
  }
}
