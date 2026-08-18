import type { ReactNode } from "react";

import { Stack, Typography } from "@mui/material";

import { FONT_DISPLAY } from "../../theme/theme";

type PageHeaderProps = {
  title: string;
  rightContent?: ReactNode;
};

export default function PageHeader({ title, rightContent }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: { xs: 24, sm: 28 },
          color: "text.primary",
        }}
      >
        {title}
      </Typography>

      {rightContent}
    </Stack>
  );
}
