import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Collapse,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";

import {
  deleteFeedingLog,
  saveFeedingLog,
  type BreastSide,
  type BreastfeedingLog,
} from "../../store/slices/feedingSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { calculateFeedingDuration } from "../../utils/time";
import { formatMinutes } from "../../utils/reports";

import TimeInput from "../SleepTimeInput/SleepTimeInput";
import FeedingCardShell from "./FeedingCardShell";
import { FONT_DISPLAY } from "../../theme/theme";

type BreastfeedingCardProps = {
  log: BreastfeedingLog;
};

type BreastfeedingDraft = Pick<
  BreastfeedingLog,
  "startTime" | "endTime" | "side" | "notes"
>;

const sideOptions: { value: BreastSide; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "both", label: "Both" },
];

export default function BreastfeedingCard({ log }: BreastfeedingCardProps) {
  const dispatch = useAppDispatch();
  const { nursery } = useTheme().palette;

  const isSaving = useAppSelector((state) =>
    state.feeding.savingIds.includes(log.id),
  );

  const isDeleting = useAppSelector((state) =>
    state.feeding.deletingIds.includes(log.id),
  );

  const [draft, setDraft] = useState<BreastfeedingDraft>({
    startTime: log.startTime,
    endTime: log.endTime,
    side: log.side,
    notes: log.notes,
  });

  const [showNotes, setShowNotes] = useState(Boolean(log.notes));

  useEffect(() => {
    setDraft({
      startTime: log.startTime,
      endTime: log.endTime,
      side: log.side,
      notes: log.notes,
    });
  }, [log]);

  const hasChanges = useMemo(() => {
    return (
      draft.startTime !== log.startTime ||
      draft.endTime !== log.endTime ||
      draft.side !== log.side ||
      draft.notes !== log.notes
    );
  }, [draft, log]);

  const duration = calculateFeedingDuration(draft.startTime, draft.endTime);
  const isComplete = Boolean(log.startTime && log.endTime);

  const updateField = (field: keyof BreastfeedingDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    if (!hasChanges) {
      return;
    }

    void dispatch(saveFeedingLog({ id: log.id, changes: draft }));
  };

  const handleDelete = () => {
    void dispatch(deleteFeedingLog(log.id));
  };

  const summary =
    duration !== null ? (
      <>
        <Typography sx={{ color: "text.disabled" }}>·</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          {draft.startTime}–{draft.endTime}
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
      hasChanges={hasChanges}
      isSaving={isSaving}
      isDeleting={isDeleting}
      onSave={handleSave}
      onDelete={handleDelete}
    >
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
          value={draft.startTime}
          onChange={(value) => updateField("startTime", value)}
          inline
        />

        <TimeInput
          label="Ended"
          value={draft.endTime}
          onChange={(value) => updateField("endTime", value)}
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
          value={draft.side || null}
          onChange={(_, value) =>
            updateField("side", (value ?? "") as BreastSide)
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
          value={draft.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          multiline
          minRows={2}
          maxRows={4}
          size="small"
          fullWidth
        />
      </Collapse>
    </FeedingCardShell>
  );
}
