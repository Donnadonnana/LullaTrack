import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";

const SIDEBAR_STORAGE_KEY = "lullatrack:sidebarOpen";

function getInitialSidebarState(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((current) => !current)}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Box sx={{ px: 4, py: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
