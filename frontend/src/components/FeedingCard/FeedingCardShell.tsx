import type { ReactNode } from "react";
import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import { FONT_DISPLAY } from "../../theme/theme";

type FeedingCardShellProps = {
  title: string;
  icon: ReactNode;
  accent: string;
  accentTint: string;
  /** Shown next to the title when collapsed. Null hides the summary row. */
  summary: ReactNode;
  /** Starts expanded when the log is still missing key details. */
  isComplete: boolean;
  onDelete: () => void;
  children: ReactNode;
};

export default function FeedingCardShell({
  title,
  icon,
  accent,
  accentTint,
  summary,
  isComplete,
  onDelete,
  children,
}: FeedingCardShellProps) {
  const { nursery } = useTheme().palette;

  const [isExpanded, setIsExpanded] = useState(!isComplete);

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "visible",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: isExpanded ? nursery.cardShadow : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <CardContent
        sx={{
          p: isExpanded ? 2.5 : 1.5,
          "&:last-child": {
            pb: isExpanded ? 2.5 : 1.5,
          },
        }}
      >
        <Stack spacing={isExpanded ? 2 : 0}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 40,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  bgcolor: accentTint,
                  color: accent,
                }}
              >
                {icon}
              </Box>

              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "baseline", flexWrap: "wrap", minWidth: 0 }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    fontSize: 17,
                    color: "text.primary",
                  }}
                >
                  {title}
                </Typography>

                {!isExpanded && summary}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", flexShrink: 0 }}
            >
              <Tooltip title={isExpanded ? "Collapse" : "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded((current) => !current)}
                  sx={{ color: "text.secondary" }}
                >
                  {isExpanded ? (
                    <ExpandLessRoundedIcon fontSize="small" />
                  ) : (
                    <EditRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={onDelete}
                  sx={{ color: nursery.rose }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Collapse in={isExpanded} unmountOnExit>
            {children}
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
