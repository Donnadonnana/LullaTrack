import {
    Box,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  
  type SleepTimeInputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
  };
  
  function splitTime(value: string): {
    hours: string;
    minutes: string;
  } {
    if (!value.includes(":")) {
      return {
        hours: "",
        minutes: "",
      };
    }
  
    const [hours, minutes] = value.split(":");
  
    return {
      hours: hours ?? "",
      minutes: minutes ?? "",
    };
  }
  
  export default function SleepTimeInput({
    label,
    value,
    onChange,
  }: SleepTimeInputProps) {
    const initialTime = splitTime(value);
  
    const [hours, setHours] = useState(initialTime.hours);
    const [minutes, setMinutes] = useState(initialTime.minutes);
  
    useEffect(() => {
      const nextTime = splitTime(value);
  
      setHours(nextTime.hours);
      setMinutes(nextTime.minutes);
    }, [value]);
  
    const updateTime = (
      nextHours: string,
      nextMinutes: string,
    ) => {
      if (!nextHours && !nextMinutes) {
        onChange("");
        return;
      }
  
      onChange(`${nextHours}:${nextMinutes}`);
    };
  
    const handleHoursChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const digits = event.target.value
        .replace(/\D/g, "")
        .slice(0, 2);
  
      if (digits && Number(digits) > 23) {
        return;
      }
  
      setHours(digits);
      updateTime(digits, minutes);
    };
  
    const handleMinutesChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const digits = event.target.value
        .replace(/\D/g, "")
        .slice(0, 2);
  
      if (digits && Number(digits) > 59) {
        return;
      }
  
      setMinutes(digits);
      updateTime(hours, digits);
    };
  
    const handleHoursBlur = () => {
      if (!hours) {
        return;
      }
  
      const formattedHours = hours.padStart(2, "0");
  
      setHours(formattedHours);
      updateTime(formattedHours, minutes);
    };
  
    const handleMinutesBlur = () => {
      if (!minutes) {
        return;
      }
  
      const formattedMinutes = minutes.padStart(2, "0");
  
      setMinutes(formattedMinutes);
      updateTime(hours, formattedMinutes);
    };
  
    return (
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 1,
          }}
        >
          {label}
        </Typography>
  
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextField
            value={hours}
            onChange={handleHoursChange}
            onBlur={handleHoursBlur}
            placeholder="11"
            aria-label={`${label} hour`}
            sx={{
              width: 76,
            }}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                maxLength: 2,
                style: {
                  textAlign: "center",
                  fontSize: "1.1rem",
                },
              },
            }}
          />
  
          <Typography
            aria-hidden="true"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            :
          </Typography>
  
          <TextField
            value={minutes}
            onChange={handleMinutesChange}
            onBlur={handleMinutesBlur}
            placeholder="30"
            aria-label={`${label} minute`}
            sx={{
              width: 76,
            }}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                maxLength: 2,
                style: {
                  textAlign: "center",
                  fontSize: "1.1rem",
                },
              },
            }}
          />
        </Box>
      </Box>
    );
  }