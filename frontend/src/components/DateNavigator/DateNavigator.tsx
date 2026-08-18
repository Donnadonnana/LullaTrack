import { Box, IconButton, Popover, Stack, Typography } from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import dayjs, { type Dayjs } from "dayjs";
import { useState, type MouseEvent } from "react";

type DateNavigatorProps = {
  value: string;
  onChange: (date: string) => void;
};

export default function DateNavigator({ value, onChange }: DateNavigatorProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const selectedDate = dayjs(value);
  const calendarOpen = Boolean(anchorElement);

  const isToday = selectedDate.isSame(dayjs(), "day");

  const handleCalendarOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorElement(null);
  };

  const handlePreviousDay = () => {
    onChange(selectedDate.subtract(1, "day").format("YYYY-MM-DD"));
  };

  const handleNextDay = () => {
    onChange(selectedDate.add(1, "day").format("YYYY-MM-DD"));
  };

  const handleDateChange = (nextDate: Dayjs | null) => {
    if (!nextDate?.isValid()) {
      return;
    }

    onChange(nextDate.format("YYYY-MM-DD"));
    handleCalendarClose();
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <IconButton
          onClick={handlePreviousDay}
          aria-label="Previous day"
          size="small"
          sx={{ color: "text.secondary", flexShrink: 0 }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>

        <Box
          component="button"
          type="button"
          onClick={handleCalendarOpen}
          sx={{
            // Fills the row on phones, sizes to content on larger screens.
            flexGrow: { xs: 1, sm: 0 },
            minWidth: { xs: 0, sm: 240 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.75, sm: 1 },
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
            color: "text.primary",
            cursor: "pointer",
            textAlign: "center",
            font: "inherit",

            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", justifyContent: "center", minWidth: 0 }}
          >
            <CalendarMonthRoundedIcon
              sx={{
                fontSize: { xs: 18, sm: 22 },
                color: "primary.main",
                flexShrink: 0,
              }}
            />

            {/* One compact line on phones, two-line block on desktop. */}
            <Typography
              noWrap
              sx={{
                display: { xs: "block", sm: "none" },
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {isToday ? "Today" : selectedDate.format("ddd")} ·{" "}
              {selectedDate.format("MMM D")}
            </Typography>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontWeight: 700 }}>
                {isToday ? "Today" : selectedDate.format("dddd")}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {selectedDate.format("MMMM D, YYYY")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <IconButton
          onClick={handleNextDay}
          aria-label="Next day"
          size="small"
          disabled={isToday}
          sx={{ color: "text.secondary", flexShrink: 0 }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
      </Stack>

      <Popover
        open={calendarOpen}
        anchorEl={anchorElement}
        onClose={handleCalendarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 3,
              overflow: "hidden",
              // Keep the calendar inside the viewport on narrow screens.
              maxWidth: "calc(100vw - 32px)",
            },
          },
        }}
      >
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          disableFuture
        />
      </Popover>
    </>
  );
}
