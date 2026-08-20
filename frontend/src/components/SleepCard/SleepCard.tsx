import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import {
  deleteSleepLog,
  saveSleepLog,
  type SleepLog,
} from "../../store/slices/sleepSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { calculateDuration } from "../../utils/time";

import {
  isLogComplete,
  isInProgress,
  type SleepDraft,
} from "../../types/sleepCard";
import { useSleepCardAccent } from "./useSleepCardAccent";
import SleepCardHeader from "./SleepCardHeader";
import SleepCardTimeInputs from "./SleepCardTimeInputs";
import SleepCardNotes from "./SleepCardNotes";
import { FooterSummary } from "./SleepCardSummary";

type SleepCardProps = {
  log: SleepLog;
  babyName: string;
};

export default function SleepCard({ log }: SleepCardProps) {
  const dispatch = useAppDispatch();

  const isSaving = useAppSelector((state) =>
    state.sleep.savingIds.includes(log.id),
  );
  const isDeleting = useAppSelector((state) =>
    state.sleep.deletingIds.includes(log.id),
  );

  const [draft, setDraft] = useState<SleepDraft>({
    onBedTime: log.onBedTime,
    asleepTime: log.asleepTime,
    wakeTime: log.wakeTime,
    pickupTime: log.pickupTime,
    notes: log.notes ?? "",
  });

  const [isExpanded, setIsExpanded] = useState(
    !isLogComplete(log.type, {
      onBedTime: log.onBedTime,
      asleepTime: log.asleepTime,
      wakeTime: log.wakeTime,
      pickupTime: log.pickupTime,
      notes: log.notes ?? "",
    }),
  );

  const [showNotes, setShowNotes] = useState(Boolean(log.notes));

  useEffect(() => {
    const nextDraft: SleepDraft = {
      onBedTime: log.onBedTime,
      asleepTime: log.asleepTime,
      wakeTime: log.wakeTime,
      pickupTime: log.pickupTime,
      notes: log.notes ?? "",
    };

    setDraft(nextDraft);

    if (!isLogComplete(log.type, nextDraft)) {
      setIsExpanded(true);
    }
  }, [log]);

  const hasChanges = useMemo(() => {
    return (
      draft.onBedTime !== log.onBedTime ||
      draft.asleepTime !== log.asleepTime ||
      draft.wakeTime !== log.wakeTime ||
      draft.pickupTime !== log.pickupTime ||
      draft.notes !== (log.notes ?? "")
    );
  }, [draft, log]);

  const { icon, accent, accentTint, accentHover, title } =
    useSleepCardAccent(log);
  const inProgress = isInProgress(log.type, draft);

  const wakeDurationValue =
    log.type === "wake"
      ? calculateDuration(draft.wakeTime, draft.pickupTime)
      : null;

  const napSleepMinutes =
    log.type === "nap"
      ? calculateDuration(draft.asleepTime, draft.wakeTime)
      : null;

  const napInBedMinutes =
    log.type === "nap"
      ? calculateDuration(draft.onBedTime, draft.pickupTime)
      : null;

  const updateField = (field: keyof SleepDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    try {
      const savedLog = await dispatch(
        saveSleepLog({ id: log.id, changes: draft }),
      ).unwrap();

      const savedDraft: SleepDraft = {
        onBedTime: savedLog.onBedTime,
        asleepTime: savedLog.asleepTime,
        wakeTime: savedLog.wakeTime,
        pickupTime: savedLog.pickupTime,
        notes: savedLog.notes ?? "",
      };

      if (isLogComplete(savedLog.type, savedDraft)) {
        setIsExpanded(false);
      }
    } catch (error) {
      console.error("Unable to save sleep log:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteSleepLog(log.id)).unwrap();
    } catch (error) {
      console.error("Unable to delete sleep log:", error);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "visible",
        borderRadius: 1,
        boxShadow: isExpanded ? "0 8px 24px rgba(58, 52, 80, 0.06)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <CardContent
        sx={{
          p: isExpanded ? 2.5 : 1.5,
          "&:last-child": { pb: isExpanded ? 2.5 : 1.5 },
        }}
      >
        <Stack spacing={isExpanded ? 2 : 0}>
          <SleepCardHeader
            type={log.type}
            draft={draft}
            title={title}
            icon={icon}
            accent={accent}
            accentTint={accentTint}
            isExpanded={isExpanded}
            inProgress={inProgress}
            hasChanges={hasChanges}
            isDeleting={isDeleting}
            napSleepMinutes={napSleepMinutes}
            napInBedMinutes={napInBedMinutes}
            wakeDurationValue={wakeDurationValue}
            onToggleExpand={() => setIsExpanded((current) => !current)}
            onDelete={() => void handleDelete()}
          />

          <Collapse in={isExpanded} unmountOnExit>
            <Stack spacing={2}>
              <SleepCardTimeInputs
                type={log.type}
                draft={draft}
                onFieldChange={updateField}
              />

              {log.type === "nap" &&
                !napSleepMinutes &&
                draft.onBedTime &&
                draft.pickupTime && (
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "text.secondary",
                      fontStyle: "italic",
                    }}
                  >
                    No asleep/woke time entered — this nap will be tracked as
                    time in bed only.
                  </Typography>
                )}

              <SleepCardNotes
                notes={draft.notes}
                showNotes={showNotes}
                onToggle={() => setShowNotes((current) => !current)}
                onChange={(value) => updateField("notes", value)}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <FooterSummary
                    type={log.type}
                    draft={draft}
                    accent={accent}
                    napSleepMinutes={napSleepMinutes}
                    napInBedMinutes={napInBedMinutes}
                    wakeDurationValue={wakeDurationValue}
                  />
                </Box>

                <Button
                  disableElevation
                  variant="contained"
                  disabled={!hasChanges || isSaving || isDeleting}
                  onClick={() => void handleSave()}
                  startIcon={
                    isSaving ? (
                      <CircularProgress size={16} sx={{ color: "#fff" }} />
                    ) : undefined
                  }
                  sx={{
                    borderRadius: 999,
                    bgcolor: accent,
                    "&:hover": { bgcolor: accentHover },
                    alignSelf: { xs: "stretch", sm: "auto" },
                  }}
                >
                  {isSaving ? "Saving…" : "Save"}
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
