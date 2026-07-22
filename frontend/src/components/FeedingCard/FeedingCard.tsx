import type { FeedingLog } from "../../store/slices/feedingSlice";

import BreastfeedingCard from "./BreastfeedingCard";
import BottleFeedingCard from "./BottleFeedingCard";

type FeedingCardProps = {
  log: FeedingLog;
  onUpdate: (changes: Partial<FeedingLog>) => void;
  onDelete: () => void;
};

export default function FeedingCard({
  log,
  onUpdate,
  onDelete,
}: FeedingCardProps) {
  if (log.type === "breastfeeding") {
    return (
      <BreastfeedingCard log={log} onUpdate={onUpdate} onDelete={onDelete} />
    );
  }

  return (
    <BottleFeedingCard log={log} onUpdate={onUpdate} onDelete={onDelete} />
  );
}
