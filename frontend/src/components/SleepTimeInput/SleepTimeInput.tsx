import {
    Box,
    FormHelperText,
    Typography,
    useTheme,
  } from "@mui/material";
  import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type KeyboardEvent,
  } from "react";
  
  type TimeInputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
  };
  
  function timeToDigits(value: string): string {
    return value.replace(/\D/g, "").slice(0, 4);
  }
  
  function digitsToTime(digits: string): string {
    if (!digits) {
      return "";
    }
  
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);
  
    if (digits.length <= 2) {
      return hours;
    }
  
    return `${hours}:${minutes}`;
  }
  
  function isValidCompleteTime(digits: string): boolean {
    if (digits.length !== 4) {
      return false;
    }
  
    const hours = Number(digits.slice(0, 2));
    const minutes = Number(digits.slice(2, 4));
  
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }
  
  export default function TimeInput({
    label,
    value,
    onChange,
    error = false,
    helperText,
    disabled = false,
    required = false,
  }: TimeInputProps) {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
  
    const [digits, setDigits] = useState(() => timeToDigits(value));
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState(false);
  
    useEffect(() => {
      const incomingDigits = timeToDigits(value);
  
      if (incomingDigits !== digits) {
        setDigits(incomingDigits);
      }
    }, [value]);
  
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);
  
    const displayedHours = hours.padEnd(2, "–");
    const displayedMinutes = minutes.padEnd(2, "–");
  
    const hasError = error || internalError;
  
    const borderColor = useMemo(() => {
      if (hasError) {
        return theme.palette.error.main;
      }
  
      if (isFocused) {
        return theme.palette.primary.main;
      }
  
      return theme.palette.divider;
    }, [hasError, isFocused, theme]);
  
    const handleContainerClick = () => {
      if (!disabled) {
        inputRef.current?.focus();
      }
    };
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextDigits = timeToDigits(event.target.value);
  
      setDigits(nextDigits);
      setInternalError(false);
  
      // Keep partial values local while typing.
      if (nextDigits.length === 0) {
        onChange("");
        return;
      }
  
      if (nextDigits.length === 4) {
        if (isValidCompleteTime(nextDigits)) {
          onChange(digitsToTime(nextDigits));
        } else {
          setInternalError(true);
        }
      }
    };
  
    const handleBlur = (_event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
  
      if (!digits) {
        setInternalError(false);
        onChange("");
        return;
      }
  
      if (digits.length !== 4 || !isValidCompleteTime(digits)) {
        setInternalError(true);
        return;
      }
  
      setInternalError(false);
      onChange(digitsToTime(digits));
    };
  
    const handleFocus = () => {
      setIsFocused(true);
    };
  
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        inputRef.current?.blur();
      }
    };
  
    return (
      <Box>
        <Typography
          component="label"
          variant="body2"
          sx={{
            display: "block",
            color: hasError ? "error.main" : "text.secondary",
            mb: 1,
          }}
        >
          {label}
          {required ? " *" : ""}
        </Typography>
  
        <Box
          onClick={handleContainerClick}
          sx={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            cursor: disabled ? "not-allowed" : "text",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 56,
              display: "grid",
              placeItems: "center",
              border: 1,
              borderColor,
              borderRadius: 2,
              bgcolor: "background.paper",
              transition: "border-color 150ms ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: hours
                  ? "text.primary"
                  : "text.disabled",
              }}
            >
              {displayedHours}
            </Typography>
          </Box>
  
          <Typography
            aria-hidden="true"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            :
          </Typography>
  
          <Box
            sx={{
              width: 72,
              height: 56,
              display: "grid",
              placeItems: "center",
              border: 1,
              borderColor,
              borderRadius: 2,
              bgcolor: "background.paper",
              transition: "border-color 150ms ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: minutes
                  ? "text.primary"
                  : "text.disabled",
              }}
            >
              {displayedMinutes}
            </Typography>
          </Box>
  
          <input
            ref={inputRef}
            value={digits}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            aria-label={label}
            aria-invalid={hasError}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: disabled ? "not-allowed" : "text",
            }}
          />
        </Box>
  
        {(helperText || internalError) && (
          <FormHelperText error={hasError}>
            {internalError
              ? "Enter a valid time between 00:00 and 23:59."
              : helperText}
          </FormHelperText>
        )}
      </Box>
    );
  }