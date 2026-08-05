import {
  Alert,
  Box,
  Button,
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

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  finishOnboarding,
  nextOnboardingStep,
  previousOnboardingStep,
  updateBabyDraft,
} from "../../store/slices/babySlice";

import { registerAccount } from "../../store/slices/authSlice";

const stepLabels = ["About your baby", "Date of birth", "Feeding"];

export default function OnboardingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { step, draft } = useAppSelector((state) => state.babies.onboarding);

  const registrationDraft = useAppSelector(
    (state) => state.auth.registrationDraft,
  );

  const authStatus = useAppSelector((state) => state.auth.status);

  const authError = useAppSelector((state) => state.auth.error);

  const progress = ((step + 1) / stepLabels.length) * 100;

  const canContinue = (() => {
    switch (step) {
      case 0:
        return Boolean(draft.name.trim() && draft.gender);

      case 1:
        return Boolean(draft.dateOfBirth);

      case 2:
        return Boolean(draft.feedingMethod);

      default:
        return false;
    }
  })();

  const handleFinish = async () => {
    if (!registrationDraft) {
      navigate("/register", {
        replace: true,
      });

      return;
    }

    try {
      await dispatch(
        registerAccount({
          email: registrationDraft.email,
          password: registrationDraft.password,

          user: {
            firstName: registrationDraft.firstName,
            lastName: registrationDraft.lastName,
          },

          baby: {
            name: draft.name.trim(),
            gender: draft.gender || "boy",
            dateOfBirth: draft.dateOfBirth,
            feedingMethod: draft.feedingMethod || "breastfeeding",
          },
        }),
      ).unwrap();

      dispatch(finishOnboarding());

      navigate("/", {
        replace: true,
      });

      dispatch(finishOnboarding());

      navigate("/", {
        replace: true,
      });
    } catch {
      // The rejected request message is stored
      // in state.auth.error.
    }
  };

  const handleNext = () => {
    if (!canContinue) {
      return;
    }

    if (step === stepLabels.length - 1) {
      void handleFinish();
      return;
    }

    dispatch(nextOnboardingStep());
  };

  if (!registrationDraft) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          px: 3,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 520,
            p: 4,
          }}
        >
          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              Registration information is missing
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              Please return to registration and enter your account information.
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/register", {
                  replace: true,
                })
              }
            >
              Return to registration
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

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

          {authError && <Alert severity="error">{authError}</Alert>}

          {step === 0 && (
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
                    color: "text.secondary",
                    mt: 1,
                  }}
                >
                  We&apos;ll use this to personalize your experience.
                </Typography>
              </Box>

              <TextField
                label="Baby's name"
                value={draft.name}
                onChange={(event) =>
                  dispatch(
                    updateBabyDraft({
                      name: event.target.value,
                    }),
                  )
                }
                autoFocus
                fullWidth
              />

              <FormControl>
                <FormLabel>Baby&apos;s gender</FormLabel>

                <RadioGroup
                  row
                  value={draft.gender}
                  onChange={(event) =>
                    dispatch(
                      updateBabyDraft({
                        gender: event.target.value as "boy" | "girl",
                      }),
                    )
                  }
                >
                  <FormControlLabel
                    value="boy"
                    control={<Radio />}
                    label="Boy"
                  />

                  <FormControlLabel
                    value="girl"
                    control={<Radio />}
                    label="Girl"
                  />
                </RadioGroup>
              </FormControl>
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
                  When was {draft.name} born?
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mt: 1,
                  }}
                >
                  We use the date of birth to calculate age automatically.
                </Typography>
              </Box>

              <TextField
                label="Date of birth"
                type="date"
                value={draft.dateOfBirth}
                onChange={(event) =>
                  dispatch(
                    updateBabyDraft({
                      dateOfBirth: event.target.value,
                    }),
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: {
                    max: new Date().toISOString().split("T")[0],
                  },
                }}
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
                  How is {draft.name} usually fed?
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mt: 1,
                  }}
                >
                  You can update this later as things change.
                </Typography>
              </Box>

              <FormControl>
                <RadioGroup
                  value={draft.feedingMethod}
                  onChange={(event) =>
                    dispatch(
                      updateBabyDraft({
                        feedingMethod: event.target.value as
                          | "breastfeeding"
                          | "bottle"
                          | "combination",
                      }),
                    )
                  }
                >
                  <FormControlLabel
                    value="breastfeeding"
                    control={<Radio />}
                    label="Breastfeeding"
                  />

                  <FormControlLabel
                    value="bottle"
                    control={<Radio />}
                    label="Bottle feeding"
                  />

                  <FormControlLabel
                    value="combination"
                    control={<Radio />}
                    label="Combination feeding"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => dispatch(previousOnboardingStep())}
              disabled={step === 0 || authStatus === "loading"}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canContinue || authStatus === "loading"}
            >
              {authStatus === "loading"
                ? "Creating account…"
                : step === stepLabels.length - 1
                  ? "Finish"
                  : "Continue"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
