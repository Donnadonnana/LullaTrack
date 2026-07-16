import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/PageLayout/PageHeader";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <PageHeader />

        <Box sx={{ px: 4, py: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}