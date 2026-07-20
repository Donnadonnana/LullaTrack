import { Box, Stack, Typography } from "@mui/material";

import dayjs from "dayjs";

import { useAppSelector } from "../store/hooks";
import { useState } from "react";

import SleepReportCard from "../components/SleepReportCard/SleepReportCard";
import FeedingReportCard from "../components/FeedingReportCard/FeedingReportCard";
import WeeklyOverview from "../components/WeeklyOverview/WeeklyOverview";
import DateNavigator from "../components/DateNavigator/DateNavigator";

import {
  dummyFeedingReport,
  dummySleepReport,
  dummyWeeklyReport,
} from "../data/dashboardDummyData";

export default function DashboardPage() {
  const { babies, activeBabyId } = useAppSelector((state) => state.babies);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  if (!activeBaby) {
    return <Typography>Select or add a baby to view the dashboard.</Typography>;
  }

  return (
    <Stack spacing={6}>
      <DateNavigator value={selectedDate} onChange={setSelectedDate} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
        }}
      >
        <SleepReportCard report={dummySleepReport} />

        <FeedingReportCard report={dummyFeedingReport} />
      </Box>

      <WeeklyOverview report={dummyWeeklyReport} />
    </Stack>
  );
}
