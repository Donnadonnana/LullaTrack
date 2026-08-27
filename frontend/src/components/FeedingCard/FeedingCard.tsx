import type { FeedingLog } from "../../store/slices/feedingSlice";

import BreastfeedingCard from "./BreastfeedingCard";
import BottleFeedingCard from "./BottleFeedingCard";

type FeedingCardProps = {
  log: FeedingLog;
};

export default function FeedingCard({ log }: FeedingCardProps) {
  if (log.type === "breastfeeding") {
    return <BreastfeedingCard log={log} />;
  }

  return <BottleFeedingCard log={log} />;
}
