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
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { useEffect, useMemo, useState } from "react";

import {
  deleteSleepLog,
  saveSleepLog,
  type SleepLog,
} from "../../store/slices/sleepSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

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

function isSleepComplete(sleep: SleepDraft): boolean {
  return Boolean(
    sleep.onBedTime && sleep.asleepTime && sleep.wakeTime && sleep.pickupTime,
  );
}

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

  const [isExpanded, setIsExpanded] = useState(
    !isSleepComplete({
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

    if (!isSleepComplete(nextDraft)) {
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

  const sleepDuration = calculateDuration(draft.asleepTime, draft.wakeTime);

  const isNap = log.type === "nap";

  const sleepTitle = isNap ? `Nap ${log.sleepNumber}` : "Night sleep";

  const complete = isSleepComplete(draft);

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
      const savedLog = await dispatch(
        saveSleepLog({
          id: log.id,
          changes: draft,
        }),
      ).unwrap();

      const savedDraft: SleepDraft = {
        onBedTime: savedLog.onBedTime,
        asleepTime: savedLog.asleepTime,
        wakeTime: savedLog.wakeTime,
        pickupTime: savedLog.pickupTime,
        notes: savedLog.notes ?? "",
      };

      if (isSleepComplete(savedDraft)) {
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
        borderRadius: 3,
      }}
    >
      <CardContent
        sx={{
          p: isExpanded ? 2 : 1.25,

          "&:last-child": {
            pb: isExpanded ? 2 : 1.25,
          },
        }}
      >
        <Stack spacing={isExpanded ? 1.5 : 0}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 38,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  bgcolor: isNap
                    ? "rgba(255, 214, 165, 0.25)"
                    : "rgba(154, 140, 255, 0.18)",
                }}
              >
                {isNap ? (
                  <LightModeOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: "warning.main",
                    }}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: "primary.main",
                    }}
                  />
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {sleepTitle}
                  </Typography>

                  {!isExpanded && sleepDuration !== null && (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        ·
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        {draft.asleepTime}–{draft.wakeTime}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        ·
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                        }}
                      >
                        {formatDuration(sleepDuration)}
                      </Typography>
                    </>
                  )}
                </Stack>

                {!isExpanded && draft.notes && (
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      display: "block",
                      color: "text.secondary",
                      maxWidth: {
                        xs: 180,
                        sm: 420,
                      },
                    }}
                  >
                    {draft.notes}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {hasChanges && (
                <Chip
                  label="Unsaved"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}

              <Tooltip title={isExpanded ? "Collapse" : "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded((current) => !current)}
                >
                  {isExpanded ? (
                    <ExpandLessOutlinedIcon fontSize="small" />
                  ) : (
                    <EditOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                >
                  {isDeleting ? (
                    <CircularProgress size={18} />
                  ) : (
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Collapse in={isExpanded} unmountOnExit>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.25,
                }}
              >
                <SleepTimeInput
                  label="On bed"
                  value={draft.onBedTime}
                  onChange={(value) => updateField("onBedTime", value)}
                  inline
                />

                <SleepTimeInput
                  label="Asleep"
                  value={draft.asleepTime}
                  onChange={(value) => updateField("asleepTime", value)}
                  inline
                />

                <SleepTimeInput
                  label="Woke"
                  value={draft.wakeTime}
                  onChange={(value) => updateField("wakeTime", value)}
                  inline
                />

                <SleepTimeInput
                  label="Picked up"
                  value={draft.pickupTime}
                  onChange={(value) => updateField("pickupTime", value)}
                  inline
                />
              </Box>

              <Typography
                variant="caption"
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
                  label="Wake-ups, feeding, or notes"
                  value={draft.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  multiline
                  minRows={2}
                  maxRows={4}
                  size="small"
                  fullWidth
                />
              </Collapse>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                sx={{
                  alignItems: {
                    xs: "stretch",
                    sm: "center",
                  },
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  {sleepDuration !== null && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      Slept{" "}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                        }}
                      >
                        {formatDuration(sleepDuration)}
                      </Box>{" "}
                      · {draft.asleepTime}–{draft.wakeTime}
                    </Typography>
                  )}
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  disabled={!hasChanges || isSaving || isDeleting}
                  onClick={() => void handleSave()}
                  startIcon={
                    isSaving ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                >
                  {isSaving
                    ? "Saving…"
                    : complete
                      ? "Save and collapse"
                      : "Save"}
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
