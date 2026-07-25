import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { NavLink, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { signOutUser } from "../../store/slices/authSlice";

import { clearBabyState } from "../../store/slices/babySlice";

import { toggleTheme } from "../../store/slices/themeSlice";

import BabySelector from "../BabySelector/BabySelector";

const drawerWidth = 250;

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const themeMode = useAppSelector((state) => state.theme.mode);

  const isDarkMode = themeMode === "dark";

  const handleSignOut = () => {
    dispatch(signOutUser());
    dispatch(clearBabyState());

    navigate("/login", {
      replace: true,
    });
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const navItemStyles = {
    borderRadius: 3,
    mb: 1,
    color: "text.secondary",

    "&.active": {
      bgcolor: "primary.main",
      color: "primary.contrastText",

      "& .MuiListItemIcon-root": {
        color: "primary.contrastText",
      },

      "&:hover": {
        bgcolor: "primary.dark",
      },
    },
  };

  return (
    <Box
      component="aside"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        height: "100vh",
        position: "sticky",
        top: 0,

        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",

        display: "flex",
        flexDirection: "column",

        px: 2,
        py: 3,

        overflowY: "auto",
      }}
    >
      <Typography
        variant="h5"
        color="primary"
        sx={{
          px: 1,
          mb: 3,
          fontWeight: 800,
        }}
      >
        LullaTrack
      </Typography>

      <Box sx={{ mb: 3 }}>
        <BabySelector />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        <ListItemButton component={NavLink} to="/" end sx={navItemStyles}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/sleep" sx={navItemStyles}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <BedtimeOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Sleep" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/feeding" sx={navItemStyles}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LocalDiningOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Feeding" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/settings" sx={navItemStyles}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        <ListItemButton
          onClick={handleThemeToggle}
          sx={{
            borderRadius: 3,
            mb: 1,
            color: "text.secondary",
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {isDarkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </ListItemIcon>

          <Switch
            edge="end"
            checked={isDarkMode}
            onChange={handleThemeToggle}
            onClick={(event) => event.stopPropagation()}
          />
        </ListItemButton>

        <ListItemButton
          onClick={handleSignOut}
          sx={{
            borderRadius: 3,
            color: "text.secondary",

            "&:hover": {
              bgcolor: "error.main",
              color: "error.contrastText",

              "& .MuiListItemIcon-root": {
                color: "error.contrastText",
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Sign out" />
        </ListItemButton>
      </List>
    </Box>
  );
}
