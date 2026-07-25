import { Box, Divider, Stack, Typography } from "@mui/material";

import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  rightContent,
}: PageHeaderProps) {
  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        sx={{
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {rightContent && (
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            {rightContent}
          </Box>
        )}
      </Stack>

      <Divider sx={{ mt: 2.5 }} />
    </Box>
  );
}
