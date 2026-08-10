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

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";

import { useEffect, useMemo, useState } from "react";

import {
  deleteSleepLog,
  saveSleepLog,
  type SleepLog,
} from "../../store/slices/sleepSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import SleepTimeInput from "../SleepTimeInput/SleepTimeInput";

import { calculateDuration, formatDuration } from "../../utils/time";

// Cozy nursery palette — keep in sync with SleepPage.tsx / WakeWindow.tsx
const INK = "#3A3450";
const INK_SOFT = "#8B8398";
const INK_FAINT = "#C3BCC9";
const BORDER = "#EEE3D8";
const SURFACE = "#FFFFFF";
const MOON = "#6C63AC";
const MOON_TINT = "rgba(108, 99, 172, 0.10)";
const SUN = "#E1963C";
const SUN_TINT = "rgba(225, 150, 60, 0.12)";
const DAWN = "#E0876B";
const DAWN_TINT = "rgba(224, 135, 107, 0.14)";
const ROSE = "#C97B78";
const FONT_DISPLAY = "'Fraunces', Georgia, serif";

type SleepCardProps = {
  log: SleepLog;
  babyName: string;
};

type SleepDraft = Pick<
  SleepLog,
  "onBedTime" | "asleepTime" | "wakeTime" | "pickupTime" | "notes"
>;

function isLogComplete(type: SleepLog["type"], sleep: SleepDraft): boolean {
  if (type === "wake") {
    return Boolean(sleep.wakeTime && sleep.pickupTime);
  }

  if (type === "night") {
    return Boolean(sleep.onBedTime && sleep.asleepTime);
  }

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

  const isNap = log.type === "nap";
  const isWake = log.type === "wake";
  const isNight = log.type === "night";

  const sleepTitle = isWake
    ? "Woke up"
    : isNap
      ? `Nap ${log.sleepNumber}`
      : "Night sleep";

  const accent = isWake ? DAWN : isNap ? SUN : MOON;
  const accentTint = isWake ? DAWN_TINT : isNap ? SUN_TINT : MOON_TINT;
  const accentHover = isWake ? "#C96F55" : isNap ? "#CC8530" : "#5A5296";

  // Night sleep has no same-day wake time, so there's no duration to show —
  // just the on-bed / asleep times. Wake and nap logs both have a
  // start → end pair we can turn into a duration.
  const durationLabel = isWake ? "Awake before pickup" : "Slept";
  const rangeStart = isWake ? draft.wakeTime : draft.asleepTime;
  const rangeEnd = isWake ? draft.pickupTime : draft.wakeTime;
  const durationValue = isNight
    ? null
    : calculateDuration(rangeStart, rangeEnd);

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
        borderRadius: 4,
        borderColor: BORDER,
        bgcolor: SURFACE,
        boxShadow: isExpanded ? "0 8px 24px rgba(58, 52, 80, 0.06)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <CardContent
        sx={{
          p: isExpanded ? 2.5 : 1.5,
          "&:last-child": {
            pb: isExpanded ? 2.5 : 1.5,
          },
        }}
      >
        <Stack spacing={isExpanded ? 2 : 0}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 40,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  bgcolor: accentTint,
                }}
              >
                {isWake ? (
                  <WbTwilightRoundedIcon sx={{ fontSize: 20, color: accent }} />
                ) : isNap ? (
                  <LightModeRoundedIcon sx={{ fontSize: 20, color: accent }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ fontSize: 20, color: accent }} />
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: "baseline", flexWrap: "wrap" }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 600,
                      fontSize: 17,
                      color: INK,
                    }}
                  >
                    {sleepTitle}
                  </Typography>

                  {!isExpanded && !isNight && durationValue !== null && (
                    <>
                      <Typography sx={{ color: INK_FAINT }}>·</Typography>
                      <Typography sx={{ color: INK_SOFT, fontSize: 14 }}>
                        {rangeStart}–{rangeEnd}
                      </Typography>
                      <Typography sx={{ color: INK_FAINT }}>·</Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_DISPLAY,
                          fontWeight: 600,
                          fontSize: 15,
                          color: accent,
                        }}
                      >
                        {formatDuration(durationValue)}
                      </Typography>
                    </>
                  )}

                  {!isExpanded &&
                    isNight &&
                    draft.onBedTime &&
                    draft.asleepTime && (
                      <>
                        <Typography sx={{ color: INK_FAINT }}>·</Typography>
                        <Typography sx={{ color: INK_SOFT, fontSize: 14 }}>
                          Down {draft.onBedTime} · Asleep {draft.asleepTime}
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
                      color: INK_SOFT,
                      maxWidth: { xs: 180, sm: 420 },
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
              sx={{ alignItems: "center", flexShrink: 0 }}
            >
              {hasChanges && (
                <Chip
                  label="Unsaved"
                  size="small"
                  sx={{
                    bgcolor: SUN_TINT,
                    color: SUN,
                    fontWeight: 700,
                    border: "none",
                  }}
                />
              )}

              <Tooltip title={isExpanded ? "Collapse" : "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded((current) => !current)}
                  sx={{ color: INK_SOFT }}
                >
                  {isExpanded ? (
                    <ExpandLessRoundedIcon fontSize="small" />
                  ) : (
                    <EditRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                  sx={{ color: ROSE }}
                >
                  {isDeleting ? (
                    <CircularProgress size={18} sx={{ color: ROSE }} />
                  ) : (
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Collapse in={isExpanded} unmountOnExit>
            <Stack spacing={2}>
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
                {isWake && (
                  <>
                    <SleepTimeInput
                      label="Woke up"
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
                  </>
                )}

                {isNight && (
                  <>
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
                  </>
                )}

                {isNap && (
                  <>
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
                  </>
                )}
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
                  color: MOON,
                  fontSize: 13,
                  fontWeight: 700,
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
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                />
              </Collapse>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  {!isNight && durationValue !== null && (
                    <Typography sx={{ color: INK_SOFT, fontSize: 14 }}>
                      {durationLabel}{" "}
                      <Box
                        component="span"
                        sx={{
                          fontFamily: FONT_DISPLAY,
                          fontWeight: 600,
                          color: INK,
                        }}
                      >
                        {formatDuration(durationValue)}
                      </Box>{" "}
                      · {rangeStart}–{rangeEnd}
                    </Typography>
                  )}

                  {isNight && draft.onBedTime && draft.asleepTime && (
                    <Typography sx={{ color: INK_SOFT, fontSize: 14 }}>
                      Down at{" "}
                      <Box
                        component="span"
                        sx={{
                          fontFamily: FONT_DISPLAY,
                          fontWeight: 600,
                          color: INK,
                        }}
                      >
                        {draft.onBedTime}
                      </Box>{" "}
                      · Asleep by {draft.asleepTime}
                    </Typography>
                  )}
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
