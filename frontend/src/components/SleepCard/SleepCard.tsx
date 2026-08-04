import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import {
  deleteSleepLog,
  saveSleepLog,
  type SleepLog,
} from "../../store/slices/sleepSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SleepTimeInput from "../SleepTimeInput/SleepTimeInput";
import { calculateDuration, formatDuration } from "../../utils/time";

type SleepCardProps = {
  log: SleepLog;
  babyName: string;
};

type SleepDraft = Pick<
  SleepLog,
  "onBedTime" | "asleepTime" | "wakeTime" | "pickupTime" | "notes"
>;

export default function SleepCard({ log, babyName }: SleepCardProps) {
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

  const [showNotes, setShowNotes] = useState(Boolean(log.notes));

  useEffect(() => {
    setDraft({
      onBedTime: log.onBedTime,
      asleepTime: log.asleepTime,
      wakeTime: log.wakeTime,
      pickupTime: log.pickupTime,
      notes: log.notes ?? "",
    });
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

  const sleepDuration = calculateDuration(draft.asleepTime, draft.wakeTime);

  const isNap = log.type === "nap";

  const sleepTitle = isNap ? `Nap ${log.sleepNumber}` : "Night Sleep";

  const updateField = (field: keyof SleepDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    try {
      await dispatch(
        saveSleepLog({
          id: log.id,
          changes: draft,
        }),
      ).unwrap();
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
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          {/* Your existing header */}

          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
              }}
            >
              {/* Keep your existing icon here */}

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {sleepTitle}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Track {babyName}&apos;s sleep
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              {sleepDuration !== null && (
                <Chip
                  label={`${formatDuration(sleepDuration)} asleep`}
                  color="primary"
                  variant="outlined"
                />
              )}

              <IconButton
                aria-label={`Delete ${sleepTitle}`}
                disabled={isDeleting}
                onClick={() => void handleDelete()}
              >
                {isDeleting ? (
                  <CircularProgress size={20} />
                ) : (
                  <DeleteOutlineOutlinedIcon />
                )}
              </IconButton>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <SleepTimeInput
              label={`${babyName} on bed`}
              value={draft.onBedTime}
              onChange={(value) => updateField("onBedTime", value)}
            />

            <SleepTimeInput
              label={`${babyName} fell asleep`}
              value={draft.asleepTime}
              onChange={(value) => updateField("asleepTime", value)}
            />

            <SleepTimeInput
              label={`${babyName} woke up`}
              value={draft.wakeTime}
              onChange={(value) => updateField("wakeTime", value)}
            />

            <SleepTimeInput
              label={`${babyName} picked up`}
              value={draft.pickupTime}
              onChange={(value) => updateField("pickupTime", value)}
            />
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
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {showNotes ? "Hide notes" : "+ Add notes"}
          </Typography>

          <Collapse in={showNotes}>
            <TextField
              label="Wake-ups, feeding, or other notes"
              placeholder={`${babyName} woke at 12:15 and fed for 10 minutes…`}
              value={draft.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
          </Collapse>

          {sleepDuration !== null && (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(165, 216, 255, 0.15)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {babyName} slept for {formatDuration(sleepDuration)}
              </Typography>

              {draft.asleepTime && draft.wakeTime && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  From {draft.asleepTime} to {draft.wakeTime}
                </Typography>
              )}
            </Box>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {hasChanges && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Unsaved changes
              </Typography>
            )}

            <Button
              variant="contained"
              disabled={!hasChanges || isSaving || isDeleting}
              onClick={() => void handleSave()}
              startIcon={
                isSaving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
