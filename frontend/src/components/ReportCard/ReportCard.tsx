import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
  } from "@mui/material";
  
  import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
  import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
  import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
  
  import type {
    ReactNode,
  } from "react";
  
  import type {
    TrendDirection,
  } from "../../types/reports";
  
  type ReportCardProps = {
    title: string;
    icon: ReactNode;
    primaryValue: string;
    primaryLabel: string;
    trend?: TrendDirection;
    children: ReactNode;
  };
  
  function getTrendContent(
    trend: TrendDirection,
  ) {
    if (trend === "up") {
      return {
        label: "Improving",
        icon: <TrendingUpOutlinedIcon />,
        color: "success" as const,
      };
    }
  
    if (trend === "down") {
      return {
        label: "Lower",
        icon: <TrendingDownOutlinedIcon />,
        color: "warning" as const,
      };
    }
  
    return {
      label: "Stable",
      icon: <TrendingFlatOutlinedIcon />,
      color: "default" as const,
    };
  }
  
  export default function ReportCard({
    title,
    icon,
    primaryValue,
    primaryLabel,
    trend,
    children,
  }: ReportCardProps) {
    const trendContent = trend
      ? getTrendContent(trend)
      : null;
  
    return (
      <Card
        sx={{
          height: "100%",
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
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                sx={{
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2.5,
                    bgcolor: "action.hover",
                    color: "primary.main",
                  }}
                >
                  {icon}
                </Box>
  
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {title}
                </Typography>
              </Stack>
  
              {trendContent && (
                <Chip
                  size="small"
                  color={trendContent.color}
                  icon={trendContent.icon}
                  label={trendContent.label}
                  variant="outlined"
                />
              )}
            </Stack>
  
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                {primaryValue}
              </Typography>
  
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                }}
              >
                {primaryLabel}
              </Typography>
            </Box>
  
            <Stack spacing={1.5}>
              {children}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }