import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
  summary: ReactNode;
  isComplete: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onSave: () => void;
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
  hasChanges,
  isSaving,
  isDeleting,
  onSave,
  onDelete,
  children,
}: FeedingCardShellProps) {
  const { nursery } = useTheme().palette;

  const [isExpanded, setIsExpanded] = useState(!isComplete);
  const wasComplete = useRef(isComplete);

  useEffect(() => {
    if (wasComplete.current === isComplete) {
      return;
    }

    wasComplete.current = isComplete;
    // Deliberately not calling setIsExpanded here — completeness
    // changing (e.g. right after Save) should not force a collapse.
  }, [isComplete]);

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
              {hasChanges && (
                <Chip
                  label="Unsaved"
                  size="small"
                  sx={{
                    bgcolor: nursery.sunTint,
                    color: nursery.sun,
                    fontWeight: 700,
                    border: "none",
                  }}
                />
              )}

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
                  disabled={isDeleting}
                  onClick={onDelete}
                  sx={{ color: nursery.rose }}
                >
                  {isDeleting ? (
                    <CircularProgress size={18} sx={{ color: nursery.rose }} />
                  ) : (
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Collapse in={isExpanded} unmountOnExit>
            <Stack spacing={2}>
              {children}

              <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                <Button
                  disableElevation
                  variant="contained"
                  disabled={!hasChanges || isSaving || isDeleting}
                  onClick={onSave}
                  startIcon={
                    isSaving ? (
                      <CircularProgress size={16} sx={{ color: "#fff" }} />
                    ) : undefined
                  }
                  sx={{
                    bgcolor: accent,
                    "&:hover": { bgcolor: accent, filter: "brightness(0.92)" },
                  }}
                >
                  {isSaving ? "Saving…" : "Save"}
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
