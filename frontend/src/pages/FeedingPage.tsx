import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";

import PageHeader from "../components/PageLayout/PageHeader";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

import DateNavigator from "../components/DateNavigator/DateNavigator";
import FeedingCard from "../components/FeedingCard/FeedingCard";

import {
  createFeedingLog,
  fetchFeedingLogs,
  type FeedingType,
} from "../store/slices/feedingSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { FONT_DISPLAY } from "../theme/theme";

export default function FeedingPage() {
  const theme = useTheme();
  const { nursery } = theme.palette;

  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);
  const { loading, error } = useAppSelector((state) => state.feeding);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const activeBabyFeedingLogs = useAppSelector((state) =>
    state.feeding.logs
      .filter((log) => log.babyId === activeBabyId && log.date === selectedDate)
      .slice()
      .sort((first, second) =>
        (first.startTime || "99:99").localeCompare(second.startTime || "99:99"),
      ),
  );

  useEffect(() => {
    if (!activeBabyId) {
      return;
    }

    void dispatch(
      fetchFeedingLogs({ babyId: activeBabyId, date: selectedDate }),
    );
  }, [activeBabyId, selectedDate, dispatch]);

  const handleAddFeeding = (type: FeedingType) => {
    if (!activeBabyId) {
      return;
    }

    const feedingNumber =
      activeBabyFeedingLogs.filter((log) => log.type === type).length + 1;

    void dispatch(
      createFeedingLog({
        babyId: activeBabyId,
        date: selectedDate,
        type,
        feedingNumber,
      }),
    );
  };

  if (!activeBaby) {
    return (
      <Typography>Select or add a baby before tracking feeding.</Typography>
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Feeding"
        rightContent={
          <DateNavigator value={selectedDate} onChange={setSelectedDate} />
        }
      />

      {error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {loading && activeBabyFeedingLogs.length === 0 ? (
        <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : activeBabyFeedingLogs.length === 0 ? (
        <Box
          sx={{
            minHeight: 360,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 5,
            display: "grid",
            placeItems: "center",
            p: 4,
            bgcolor: nursery.emptyStateBg,
          }}
        >
          <Stack
            spacing={2.5}
            sx={{ alignItems: "center", textAlign: "center", maxWidth: 340 }}
          >
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, ${nursery.sageTint}, ${nursery.sunTint})`,
              }}
            >
              <RestaurantRoundedIcon
                sx={{ fontSize: 36, color: nursery.sage }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: 22,
                  color: "text.primary",
                }}
              >
                No feeding logged yet
              </Typography>

              <Typography sx={{ color: "text.secondary", mt: 0.75 }}>
                Add {activeBaby.name}&apos;s first feeding for this day.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ChildCareRoundedIcon />}
                onClick={() => handleAddFeeding("breastfeeding")}
                sx={{
                  bgcolor: nursery.sage,
                  color: theme.palette.getContrastText(nursery.sage),
                  "&:hover": {
                    bgcolor: nursery.sage,
                    filter: "brightness(0.92)",
                  },
                }}
              >
                Log breastfeeding
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<LocalDrinkRoundedIcon />}
                onClick={() => handleAddFeeding("bottle")}
                sx={{
                  borderColor: nursery.sun,
                  color: nursery.sun,
                  "&:hover": {
                    borderColor: nursery.sun,
                    bgcolor: nursery.sunTint,
                  },
                }}
              >
                Log bottle
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={1}>
          {activeBabyFeedingLogs.map((log) => (
            <FeedingCard key={log.id} log={log} />
          ))}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ alignSelf: "flex-start", pt: 1.5, flexWrap: "wrap" }}
          >
            <Button
              variant="outlined"
              startIcon={<ChildCareRoundedIcon />}
              onClick={() => handleAddFeeding("breastfeeding")}
              sx={{
                borderColor: nursery.sage,
                color: nursery.sage,
                "&:hover": {
                  borderColor: nursery.sage,
                  bgcolor: nursery.sageTint,
                },
              }}
            >
              Add breastfeeding
            </Button>

            <Button
              variant="outlined"
              startIcon={<LocalDrinkRoundedIcon />}
              onClick={() => handleAddFeeding("bottle")}
              sx={{
                borderColor: nursery.sun,
                color: nursery.sun,
                "&:hover": {
                  borderColor: nursery.sun,
                  bgcolor: nursery.sunTint,
                },
              }}
            >
              Add bottle
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
