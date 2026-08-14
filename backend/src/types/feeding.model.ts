export type FeedingType = "breastfeeding" | "bottle";

export type BreastSide = "" | "left" | "right" | "both";

export type BottleMilkType = "" | "breast-milk" | "formula" | "combination";

type FeedingLogBase = {
  id: string;
  userId: string;
  babyId: string;
  date: string;
  feedingNumber: number;
  startTime: string;
  notes: string;
};

export type BreastfeedingLog = FeedingLogBase & {
  type: "breastfeeding";
  endTime: string;
  side: BreastSide;
};

export type BottleFeedingLog = FeedingLogBase & {
  type: "bottle";
  amountMl: number | null;
  milkType: BottleMilkType;
};

export type FeedingLog = BreastfeedingLog | BottleFeedingLog;

export type CreateFeedingLogRequest = {
  userId: string;
  babyId: string;
  date: string;
  type: FeedingType;
  feedingNumber: number;
};

export type UpdateFeedingLogRequest = Partial<{
  startTime: string;
  endTime: string;
  side: BreastSide;
  amountMl: number | null;
  milkType: BottleMilkType;
  notes: string;
}>;
