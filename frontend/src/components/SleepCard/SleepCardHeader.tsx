import type { ReactNode } from "react";

import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import type { SleepLog } from "../../store/slices/sleepSlice";
import type { SleepDraft } from "../../types/sleepCard";
import { CollapsedSummary } from "./SleepCardSummary";

const FONT_DISPLAY = "'Fraunces', Georgia, serif";

type SleepCardHeaderProps = {
  type: SleepLog["type"];
  draft: SleepDraft;
  title: string;
  icon: ReactNode;
  accent: string;
  accentTint: string;
  isExpanded: boolean;
  inProgress: boolean;
  hasChanges: boolean;
  isDeleting: boolean;
  napSleepMinutes: number | null;
  napInBedMinutes: number | null;
  wakeDurationValue: number | null;
  onToggleExpand: () => void;
  onDelete: () => void;
};

export default function SleepCardHeader({
  type,
  draft,
  title,
  icon,
  accent,
  accentTint,
  isExpanded,
  inProgress,
  hasChanges,
  isDeleting,
  napSleepMinutes,
  napInBedMinutes,
  wakeDurationValue,
  onToggleExpand,
  onDelete,
}: SleepCardHeaderProps) {
  const { nursery } = useTheme().palette;

  return (
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
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "baseline", flexWrap: "wrap" }}
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

            {inProgress && (
              <Box
                sx={{ px: 1, py: 0.25, borderRadius: 999, bgcolor: accentTint }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: accent,
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  In progress
                </Typography>
              </Box>
            )}

            {!isExpanded && (
              <CollapsedSummary
                type={type}
                draft={draft}
                accent={accent}
                napSleepMinutes={napSleepMinutes}
                napInBedMinutes={napInBedMinutes}
                wakeDurationValue={wakeDurationValue}
              />
            )}
          </Stack>

          {!isExpanded && draft.notes && (
            <Typography
              variant="caption"
              noWrap
              sx={{
                display: "block",
                color: "text.secondary",
                maxWidth: { xs: 180, sm: 420 },
              }}
            >
              {draft.notes}
            </Typography>
          )}
        </Box>
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
            onClick={onToggleExpand}
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
  );
}
