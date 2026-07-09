import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import PageHeader from "../components/PageLayout/PageHeader";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <PageHeader />
        <Box sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
