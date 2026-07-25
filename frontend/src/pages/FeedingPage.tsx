import { Box, Button, Stack, Typography } from "@mui/material";

import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import PageHeader from "../components/PageLayout/PageHeader";

import dayjs from "dayjs";
import { useState } from "react";

import DateNavigator from "../components/DateNavigator/DateNavigator";
import FeedingCard from "../components/FeedingCard/FeedingCard";

import {
  addFeedingLog,
  deleteFeedingLog,
  updateFeedingLog,
  type FeedingLog,
  type FeedingType,
} from "../store/slices/feedingSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function FeedingPage() {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const activeBabyFeedingLogs = useAppSelector((state: any) =>
    state.feeding.logs.filter(
      (log) => log.babyId === activeBabyId && log.date === selectedDate,
    ),
  );

  const handleAddFeeding = (type: FeedingType) => {
    if (!activeBabyId) {
      return;
    }

    const feedingNumber =
      activeBabyFeedingLogs.filter((log) => log.type === type).length + 1;

    dispatch(
      addFeedingLog({
        babyId: activeBabyId,
        date: selectedDate,
        type,
        feedingNumber,
      }),
    );
  };

  const handleUpdateFeeding = (id: string, changes: Partial<FeedingLog>) => {
    dispatch(
      updateFeedingLog({
        id,
        changes,
      }),
    );
  };

  const handleDeleteFeeding = (id: string) => {
    dispatch(deleteFeedingLog(id));
  };

  if (!activeBaby) {
    return (
      <Typography>Select or add a baby before tracking feeding.</Typography>
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Sleep"
        rightContent={
          <DateNavigator value={selectedDate} onChange={setSelectedDate} />
        }
      />
      {activeBabyFeedingLogs.length === 0 ? (
        <Box
          sx={{
            minHeight: 360,
            border: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            borderRadius: 4,
            display: "grid",
            placeItems: "center",
            p: 4,
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "action.hover",
                color: "primary.main",
              }}
            >
              <RestaurantOutlinedIcon
                sx={{
                  fontSize: 36,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                No feeding logged yet
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                }}
              >
                Add {activeBaby.name}&apos;s first feeding for this day.
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                variant="contained"
                startIcon={<ChildCareOutlinedIcon />}
                onClick={() => handleAddFeeding("breastfeeding")}
              >
                Add breastfeeding
              </Button>

              <Button
                variant="outlined"
                startIcon={<LocalDrinkOutlinedIcon />}
                onClick={() => handleAddFeeding("bottle")}
              >
                Add bottle
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={2}>
          {activeBabyFeedingLogs.map((log) => (
            <FeedingCard
              key={log.id}
              log={log}
              onUpdate={(changes) => handleUpdateFeeding(log.id, changes)}
              onDelete={() => handleDeleteFeeding(log.id)}
            />
          ))}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ChildCareOutlinedIcon />}
              onClick={() => handleAddFeeding("breastfeeding")}
            >
              Add another breastfeeding
            </Button>

            <Button
              variant="outlined"
              startIcon={<LocalDrinkOutlinedIcon />}
              onClick={() => handleAddFeeding("bottle")}
            >
              Add another bottle
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
