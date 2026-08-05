import type { Timestamp } from "firebase-admin/firestore";

export type BabyGender = "boy" | "girl";

export type FeedingMethod = "breastfeeding" | "bottle" | "combination";

export type Baby = {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: BabyGender;
  feedingMethod: FeedingMethod;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CreateBabyRequest = Pick<
  Baby,
  "userId" | "name" | "dateOfBirth" | "gender" | "feedingMethod"
>;

export type UpdateBabyRequest = Partial<
  Pick<Baby, "name" | "dateOfBirth" | "gender" | "feedingMethod">
>;
