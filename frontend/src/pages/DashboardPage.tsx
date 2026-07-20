import { Box, Stack, Typography } from "@mui/material";

import dayjs from "dayjs";

import { useAppSelector } from "../store/hooks";

import SleepReportCard from "../components/SleepReportCard/SleepReportCard";
import FeedingReportCard from "../components/FeedingReportCard/FeedingReportCard";
import WeeklyOverview from "../components/WeeklyOverview/WeeklyOverview";

import {
  dummyFeedingReport,
  dummySleepReport,
  dummyWeeklyReport,
} from "../data/dashboardDummyData";

export default function DashboardPage() {
  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  if (!activeBaby) {
    return <Typography>Select or add a baby to view the dashboard.</Typography>;
  }

  const currentDate = dayjs();

  return (
    <Stack spacing={4}>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {activeBaby.name} is currently {activeBaby.ageMonths} months old!
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            color: "text.secondary",
          }}
        >
          {currentDate.format("dddd, MMMM D, YYYY")}
        </Typography>
      </Box>

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
