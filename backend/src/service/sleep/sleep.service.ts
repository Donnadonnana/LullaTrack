import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service";

import type {
  CreateSleepLogRequest,
  SleepLog,
  UpdateSleepLogRequest,
} from "../../types/sleep.model";

@injectable()
export class SleepService {
  private readonly collectionName = "sleepLogs";

  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public async getByDate(
    userId: string,
    babyId: string,
    date: string,
  ): Promise<SleepLog[]> {
    const snapshot = await this.firebaseAdminService.db
      .collection(this.collectionName)
      .where("userId", "==", userId)
      .where("babyId", "==", babyId)
      .where("date", "==", date)
      .get();

    const logs = snapshot.docs.map(
      (document) =>
        ({
          id: document.id,
          ...document.data(),
        }) as SleepLog,
    );

    return logs.sort((first, second) => first.sleepNumber - second.sleepNumber);
  }

  public async getById(sleepLogId: string): Promise<SleepLog | null> {
    const snapshot = await this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(sleepLogId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as SleepLog;
  }

  public async create(data: CreateSleepLogRequest): Promise<SleepLog> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc();

    const timestamp = this.firebaseAdminService.fieldValue.serverTimestamp();

    await reference.set({
      ...data,
      onBedTime: "",
      asleepTime: "",
      wakeTime: "",
      pickupTime: "",
      notes: "",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return (await this.getById(reference.id)) as SleepLog;
  }

  public async update(
    sleepLogId: string,
    data: UpdateSleepLogRequest,
  ): Promise<SleepLog | null> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(sleepLogId);

    const existingLog = await reference.get();

    if (!existingLog.exists) {
      return null;
    }

    await reference.update({
      ...data,
      updatedAt: this.firebaseAdminService.fieldValue.serverTimestamp(),
    });

    return this.getById(sleepLogId);
  }

  public async delete(sleepLogId: string): Promise<boolean> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(sleepLogId);

    const existingLog = await reference.get();

    if (!existingLog.exists) {
      return false;
    }

    await reference.delete();

    return true;
  }
}
