import { Box, Divider, Typography } from "@mui/material";

import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  rightContent?: ReactNode;
};

export default function PageHeader({ title, rightContent }: PageHeaderProps) {
  return (
    <div>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </Typography>

        {rightContent && <Box>{rightContent}</Box>}

        <Box />
      </Box>
      <Divider sx={{ mt: 2 }} />
    </div>
  );
}
