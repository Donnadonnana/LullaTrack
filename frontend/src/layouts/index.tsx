import { useEffect, useState } from "react";

import {
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import { FONT_DISPLAY } from "../theme/theme";

const SIDEBAR_STORAGE_KEY = "lullatrack:sidebarOpen";

function getStoredSidebarState(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export default function MainLayout() {
  const theme = useTheme();
  const { nursery } = theme.palette;

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // On mobile the sidebar is an overlay drawer, so it must start closed
  // regardless of the persisted desktop preference.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    isMobile ? false : getStoredSidebarState(),
  );

  // Rotating the phone or resizing across the breakpoint shouldn't leave
  // a drawer stuck open over the content.
  useEffect(() => {
    setIsSidebarOpen(isMobile ? false : getStoredSidebarState());
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarOpen));
    }
  }, [isSidebarOpen, isMobile]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((current) => !current)}
        onClose={() => setIsSidebarOpen(false)}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {isMobile && (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: theme.zIndex.appBar,
              px: 2,
              py: 1.5,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <IconButton
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              sx={{ color: "text.secondary" }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", minWidth: 0 }}
            >
              <BedtimeRoundedIcon sx={{ fontSize: 20, color: nursery.moon }} />

              <Typography
                noWrap
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: 17,
                  color: "text.primary",
                }}
              >
                LullaTrack
              </Typography>
            </Stack>
          </Stack>
        )}

        <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
