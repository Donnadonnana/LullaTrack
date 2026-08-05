import { useState, type FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { clearAuthError, registerAccount } from "../../store/slices/authSlice";

import type { BabyGender, FeedingMethod } from "../../store/slices/babySlice";

const stepLabels = ["Your account", "Your baby", "Feeding"];

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error: authError } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(0);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [babyName, setBabyName] = useState("");

  const [gender, setGender] = useState<BabyGender | "">("");

  const [dateOfBirth, setDateOfBirth] = useState("");

  const [feedingMethod, setFeedingMethod] = useState<FeedingMethod | "">("");

  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = status === "loading";

  const progress = ((step + 1) / stepLabels.length) * 100;

  const validateCurrentStep = (): boolean => {
    setFormError(null);

    if (step === 0) {
      if (!firstName.trim() || !lastName.trim()) {
        setFormError("Please enter your first and last name.");

        return false;
      }

      if (!email.trim()) {
        setFormError("Please enter your email.");

        return false;
      }

      if (password.length < 6) {
        setFormError("Password must be at least 6 characters.");

        return false;
      }

      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");

        return false;
      }
    }

    if (step === 1) {
      if (!babyName.trim() || !gender || !dateOfBirth) {
        setFormError("Please complete your baby's information.");

        return false;
      }

      if (dayjs(dateOfBirth).isAfter(dayjs(), "day")) {
        setFormError("Date of birth cannot be in the future.");

        return false;
      }
    }

    if (step === 2) {
      if (!feedingMethod) {
        setFormError("Please select a feeding method.");

        return false;
      }
    }

    return true;
  };

  const handleNext = (): void => {
    dispatch(clearAuthError());

    if (!validateCurrentStep()) {
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, stepLabels.length - 1));
  };

  const handleBack = (): void => {
    setFormError(null);
    dispatch(clearAuthError());

    setStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    dispatch(clearAuthError());

    if (!validateCurrentStep()) {
      return;
    }

    if (!gender || !feedingMethod) {
      return;
    }

    try {
      await dispatch(
        registerAccount({
          email: email.trim().toLowerCase(),

          password,

          user: {
            firstName: firstName.trim(),

            lastName: lastName.trim(),
          },

          baby: {
            name: babyName.trim(),
            gender,
            dateOfBirth,
            feedingMethod,
          },
        }),
      ).unwrap();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 3,
        py: 6,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 620,
          p: {
            xs: 3,
            sm: 5,
          },
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="overline"
              color="primary"
              sx={{
                fontWeight: 700,
              }}
            >
              Step {step + 1} of {stepLabels.length}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 999,
              }}
            />
          </Box>

          {(formError || authError) && (
            <Alert severity="error">{formError ?? authError}</Alert>
          )}

          {step === 0 && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Hello and welcome
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  Let&apos;s create your LullaTrack account.
                </Typography>
              </Box>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <TextField
                  label="First name"
                  value={firstName}
                  autoComplete="given-name"
                  disabled={isLoading}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label="Last name"
                  value={lastName}
                  autoComplete="family-name"
                  disabled={isLoading}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  fullWidth
                />
              </Stack>

              <TextField
                label="Email"
                type="email"
                value={email}
                autoComplete="email"
                disabled={isLoading}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                autoComplete="new-password"
                helperText="Use at least 6 characters."
                disabled={isLoading}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Confirm password"
                type="password"
                value={confirmPassword}
                autoComplete="new-password"
                disabled={isLoading}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                fullWidth
              />
            </Stack>
          )}

          {step === 1 && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Tell us about your baby
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  We&apos;ll use this to personalize sleep and feeding tracking.
                </Typography>
              </Box>

              <TextField
                label="Baby's name"
                value={babyName}
                disabled={isLoading}
                onChange={(event) => setBabyName(event.target.value)}
                autoFocus
                required
                fullWidth
              />

              <FormControl>
                <FormLabel>Baby&apos;s gender</FormLabel>

                <RadioGroup
                  row
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value as BabyGender)
                  }
                >
                  <FormControlLabel
                    value="boy"
                    control={<Radio />}
                    label="Boy"
                    disabled={isLoading}
                  />

                  <FormControlLabel
                    value="girl"
                    control={<Radio />}
                    label="Girl"
                    disabled={isLoading}
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="Date of birth"
                type="date"
                value={dateOfBirth}
                disabled={isLoading}
                onChange={(event) => setDateOfBirth(event.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },

                  htmlInput: {
                    max: dayjs().format("YYYY-MM-DD"),
                  },
                }}
                required
                fullWidth
              />
            </Stack>
          )}

          {step === 2 && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  How is {babyName} usually fed?
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  You can update this later if your routine changes.
                </Typography>
              </Box>

              <FormControl>
                <RadioGroup
                  value={feedingMethod}
                  onChange={(event) =>
                    setFeedingMethod(event.target.value as FeedingMethod)
                  }
                >
                  <FormControlLabel
                    value="breastfeeding"
                    control={<Radio />}
                    label="Breastfeeding"
                    disabled={isLoading}
                  />

                  <FormControlLabel
                    value="bottle"
                    control={<Radio />}
                    label="Bottle feeding"
                    disabled={isLoading}
                  />

                  <FormControlLabel
                    value="combination"
                    control={<Radio />}
                    label="Combination feeding"
                    disabled={isLoading}
                  />
                </RadioGroup>
              </FormControl>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  bgcolor: "background.default",
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Ready to create your account
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Account: {firstName} {lastName}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Baby: {babyName}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: step === 0 ? "flex-end" : "space-between",
            }}
          >
            {step > 0 && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
            )}

            {step < stepLabels.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            )}
          </Stack>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
            }}
          >
            Already registered? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
