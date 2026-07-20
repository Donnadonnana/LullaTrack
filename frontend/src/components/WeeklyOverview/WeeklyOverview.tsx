import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CalendarViewWeekOutlinedIcon from "@mui/icons-material/CalendarViewWeekOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";

import ReportMetric from "../ReportCard/ReportMetric";

import type { TrendDirection, WeeklyReport } from "../../types/reports";

import { formatMinutes } from "../../utils/reports";

type WeeklyOverviewProps = {
  report: WeeklyReport;
};

function getTrendLabel(trend: TrendDirection): {
  label: string;
  icon: React.ReactElement;
  color: "success" | "warning" | "default";
} {
  if (trend === "up") {
    return {
      label: "Improving",
      icon: <TrendingUpOutlinedIcon />,
      color: "success",
    };
  }

  if (trend === "down") {
    return {
      label: "Needs attention",
      icon: <TrendingDownOutlinedIcon />,
      color: "warning",
    };
  }

  return {
    label: "Stable",
    icon: <TrendingFlatOutlinedIcon />,
    color: "default",
  };
}

export default function WeeklyOverview({ report }: WeeklyOverviewProps) {
  const sleepTrend = getTrendLabel(report.sleepTrend);

  const feedingTrend = getTrendLabel(report.feedingTrend);

  return (
    <Card
      sx={{
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            sx={{
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "action.hover",
                  color: "primary.main",
                }}
              >
                <CalendarViewWeekOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Weekly overview
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Average activity over the past 7 days
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                variant="outlined"
                color={sleepTrend.color}
                icon={sleepTrend.icon}
                label={`Sleep: ${sleepTrend.label}`}
              />

              <Chip
                size="small"
                variant="outlined"
                color={feedingTrend.color}
                icon={feedingTrend.icon}
                label={`Feeding: ${feedingTrend.label}`}
              />
            </Stack>
          </Stack>

          <Divider />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2.5,
            }}
          >
            <ReportMetric
              label="Average daily sleep"
              value={formatMinutes(report.averageDailySleepMinutes)}
            />

            <ReportMetric
              label="Average daily naps"
              value={formatMinutes(report.averageNapMinutes)}
            />

            <ReportMetric
              label="Average wake window"
              value={formatMinutes(report.averageWakeWindowMinutes)}
            />

            <ReportMetric
              label="Average feeds per day"
              value={report.averageFeedsPerDay.toFixed(1)}
            />

            {report.averageFeedMinutes !== undefined && (
              <ReportMetric
                label="Average feeding session"
                value={formatMinutes(report.averageFeedMinutes)}
              />
            )}

            {report.averageFeedMl !== undefined && (
              <ReportMetric
                label="Average bottle amount"
                value={`${report.averageFeedMl} ml`}
              />
            )}
          </Box>

          <Divider />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "action.hover",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "flex-start",
                }}
              >
                <AutoAwesomeOutlinedIcon
                  sx={{
                    mt: 0.25,
                    color: "primary.main",
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    This week
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {report.summary}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "action.hover",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "flex-start",
                }}
              >
                <TipsAndUpdatesOutlinedIcon
                  sx={{
                    mt: 0.25,
                    color: "warning.main",
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    Helpful tip
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {report.tip}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
