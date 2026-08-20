import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

import WheelColumn from "./WheelColumn";
import {
  parseTimeValue,
  to12Hour,
  to24HourString,
} from "../../utils/timeWheel.utils";

type TimeWheelPickerProps = {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  accent: string;
};

const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1),
  value: i + 1,
}));
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) => ({
  label: String(i).padStart(2, "0"),
  value: i,
}));
const PERIOD_ITEMS = [
  { label: "AM", value: 0 },
  { label: "PM", value: 1 },
];

export default function TimeWheelPicker({
  value,
  onChange,
  onClose,
  accent,
}: TimeWheelPickerProps) {
  const initial = parseTimeValue(value);

  const [hour12, setHour12] = useState(initial.hour12);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(initial.period);
  const [resetSignal, setResetSignal] = useState(0);

  const handleNow = () => {
    const now = dayjs();
    const next = to12Hour(now.hour(), now.minute());

    setHour12(next.hour12);
    setMinute(next.minute);
    setPeriod(next.period);
    setResetSignal((current) => current + 1);
  };

  const handleDone = () => {
    onChange(to24HourString(hour12, minute, period));
    onClose();
  };

  const handleClear = () => {
    onChange("");
    onClose();
  };

  return (
    <Box sx={{ width: 280, p: 2.5 }}>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 40,
            transform: "translateY(-50%)",
            bgcolor: `${accent}1F`,
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />

        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WheelColumn
            items={HOUR_ITEMS}
            value={hour12}
            onChange={setHour12}
            accent={accent}
            resetSignal={resetSignal}
          />

          <Typography
            sx={{ fontSize: 20, fontWeight: 700, color: "text.secondary" }}
          >
            :
          </Typography>

          <WheelColumn
            items={MINUTE_ITEMS}
            value={minute}
            onChange={setMinute}
            accent={accent}
            resetSignal={resetSignal}
          />

          <Box sx={{ width: 12 }} />

          <WheelColumn
            items={PERIOD_ITEMS}
            value={period === "AM" ? 0 : 1}
            onChange={(next) => setPeriod(next === 0 ? "AM" : "PM")}
            accent={accent}
            resetSignal={resetSignal}
          />
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 2.5, alignItems: "center" }}>
        <Button
          size="small"
          onClick={handleNow}
          sx={{ color: accent, fontWeight: 700 }}
        >
          Now
        </Button>

        {value && (
          <Button
            size="small"
            onClick={handleClear}
            sx={{ color: "text.secondary" }}
          >
            Clear
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          size="small"
          disableElevation
          onClick={handleDone}
          sx={{
            borderRadius: 999,
            bgcolor: accent,
            "&:hover": { bgcolor: accent, filter: "brightness(0.92)" },
          }}
        >
          Done
        </Button>
      </Stack>
    </Box>
  );
}
