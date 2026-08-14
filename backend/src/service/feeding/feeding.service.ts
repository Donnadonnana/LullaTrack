import { inject, injectable } from "inversify";

import { FirebaseAdminService } from "../firebase-admin/firebase-admin.service";

import type {
  CreateFeedingLogRequest,
  FeedingLog,
  UpdateFeedingLogRequest,
} from "../../types/feeding.model";

@injectable()
export class FeedingService {
  private readonly collectionName = "feedingLogs";

  constructor(
    @inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public async getByDate(
    userId: string,
    babyId: string,
    date: string,
  ): Promise<FeedingLog[]> {
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
        }) as FeedingLog,
    );

    // feedingNumber restarts per type (Breastfeeding 1 and Bottle 1 both
    // exist), so sorting by it would interleave the two. Sort by the actual
    // clock time instead; logs with no time yet go last.
    return logs.sort((first, second) =>
      (first.startTime || "99:99").localeCompare(second.startTime || "99:99"),
    );
  }

  public async getById(feedingLogId: string): Promise<FeedingLog | null> {
    const snapshot = await this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(feedingLogId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as FeedingLog;
  }

  public async create(data: CreateFeedingLogRequest): Promise<FeedingLog> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc();

    const timestamp = this.firebaseAdminService.fieldValue.serverTimestamp();

    // The two feeding types store different fields, so only write the ones
    // that belong to this type — otherwise every bottle doc carries an
    // unused `side` and every breastfeeding doc an unused `amountMl`.
    const typeSpecificFields =
      data.type === "breastfeeding"
        ? {
            endTime: "",
            side: "",
          }
        : {
            amountMl: null,
            milkType: "",
          };

    await reference.set({
      ...data,
      startTime: "",
      ...typeSpecificFields,
      notes: "",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return (await this.getById(reference.id)) as FeedingLog;
  }

  public async update(
    feedingLogId: string,
    data: UpdateFeedingLogRequest,
  ): Promise<FeedingLog | null> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(feedingLogId);

    const existingLog = await reference.get();

    if (!existingLog.exists) {
      return null;
    }

    await reference.update({
      ...data,
      updatedAt: this.firebaseAdminService.fieldValue.serverTimestamp(),
    });

    return this.getById(feedingLogId);
  }

  public async delete(feedingLogId: string): Promise<boolean> {
    const reference = this.firebaseAdminService.db
      .collection(this.collectionName)
      .doc(feedingLogId);

    const existingLog = await reference.get();

    if (!existingLog.exists) {
      return false;
    }

    await reference.delete();

    return true;
  }
}
