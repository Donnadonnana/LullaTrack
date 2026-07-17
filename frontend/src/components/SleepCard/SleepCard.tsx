import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { useState } from "react";

import type { SleepLog } from "../../store/slices/sleepSlice";
import { removeSleepLog, updateSleepLog } from "../../store/slices/sleepSlice";
import { useAppDispatch } from "../../store/hooks";

import SleepTimeInput from "../SleepTimeInput/SleepTimeInput";

import {
  calculateDuration,
  formatDuration,
  formatTimeInput,
} from "../../utils/time";

type SleepCardProps = {
  log: SleepLog;
  babyName: string;
};

export default function SleepCard({ log, babyName }: SleepCardProps) {
  const dispatch = useAppDispatch();
  const [showNotes, setShowNotes] = useState(Boolean(log.notes));

  const sleepDuration = calculateDuration(log.asleepTime, log.wakeTime);

  const isNap = log.type === "nap";

  const sleepTitle = isNap
    ? `Nap ${log.sleepNumber}`
    : `Night Sleep ${log.sleepNumber}`;

  const updateField = (field: keyof SleepLog, value: string) => {
    dispatch(
      updateSleepLog({
        id: log.id,
        changes: {
          [field]: value,
        },
      }),
    );
  };

  const formatField = (
    field: "onBedTime" | "asleepTime" | "wakeTime" | "pickupTime",
  ) => {
    if (!log[field]) {
      return;
    }

    updateField(field, formatTimeInput(log[field]));
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
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(165, 216, 255, 0.25)",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: isNap
                      ? "rgba(255, 214, 165, 0.25)"
                      : "rgba(154, 140, 255, 0.18)",
                  }}
                >
                  {isNap ? (
                    <LightModeOutlinedIcon
                      sx={{
                        color: "warning.main",
                      }}
                    />
                  ) : (
                    <DarkModeOutlinedIcon
                      sx={{
                        color: "primary.main",
                      }}
                    />
                  )}
                </Box>
              </Box>

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

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              {sleepDuration !== null && (
                <Chip
                  label={`${formatDuration(sleepDuration)} asleep`}
                  color={isNap ? "warning" : "primary"}
                  variant="outlined"
                />
              )}

              <IconButton
                aria-label={`Delete ${sleepTitle}`}
                onClick={() => dispatch(removeSleepLog(log.id))}
              >
                <DeleteOutlineOutlinedIcon />
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
              value={log.onBedTime}
              onChange={(value) => updateField("onBedTime", value)}
            />

            <SleepTimeInput
              label={`${babyName} fell asleep`}
              value={log.asleepTime}
              onChange={(value) => updateField("asleepTime", value)}
            />

            <SleepTimeInput
              label={`${babyName} woke up`}
              value={log.wakeTime}
              onChange={(value) => updateField("wakeTime", value)}
            />

            <SleepTimeInput
              label={`${babyName} picked up`}
              value={log.pickupTime}
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
              value={log.notes}
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

              {log.asleepTime && log.wakeTime && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  From {log.asleepTime} to {log.wakeTime}
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
