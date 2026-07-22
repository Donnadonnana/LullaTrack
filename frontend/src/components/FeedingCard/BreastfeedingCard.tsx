import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";

import type {
  BreastSide,
  BreastfeedingLog,
} from "../../store/slices/feedingSlice";

import { calculateFeedingDuration } from "../../utils/time";
import { formatMinutes } from "../../utils/reports";

import TimeInput from "../SleepTimeInput/SleepTimeInput";

type BreastfeedingCardProps = {
  log: BreastfeedingLog;
  onUpdate: (changes: Partial<BreastfeedingLog>) => void;
  onDelete: () => void;
};

export default function BreastfeedingCard({
  log,
  onUpdate,
  onDelete,
}: BreastfeedingCardProps) {
  const duration = calculateFeedingDuration(log.startTime, log.endTime);

  return (
    <Card
      sx={{
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 2.5,
                  bgcolor: "action.hover",
                  color: "primary.main",
                }}
              >
                <ChildCareOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Breastfeeding {log.feedingNumber}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {duration !== null ? formatMinutes(duration) : "In progress"}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onDelete}
              aria-label="Delete breastfeeding log"
              color="error"
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <TimeInput
              label="Started"
              value={log.startTime}
              onChange={(value) =>
                onUpdate({
                  startTime: value,
                })
              }
            />

            <TimeInput
              label="Ended"
              value={log.endTime}
              onChange={(value) =>
                onUpdate({
                  endTime: value,
                })
              }
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel id={`side-${log.id}`}>Breast side</InputLabel>

            <Select
              labelId={`side-${log.id}`}
              value={log.side}
              label="Breast side"
              onChange={(event) =>
                onUpdate({
                  side: event.target.value as BreastSide,
                })
              }
            >
              <MenuItem value="">Not selected</MenuItem>

              <MenuItem value="left">Left</MenuItem>

              <MenuItem value="right">Right</MenuItem>

              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            multiline
            minRows={2}
            value={log.notes}
            onChange={(event) =>
              onUpdate({
                notes: event.target.value,
              })
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
