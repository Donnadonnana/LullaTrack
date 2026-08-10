import { Box, Stack, Typography, useTheme } from "@mui/material";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

import { formatDuration } from "../../utils/time";

type WakeWindowProps = {
  durationMinutes: number;
};

export default function WakeWindow({ durationMinutes }: WakeWindowProps) {
  const theme = useTheme();
  const { sage, sageTint, thread } = theme.palette.nursery;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "center",
        py: 1.5,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          borderTop: `1px dashed ${thread}`,
        }}
      />

      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: "center",
          mx: 1.5,
          px: 1.5,
          py: 0.5,
          borderRadius: 999,
          bgcolor: sageTint,
          flexShrink: 0,
        }}
      >
        <WbSunnyRoundedIcon sx={{ fontSize: 15, color: sage }} />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: sage,
            fontFamily: "'Nunito', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Awake {formatDuration(durationMinutes)}
        </Typography>
      </Stack>

      <Box
        sx={{
          flexGrow: 1,
          borderTop: `1px dashed ${thread}`,
        }}
      />
    </Stack>
  );
}
