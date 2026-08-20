import { Box, Typography } from "@mui/material";

import type { SleepLog } from "../../store/slices/sleepSlice";
import type { SleepDraft } from "../../types/sleepCard";
import { formatDuration } from "../../utils/time";

const FONT_DISPLAY = "'Fraunces', Georgia, serif";

type SummaryData = {
  type: SleepLog["type"];
  draft: SleepDraft;
  accent: string;
  napSleepMinutes: number | null;
  napInBedMinutes: number | null;
  wakeDurationValue: number | null;
};

/** Compact dot-separated line shown next to the title when collapsed. */
export function CollapsedSummary({
  type,
  draft,
  accent,
  napSleepMinutes,
  napInBedMinutes,
}: SummaryData) {
  if (type === "wake") {
    if (!draft.pickupTime) {
      return null;
    }

    return (
      <Typography
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 15,
          color: accent,
        }}
      >
        {draft.pickupTime}
      </Typography>
    );
  }

  if (type === "night") {
    if (!draft.onBedTime || !draft.asleepTime) {
      return null;
    }

    return (
      <>
        <Typography sx={{ color: "text.disabled" }}>·</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          Down {draft.onBedTime} · Asleep {draft.asleepTime}
        </Typography>
      </>
    );
  }

  // Nap
  if (napInBedMinutes === null) {
    return null;
  }

  return (
    <>
      <Typography sx={{ color: "text.disabled" }}>·</Typography>

      {napSleepMinutes !== null ? (
        <>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              fontSize: 15,
              color: accent,
            }}
          >
            Slept {formatDuration(napSleepMinutes)}
          </Typography>
          <Typography sx={{ color: "text.disabled" }}>·</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            In bed {formatDuration(napInBedMinutes)}
          </Typography>
        </>
      ) : (
        <Typography
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 15,
            color: "text.secondary",
          }}
        >
          In bed {formatDuration(napInBedMinutes)} · didn't fall asleep
        </Typography>
      )}
    </>
  );
}

/** Full-sentence version shown in the expanded footer. */
export function FooterSummary({
  type,
  draft,
  napSleepMinutes,
  napInBedMinutes,
  wakeDurationValue,
}: SummaryData) {
  if (type === "wake" && wakeDurationValue !== null) {
    return (
      <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
        Awake before pickup{" "}
        <Box
          component="span"
          sx={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}
        >
          {formatDuration(wakeDurationValue)}
        </Box>{" "}
        · {draft.wakeTime}–{draft.pickupTime}
      </Typography>
    );
  }

  if (type === "night" && draft.onBedTime && draft.asleepTime) {
    return (
      <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
        Down at{" "}
        <Box
          component="span"
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {draft.onBedTime}
        </Box>{" "}
        · Asleep by {draft.asleepTime}
      </Typography>
    );
  }

  if (type === "nap" && napInBedMinutes !== null) {
    return (
      <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
        {napSleepMinutes !== null ? (
          <>
            Slept{" "}
            <Box
              component="span"
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {formatDuration(napSleepMinutes)}
            </Box>{" "}
            · In bed{" "}
            <Box
              component="span"
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {formatDuration(napInBedMinutes)}
            </Box>
          </>
        ) : (
          <>
            In bed{" "}
            <Box
              component="span"
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {formatDuration(napInBedMinutes)}
            </Box>{" "}
            · didn't fall asleep
          </>
        )}
      </Typography>
    );
  }

  return null;
}
