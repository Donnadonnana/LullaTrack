import { Card, CardContent, Stack, Typography } from "@mui/material";

import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
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
          <div>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                }}
              >
                {description}
              </Typography>
            )}
          </div>

          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
