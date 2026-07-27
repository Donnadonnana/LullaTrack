import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service";

import type {
  Baby,
  CreateBabyRequest,
  UpdateBabyRequest,
} from "../../types/baby.model";

@injectable()
export class BabyService {
  private readonly collectionName = "babies";

  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public async getAll(userId: string): Promise<Baby[]> {
    const snapshot = await this.firebaseAdminService.db
      .collection(this.collectionName)
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Baby[];
  }

  public async getById(babyId: string): Promise<Baby | null> {
    const snapshot = await this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(babyId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Baby;
  }

  public async create(data: CreateBabyRequest): Promise<Baby> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc();

    const timestamp = this.firebaseAdminService.fieldValue.serverTimestamp();

    await reference.set({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return (await this.getById(reference.id)) as Baby;
  }

  public async update(
    babyId: string,
    data: UpdateBabyRequest,
  ): Promise<Baby | null> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(babyId);

    const existingBaby = await reference.get();

    if (!existingBaby.exists) {
      return null;
    }

    await reference.update({
      ...data,
      updatedAt: this.firebaseAdminService.fieldValue.serverTimestamp(),
    });

    return this.getById(babyId);
  }

  public async delete(babyId: string): Promise<boolean> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(babyId);

    const existingBaby = await reference.get();

    if (!existingBaby.exists) {
      return false;
    }

    await reference.delete();

    return true;
  }
}
