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
  createBaby,
  finishOnboarding,
  nextOnboardingStep,
  previousOnboardingStep,
  updateBaby,
  updateBabyDraft,
} from "../../store/slices/babySlice";

import { registerAccount } from "../../store/slices/authSlice";

const stepLabels = ["About your baby", "Date of birth", "Feeding"];

export default function OnboardingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mode, step, draft } = useAppSelector(
    (state) => state.babies.onboarding,
  );
  const activeBabyId = useAppSelector((state) => state.babies.activeBabyId);

  const registrationDraft = useAppSelector(
    (state) => state.auth.registrationDraft,
  );

  // "create" (fresh signup) drives loading/error off authSlice, since it's
  // registerAccount that's in flight. "add"/"restart" drive it off
  // babySlice instead, since those call createBaby/updateBaby — there's no
  // registration happening at all.
  const authStatus = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);
  const babyStatus = useAppSelector((state) => state.babies.status);
  const babyError = useAppSelector((state) => state.babies.error);

  const isSubmitting =
    mode === "create" ? authStatus === "loading" : babyStatus === "loading";

  const submitError = mode === "create" ? authError : babyError;

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
    try {
      if (mode === "add") {
        await dispatch(createBaby(draft)).unwrap();

        navigate("/", { replace: true });
        return;
      }

      if (mode === "restart") {
        if (!activeBabyId) {
          // Nothing to update against — shouldn't normally happen, since
          // startOnboarding("restart") requires an existing activeBabyId.
          navigate("/", { replace: true });
          return;
        }

        await dispatch(
          updateBaby({
            babyId: activeBabyId,
            changes: {
              name: draft.name.trim(),
              gender: draft.gender || undefined,
              dateOfBirth: draft.dateOfBirth,
              feedingMethod: draft.feedingMethod || undefined,
            },
          }),
        ).unwrap();

        navigate("/", { replace: true });
        return;
      }

      // mode === "create" — first-time signup, needs the registration draft.
      if (!registrationDraft) {
        navigate("/register", { replace: true });
        return;
      }

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
      navigate("/", { replace: true });
    } catch {
      // The rejected request message is stored in state.auth.error or
      // state.babies.error, depending on mode — surfaced via submitError.
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

  // Only first-time signup depends on a registration draft. "add" and
  // "restart" operate on an already-authenticated user and skip straight
  // to the baby-details steps below.
  if (mode === "create" && !registrationDraft) {
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

  const pageTitle =
    mode === "restart" ? `Update ${draft.name || "your baby"}'s details` : null;

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

          {submitError && <Alert severity="error">{submitError}</Alert>}

          {step === 0 && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {pageTitle ?? "Tell us about your baby"}
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
              disabled={step === 0 || isSubmitting}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canContinue || isSubmitting}
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creating account…"
                  : mode === "restart"
                    ? "Saving…"
                    : "Adding baby…"
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
