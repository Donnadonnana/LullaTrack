import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Collapse,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";

import {
  deleteFeedingLog,
  saveFeedingLog,
  type BottleFeedingLog,
  type BottleMilkType,
} from "../../store/slices/feedingSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import TimeInput from "../SleepTimeInput/SleepTimeInput";
import FeedingCardShell from "./FeedingCardShell";
import { FONT_DISPLAY } from "../../theme/theme";

type BottleFeedingCardProps = {
  log: BottleFeedingLog;
};

type BottleDraft = Pick<
  BottleFeedingLog,
  "startTime" | "amountMl" | "milkType" | "notes"
>;

const milkTypeOptions: { value: BottleMilkType; label: string }[] = [
  { value: "breast-milk", label: "Breast milk" },
  { value: "formula", label: "Formula" },
  { value: "combination", label: "Combination" },
];

export default function BottleFeedingCard({ log }: BottleFeedingCardProps) {
  const dispatch = useAppDispatch();
  const { nursery } = useTheme().palette;

  const isSaving = useAppSelector((state) =>
    state.feeding.savingIds.includes(log.id),
  );

  const isDeleting = useAppSelector((state) =>
    state.feeding.deletingIds.includes(log.id),
  );

  const [draft, setDraft] = useState<BottleDraft>({
    startTime: log.startTime,
    amountMl: log.amountMl,
    milkType: log.milkType,
    notes: log.notes,
  });

  const [showNotes, setShowNotes] = useState(Boolean(log.notes));

  useEffect(() => {
    setDraft({
      startTime: log.startTime,
      amountMl: log.amountMl,
      milkType: log.milkType,
      notes: log.notes,
    });
  }, [log]);

  const hasChanges = useMemo(() => {
    return (
      draft.startTime !== log.startTime ||
      draft.amountMl !== log.amountMl ||
      draft.milkType !== log.milkType ||
      draft.notes !== log.notes
    );
  }, [draft, log]);

  const isComplete = Boolean(log.startTime) && log.amountMl !== null;

  const updateField = <K extends keyof BottleDraft>(
    field: K,
    value: BottleDraft[K],
  ) => {
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

  const summary = (
    <>
      {draft.startTime && (
        <>
          <Typography sx={{ color: "text.disabled" }}>·</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            {draft.startTime}
          </Typography>
        </>
      )}

      <Typography sx={{ color: "text.disabled" }}>·</Typography>

      <Typography
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 15,
          color: draft.amountMl !== null ? nursery.sun : "text.secondary",
        }}
      >
        {draft.amountMl !== null ? `${draft.amountMl} ml` : "No amount yet"}
      </Typography>
    </>
  );

  return (
    <FeedingCardShell
      title={`Bottle ${log.feedingNumber}`}
      icon={<LocalDrinkRoundedIcon sx={{ fontSize: 20 }} />}
      accent={nursery.sun}
      accentTint={nursery.sunTint}
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

        <TextField
          label="Amount"
          type="number"
          size="small"
          value={draft.amountMl ?? ""}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">ml</InputAdornment>,
            },
            htmlInput: { min: 0, step: 5 },
          }}
          onChange={(event) => {
            const value = event.target.value;
            updateField("amountMl", value === "" ? null : Number(value));
          }}
        />
      </Box>

      <Box>
        <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 0.75 }}>
          Milk type
        </Typography>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={draft.milkType || null}
          onChange={(_, value) =>
            updateField("milkType", (value ?? "") as BottleMilkType)
          }
          sx={{
            flexWrap: "wrap",

            "& .MuiToggleButton-root": {
              px: 2,
              borderRadius: 999,
              borderColor: "divider",
              color: "text.secondary",
              textTransform: "none",

              "&.Mui-selected": {
                bgcolor: nursery.sunTint,
                color: nursery.sun,
                fontWeight: 700,

                "&:hover": { bgcolor: nursery.sunTint },
              },
            },
          }}
        >
          {milkTypeOptions.map((option) => (
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
          label="Spit-up, burping, or notes"
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
