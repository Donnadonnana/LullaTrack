import { Box, Chip, Stack } from "@mui/material";

import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";

import { formatDuration } from "../../utils/time";

type WakeWindowProps = {
  durationMinutes: number;
};

export default function WakeWindow({ durationMinutes }: WakeWindowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 1,
        mb: 1
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          height: 1,
          bgcolor: "divider",
        }}
      />

      <Chip
        icon={<WbSunnyOutlinedIcon />}
        label={`Awake for ${formatDuration(durationMinutes)}`}
        variant="outlined"
        sx={{
          bgcolor: "background.paper",

          "& .MuiChip-label": {
            fontWeight: 600,
          },
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          height: 1,
          bgcolor: "divider",
        }}
      />
    </Stack>
  );
}
