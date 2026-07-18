import { Box, IconButton, Popover, Stack, Typography } from "@mui/material";

import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

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
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <IconButton onClick={handlePreviousDay} aria-label="Previous day">
          <ChevronLeftOutlinedIcon />
        </IconButton>

        <Box
          component="button"
          type="button"
          onClick={handleCalendarOpen}
          sx={{
            minWidth: {
              xs: 220,
              sm: 300,
            },
            px: 2,
            py: 1.25,
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
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarMonthOutlinedIcon
              sx={{
                color: "primary.main",
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {isToday ? "Today" : selectedDate.format("dddd")}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                {selectedDate.format("MMMM D, YYYY")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <IconButton onClick={handleNextDay} aria-label="Next day">
          <ChevronRightOutlinedIcon />
        </IconButton>
      </Stack>

      <Popover
        open={calendarOpen}
        anchorEl={anchorElement}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 3,
              overflow: "hidden",
            },
          },
        }}
      >
        <DateCalendar value={selectedDate} onChange={handleDateChange} />
      </Popover>
    </>
  );
}
