import { Box, Chip, Stack, Typography } from "@mui/material";

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
        mb: 1,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          height: 1,
          bgcolor: "divider",
        }}
      />
      <Typography
        sx={{
          fontSize: 25,
          color: "lightGrey",
        }}
      >
        {" "}
        -{" "}
      </Typography>
      <WbSunnyOutlinedIcon
        sx={{
          fontSize: 25,
          color: "lightGrey",
        }}
      />
      <Typography
        sx={{
          color: "grey",
        }}
      >
        Awake for {formatDuration(durationMinutes)}{" "}
      </Typography>{" "}
      <Typography
        sx={{
          fontSize: 25,
          color: "lightGrey",
        }}
      >
        {" "}
        -{" "}
      </Typography>
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
