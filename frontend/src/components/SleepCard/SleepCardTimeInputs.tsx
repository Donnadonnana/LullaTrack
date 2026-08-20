import { Box } from "@mui/material";

import SleepTimeInput from "../SleepTimeInput/SleepTimeInput";
import type { SleepLog } from "../../store/slices/sleepSlice";
import type { SleepDraft } from "../../types/sleepCard";

type SleepCardTimeInputsProps = {
  type: SleepLog["type"];
  draft: SleepDraft;
  onFieldChange: (field: keyof SleepDraft, value: string) => void;
};

export default function SleepCardTimeInputs({
  type,
  draft,
  onFieldChange,
}: SleepCardTimeInputsProps) {
  const isNap = type === "nap";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isNap
          ? {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            }
          : { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5,
        p: 1.5,
        borderRadius: 3,
        bgcolor: "rgba(238, 227, 216, 0.25)",
      }}
    >
      {type === "wake" && (
        <>
          <SleepTimeInput
            label="Woke up"
            value={draft.wakeTime}
            onChange={(value) => onFieldChange("wakeTime", value)}
            inline
          />
          <SleepTimeInput
            label="Picked up"
            value={draft.pickupTime}
            onChange={(value) => onFieldChange("pickupTime", value)}
            inline
          />
        </>
      )}

      {type === "night" && (
        <>
          <SleepTimeInput
            label="On bed"
            value={draft.onBedTime}
            onChange={(value) => onFieldChange("onBedTime", value)}
            inline
          />
          <SleepTimeInput
            label="Asleep"
            value={draft.asleepTime}
            onChange={(value) => onFieldChange("asleepTime", value)}
            inline
          />
        </>
      )}

      {type === "nap" && (
        <>
          <SleepTimeInput
            label="On bed"
            value={draft.onBedTime}
            onChange={(value) => onFieldChange("onBedTime", value)}
            inline
          />
          <SleepTimeInput
            label="Asleep"
            value={draft.asleepTime}
            onChange={(value) => onFieldChange("asleepTime", value)}
            inline
          />
          <SleepTimeInput
            label="Woke"
            value={draft.wakeTime}
            onChange={(value) => onFieldChange("wakeTime", value)}
            inline
          />
          <SleepTimeInput
            label="Picked up"
            value={draft.pickupTime}
            onChange={(value) => onFieldChange("pickupTime", value)}
            inline
          />
        </>
      )}
    </Box>
  );
}
