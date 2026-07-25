import { Stack, Typography } from "@mui/material";

import type { ReactNode } from "react";

type SettingsRowProps = {
  label: string;
  description?: string;
  control: ReactNode;
};

export default function SettingsRow({
  label,
  description,
  control,
}: SettingsRowProps) {
  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      sx={{
        alignItems: {
          xs: "stretch",
          sm: "center",
        },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <div>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              mt: 0.25,
              color: "text.secondary",
            }}
          >
            {description}
          </Typography>
        )}
      </div>

      {control}
    </Stack>
  );
}
