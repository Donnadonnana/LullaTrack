import { Box, Stack, Typography, useTheme } from "@mui/material";

import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";

import { formatDuration } from "../../utils/time";

type DaySummaryProps = {
  babyName: string;
  napCount: number;
  totalNapMinutes: number;
  nightSleepMinutes: number | null;
  totalSleepMinutes: number | null;
  avgSleepLatencyMinutes: number | null;
  avgAwakeBeforePickupMinutes: number | null;
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 18,
          color: "text.primary",
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function DaySummary({
  babyName,
  napCount,
  totalNapMinutes,
  nightSleepMinutes,
  totalSleepMinutes,
  avgSleepLatencyMinutes,
  avgAwakeBeforePickupMinutes,
}: DaySummaryProps) {
  const hasNaps = napCount > 0;
  const theme = useTheme();
  const { nursery } = theme.palette;

  return (
    <Box
      sx={{
        borderRadius: 1,
        p: 2.5,
        background: `linear-gradient(135deg, ${nursery.moonTint}, ${nursery.sunTint})`,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              bgcolor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <NightlightRoundedIcon sx={{ fontSize: 24, color: nursery.moon }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 500,
                fontSize: { xs: 15, sm: 17 },
                color: "text.primary",
                lineHeight: 1.4,
              }}
            >
              {hasNaps ? (
                <>
                  {babyName} had{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: nursery.sun }}
                  >
                    {napCount} {napCount === 1 ? "nap" : "naps"}
                  </Box>{" "}
                  today.
                </>
              ) : (
                <>{babyName} had no naps today and went straight to bed.</>
              )}
            </Typography>

            <Typography
              sx={{ color: "text.secondary", fontSize: 13, mt: 0.25 }}
            >
              Day's naps are done — night sleep is logged.
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
            pt: 0.5,
            borderTop: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <StatItem label="Naps" value={String(napCount)} />

          <StatItem
            label="Nap sleep"
            value={hasNaps ? formatDuration(totalNapMinutes) : "—"}
          />

          <StatItem
            label="Night sleep"
            value={
              nightSleepMinutes !== null
                ? formatDuration(nightSleepMinutes)
                : "—"
            }
          />

          <StatItem
            label="Total sleep"
            value={
              totalSleepMinutes !== null
                ? formatDuration(totalSleepMinutes)
                : "—"
            }
          />

          <StatItem
            label="Avg. time to fall asleep"
            value={
              avgSleepLatencyMinutes !== null
                ? formatDuration(avgSleepLatencyMinutes)
                : "—"
            }
          />

          <StatItem
            label="Avg. awake before pickup"
            value={
              avgAwakeBeforePickupMinutes !== null
                ? formatDuration(avgAwakeBeforePickupMinutes)
                : "—"
            }
          />
        </Box>
      </Stack>
    </Box>
  );
}
