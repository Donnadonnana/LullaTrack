import { useState } from "react";

import {
  Box,
  Collapse,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";

import type {
  BreastSide,
  BreastfeedingLog,
} from "../../store/slices/feedingSlice";

import { calculateFeedingDuration } from "../../utils/time";
import { formatMinutes } from "../../utils/reports";

import TimeInput from "../SleepTimeInput/SleepTimeInput";
import FeedingCardShell from "./FeedingCardShell";
import { FONT_DISPLAY } from "../../theme/theme";

type BreastfeedingCardProps = {
  log: BreastfeedingLog;
  onUpdate: (changes: Partial<BreastfeedingLog>) => void;
  onDelete: () => void;
};

const sideOptions: { value: BreastSide; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "both", label: "Both" },
];

export default function BreastfeedingCard({
  log,
  onUpdate,
  onDelete,
}: BreastfeedingCardProps) {
  const { nursery } = useTheme().palette;

  const [showNotes, setShowNotes] = useState(Boolean(log.notes));

  const duration = calculateFeedingDuration(log.startTime, log.endTime);
  const isComplete = Boolean(log.startTime && log.endTime);

  const summary =
    duration !== null ? (
      <>
        <Typography sx={{ color: "text.disabled" }}>·</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          {log.startTime}–{log.endTime}
        </Typography>
        <Typography sx={{ color: "text.disabled" }}>·</Typography>
        <Typography
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 15,
            color: nursery.sage,
          }}
        >
          {formatMinutes(duration)}
        </Typography>
      </>
    ) : (
      <>
        <Typography sx={{ color: "text.disabled" }}>·</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          In progress
        </Typography>
      </>
    );

  return (
    <FeedingCardShell
      title={`Breastfeeding ${log.feedingNumber}`}
      icon={<ChildCareRoundedIcon sx={{ fontSize: 20 }} />}
      accent={nursery.sage}
      accentTint={nursery.sageTint}
      summary={summary}
      isComplete={isComplete}
      onDelete={onDelete}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 1.5,
            p: 1.5,
            borderRadius: 3,
            bgcolor: nursery.panelTint,
          }}
        >
          <TimeInput
            label="Started"
            value={log.startTime}
            onChange={(value) => onUpdate({ startTime: value })}
            inline
          />

          <TimeInput
            label="Ended"
            value={log.endTime}
            onChange={(value) => onUpdate({ endTime: value })}
            inline
          />
        </Box>

        <Box>
          <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 0.75 }}>
            Side
          </Typography>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={log.side || null}
            onChange={(_, value) =>
              onUpdate({ side: (value ?? "") as BreastSide })
            }
            sx={{
              "& .MuiToggleButton-root": {
                px: 2,
                borderRadius: 999,
                borderColor: "divider",
                color: "text.secondary",
                textTransform: "none",

                "&.Mui-selected": {
                  bgcolor: nursery.sageTint,
                  color: nursery.sage,
                  fontWeight: 700,

                  "&:hover": { bgcolor: nursery.sageTint },
                },
              },
            }}
          >
            {sideOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Typography
          component="button"
          type="button"
          onClick={() => setShowNotes((current) => !current)}
          sx={{
            alignSelf: "flex-start",
            border: 0,
            p: 0,
            bgcolor: "transparent",
            color: "primary.main",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {showNotes ? "Hide notes" : "+ Add notes"}
        </Typography>

        <Collapse in={showNotes}>
          <TextField
            label="Latch, fussiness, or notes"
            value={log.notes}
            onChange={(event) => onUpdate({ notes: event.target.value })}
            multiline
            minRows={2}
            maxRows={4}
            size="small"
            fullWidth
          />
        </Collapse>
      </Stack>
    </FeedingCardShell>
  );
}
