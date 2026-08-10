import { Box, Stack, Typography } from "@mui/material";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

import { formatDuration } from "../../utils/time";

type WakeWindowProps = {
  durationMinutes: number;
};

const SAGE = "#7E9680";
const SAGE_TINT = "rgba(126, 150, 128, 0.12)";
const THREAD = "#E4DACD";

export default function WakeWindow({ durationMinutes }: WakeWindowProps) {
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
          borderTop: `1px dashed ${THREAD}`,
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
          bgcolor: SAGE_TINT,
          flexShrink: 0,
        }}
      >
        <WbSunnyRoundedIcon sx={{ fontSize: 15, color: SAGE }} />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: SAGE,
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
          borderTop: `1px dashed ${THREAD}`,
        }}
      />
    </Stack>
  );
}
