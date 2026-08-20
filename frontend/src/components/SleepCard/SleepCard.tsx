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
  useTheme,
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

  // Nap: on-bed + pickup is enough to consider it "done" — asleep/wake are
  // often missing when baby is put down, cries the whole time, and gets
  // picked back up without ever actually falling asleep.
  return Boolean(sleep.onBedTime && sleep.pickupTime);
}

function isInProgress(type: SleepLog["type"], sleep: SleepDraft): boolean {
  if (type === "wake") {
    return Boolean(sleep.wakeTime) && !sleep.pickupTime;
  }

  if (type === "night") {
    return Boolean(sleep.onBedTime) && !sleep.asleepTime;
  }

  // Nap: started (on bed) but not yet picked up.
  return Boolean(sleep.onBedTime) && !sleep.pickupTime;
}

export default function SleepCard({ log }: SleepCardProps) {
  const dispatch = useAppDispatch();
  const { nursery } = useTheme().palette;

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

  const accent = isWake ? nursery.dawn : isNap ? nursery.sun : nursery.moon;
  const accentTint = isWake
    ? nursery.dawnTint
    : isNap
      ? nursery.sunTint
      : nursery.moonTint;
  const accentHover = isWake ? "#C96F55" : isNap ? "#CC8530" : "#5A5296";

  // Wake logs: single duration, awake time before pickup.
  const wakeDurationValue = isWake
    ? calculateDuration(draft.wakeTime, draft.pickupTime)
    : null;

  // Nap logs: two independent durations. Sleep only exists if baby actually
  // fell asleep; in-bed always exists once pickup is logged, regardless.
  const napSleepMinutes = isNap
    ? calculateDuration(draft.asleepTime, draft.wakeTime)
    : null;

  const napInBedMinutes = isNap
    ? calculateDuration(draft.onBedTime, draft.pickupTime)
    : null;

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

  const inProgress = isInProgress(log.type, draft);

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "visible",
        borderRadius: 4,
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
                      color: "text.primary",
                    }}
                  >
                    {sleepTitle}
                  </Typography>

                  {inProgress && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 999,
                        bgcolor: accentTint,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: accent,
                          textTransform: "uppercase",
                          letterSpacing: 0.3,
                        }}
                      >
                        In progress
                      </Typography>
                    </Box>
                  )}

                  {/* Wake: single figure, unchanged */}
                  {isWake && draft.pickupTime && (
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
                  )}

                  {/* Night: unchanged */}
                  {!isExpanded &&
                    isNight &&
                    draft.onBedTime &&
                    draft.asleepTime && (
                      <>
                        <Typography sx={{ color: "text.disabled" }}>
                          ·
                        </Typography>
                        <Typography
                          sx={{ color: "text.secondary", fontSize: 14 }}
                        >
                          Down {draft.onBedTime} · Asleep {draft.asleepTime}
                        </Typography>
                      </>
                    )}

                  {/* Nap: sleep + in-bed, or just in-bed if baby never slept */}
                  {!isExpanded && isNap && napInBedMinutes !== null && (
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
                          <Typography sx={{ color: "text.disabled" }}>
                            ·
                          </Typography>
                          <Typography
                            sx={{ color: "text.secondary", fontSize: 14 }}
                          >
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
                          In bed {formatDuration(napInBedMinutes)} · didn't fall
                          asleep
                        </Typography>
                      )}
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
                    bgcolor: nursery.sunTint,
                    color: nursery.sun,
                    fontWeight: 700,
                    border: "none",
                  }}
                />
              )}

              <Tooltip title={isExpanded ? "Collapse" : "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded((current) => !current)}
                  sx={{ color: "text.secondary" }}
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
                  sx={{ color: nursery.rose }}
                >
                  {isDeleting ? (
                    <CircularProgress size={18} sx={{ color: nursery.rose }} />
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

              {isNap &&
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

              <Typography
                component="button"
                type="button"
                onClick={() => setShowNotes((current) => !current)}
                sx={{
                  alignSelf: "flex-start",
                  border: 0,
                  p: 0,
                  bgcolor: "transparent",
                  color: nursery.moon,
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
                  {isWake && wakeDurationValue !== null && (
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
                  )}

                  {isNight && draft.onBedTime && draft.asleepTime && (
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
                  )}

                  {isNap && napInBedMinutes !== null && (
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
