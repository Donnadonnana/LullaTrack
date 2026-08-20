import { useState, type MouseEvent } from "react";
import {
  Box,
  Drawer,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import TimeWheelPicker from "./TimeWheelPicker";
import { formatDisplayTime } from "../../utils/timeWheel.utils";

type SleepTimeInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inline?: boolean;
};

export default function SleepTimeInput({
  label,
  value,
  onChange,
  inline,
}: SleepTimeInputProps) {
  const theme = useTheme();
  const { nursery } = theme.palette;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const accent = nursery.moon;
  const displayValue = value ? formatDisplayTime(value) : "";

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const pickerContent = (
    <TimeWheelPicker
      value={value}
      onChange={onChange}
      onClose={handleClose}
      accent={accent}
    />
  );

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={handleOpen}
        sx={{
          width: "100%",
          textAlign: "left",
          border: "1px solid",
          borderColor: value ? accent : "divider",
          borderRadius: 2.5,
          bgcolor: "background.paper",
          px: inline ? 1.25 : 1.75,
          py: inline ? 0.75 : 1.25,
          cursor: "pointer",
          font: "inherit",
          transition: "border-color 0.15s ease",
          "&:hover": { borderColor: accent },
        }}
      >
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: inline ? 15 : 17,
            fontWeight: 600,
            color: value ? "text.primary" : "text.disabled",
          }}
        >
          {displayValue || "Tap to set"}
        </Typography>
      </Box>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={isOpen}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                pb: 1,
              },
            },
          }}
        >
          {pickerContent}
        </Drawer>
      ) : (
        <Popover
          open={isOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          slotProps={{ paper: { sx: { borderRadius: 3, mt: 1 } } }}
        >
          {pickerContent}
        </Popover>
      )}
    </>
  );
}
