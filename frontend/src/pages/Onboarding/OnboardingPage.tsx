import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    LinearProgress,
    MenuItem,
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
  
  const stepLabels = [
    "About your baby",
    "Baby's age",
    "Feeding",
    "Sleep",
  ];
  
  export default function OnboardingPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
  
    const { step, draft } = useAppSelector(
      (state) => state.babies.onboarding
    );
  
    const progress = ((step + 1) / stepLabels.length) * 100;
  
    const canContinue = (() => {
      switch (step) {
        case 0:
          return Boolean(draft.name.trim() && draft.gender);
  
        case 1:
          return draft.ageMonths !== null;
  
        case 2:
          return Boolean(draft.feedingMethod);
  
        case 3:
          return (
            draft.daySleepHours !== null &&
            draft.nightSleepHours !== null
          );
  
        default:
          return false;
      }
    })();
  
    const handleNext = () => {
      if (!canContinue) {
        return;
      }
  
      if (step === stepLabels.length - 1) {
        dispatch(finishOnboarding());
        navigate("/", { replace: true });
        return;
      }
  
      dispatch(nextOnboardingStep());
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
                sx={{fontWeight: 700}}
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
  
            {step === 0 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4" sx={{fontWeight: 700}}>
                    Tell us about your baby
                  </Typography>
  
                  <Typography color="text.secondary" sx={{mt: 1}}>
                    We'll use this to personalize your experience.
                  </Typography>
                </Box>
  
                <TextField
                  label="Baby's name"
                  value={draft.name}
                  onChange={(event) =>
                    dispatch(
                      updateBabyDraft({
                        name: event.target.value,
                      })
                    )
                  }
                  autoFocus
                  fullWidth
                />
  
                <FormControl>
                  <FormLabel>Baby's gender</FormLabel>
  
                  <RadioGroup
                    row
                    value={draft.gender}
                    onChange={(event) =>
                      dispatch(
                        updateBabyDraft({
                          gender: event.target.value as
                            | "boy"
                            | "girl",
                        })
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
                  <Typography variant="h4" sx={{fontWeight: 700}}>
                    How old is {draft.name}?
                  </Typography>
  
                  <Typography color="text.secondary" sx={{mt: 1}}>
                    An approximate age is perfectly fine.
                  </Typography>
                </Box>
  
                <TextField
                  select
                  label="Age in months"
                  value={draft.ageMonths ?? ""}
                  onChange={(event) =>
                    dispatch(
                      updateBabyDraft({
                        ageMonths: Number(event.target.value),
                      })
                    )
                  }
                  fullWidth
                >
                  {Array.from({ length: 37 }, (_, month) => (
                    <MenuItem key={month} value={month}>
                      {month === 0
                        ? "Less than 1 month"
                        : `${month} month${month === 1 ? "" : "s"}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            )}
  
            {step === 2 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4" sx={{fontWeight: 700}}>
                    How is {draft.name} usually fed?
                  </Typography>
  
                  <Typography color="text.secondary" sx={{mt: 1}}>
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
                        })
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
  
            {step === 3 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4" sx={{fontWeight: 700}}>
                    How much does {draft.name} usually sleep?
                  </Typography>
  
                  <Typography color="text.secondary" sx={{mt: 1}}>
                    An estimate helps us create a starting routine.
                  </Typography>
                </Box>
  
                <TextField
                  label="Daytime nap hours"
                  type="number"
                  value={draft.daySleepHours ?? ""}
                  onChange={(event) =>
                    dispatch(
                      updateBabyDraft({
                        daySleepHours:
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                      })
                    )
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 24,
                      step: 0.5,
                    },
                  }}
                  fullWidth
                />
  
                <TextField
                  label="Nighttime sleep hours"
                  type="number"
                  value={draft.nightSleepHours ?? ""}
                  onChange={(event) =>
                    dispatch(
                      updateBabyDraft({
                        nightSleepHours:
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                      })
                    )
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 24,
                      step: 0.5,
                    },
                  }}
                  fullWidth
                />
              </Stack>
            )}
  
            <Stack
              direction="row"
              spacing={2}
              sx={{justifyContent: "space-between"}}
            >
              <Button
                variant="outlined"
                onClick={() => dispatch(previousOnboardingStep())}
                disabled={step === 0}
              >
                Back
              </Button>
  
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canContinue}
              >
                {step === stepLabels.length - 1
                  ? "Finish"
                  : "Continue"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }