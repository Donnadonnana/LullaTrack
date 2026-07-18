import {
    Box,
    IconButton,
    Stack,
    Typography,
  } from "@mui/material";
  
  import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
  import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
  import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
  
  import { DatePicker } from "@mui/x-date-pickers/DatePicker";
  import dayjs, { type Dayjs } from "dayjs";
  import { useState } from "react";
  
  type DateNavigatorProps = {
    value: string;
    onChange: (date: string) => void;
  };
  
  export default function DateNavigator({
    value,
    onChange,
  }: DateNavigatorProps) {
    const [calendarOpen, setCalendarOpen] = useState(false);
  
    const selectedDate = dayjs(value);
    const isToday = selectedDate.isSame(dayjs(), "day");
  
    const handlePreviousDay = () => {
      onChange(
        selectedDate
          .subtract(1, "day")
          .format("YYYY-MM-DD"),
      );
    };
  
    const handleNextDay = () => {
      onChange(
        selectedDate
          .add(1, "day")
          .format("YYYY-MM-DD"),
      );
    };
  
    const handleDateChange = (nextDate: Dayjs | null) => {
      if (!nextDate?.isValid()) {
        return;
      }
  
      onChange(nextDate.format("YYYY-MM-DD"));
      setCalendarOpen(false);
    };
  
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <IconButton
          onClick={handlePreviousDay}
          aria-label="Previous day"
        >
          <ChevronLeftOutlinedIcon />
        </IconButton>
  
        <Box
          onClick={() => setCalendarOpen(true)}
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
            cursor: "pointer",
            textAlign: "center",
  
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
                {isToday
                  ? "Today"
                  : selectedDate.format("dddd")}
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
  
        <IconButton
          onClick={handleNextDay}
          aria-label="Next day"
        >
          <ChevronRightOutlinedIcon />
        </IconButton>
  
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          open={calendarOpen}
          onOpen={() => setCalendarOpen(true)}
          onClose={() => setCalendarOpen(false)}
          sx={{
            position: "absolute",
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
          slotProps={{
            textField: {
              sx: {
                display: "none",
              },
            },
          }}
        />
      </Stack>
    );
  }