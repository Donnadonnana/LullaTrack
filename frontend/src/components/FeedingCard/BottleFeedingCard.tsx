import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";

import type {
  BottleFeedingLog,
  BottleMilkType,
} from "../../store/slices/feedingSlice";

import TimeInput from "../SleepTimeInput/SleepTimeInput";

type BottleFeedingCardProps = {
  log: BottleFeedingLog;
  onUpdate: (changes: Partial<BottleFeedingLog>) => void;
  onDelete: () => void;
};

export default function BottleFeedingCard({
  log,
  onUpdate,
  onDelete,
}: BottleFeedingCardProps) {
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
                <LocalDrinkOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Bottle {log.feedingNumber}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {log.amountMl !== null
                    ? `${log.amountMl} ml`
                    : "Amount not entered"}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onDelete}
              aria-label="Delete bottle log"
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

            <TextField
              label="Amount"
              type="number"
              value={log.amountMl ?? ""}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">ml</InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0,
                  step: 5,
                },
              }}
              onChange={(event) => {
                const value = event.target.value;

                onUpdate({
                  amountMl: value === "" ? null : Number(value),
                });
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel id={`milk-type-${log.id}`}>Milk type</InputLabel>

            <Select
              labelId={`milk-type-${log.id}`}
              value={log.milkType}
              label="Milk type"
              onChange={(event) =>
                onUpdate({
                  milkType: event.target.value as BottleMilkType,
                })
              }
            >
              <MenuItem value="">Not selected</MenuItem>

              <MenuItem value="breast-milk">Breast milk</MenuItem>

              <MenuItem value="formula">Formula</MenuItem>

              <MenuItem value="combination">Combination</MenuItem>
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
