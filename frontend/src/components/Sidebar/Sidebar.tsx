import type { ReactNode } from "react";

import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { NavLink, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { signOutUser } from "../../store/slices/authSlice";

import { clearBabyState } from "../../store/slices/babySlice";

import { toggleTheme } from "../../store/slices/themeSlice";

import BabySelector from "../BabySelector/BabySelector";
import { FONT_DISPLAY } from "../../theme/theme";

const EXPANDED_WIDTH = 250;
const COLLAPSED_WIDTH = 84;

type NavItemConfig = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const navItems: NavItemConfig[] = [
  { to: "/", label: "Dashboard", icon: <DashboardRoundedIcon />, end: true },
  { to: "/sleep", label: "Sleep", icon: <BedtimeRoundedIcon /> },
  { to: "/feeding", label: "Feeding", icon: <RestaurantRoundedIcon /> },
  { to: "/settings", label: "Settings", icon: <SettingsRoundedIcon /> },
];

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const theme = useTheme();
  const { nursery } = theme.palette;

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
    mb: 0.75,
    color: "text.secondary",
    justifyContent: isOpen ? "flex-start" : "center",
    px: isOpen ? 2 : 0,
    transition: theme.transitions.create(["background-color", "padding"], {
      duration: theme.transitions.duration.shorter,
    }),

    "&.active": {
      bgcolor: "primary.main",
      color: "primary.contrastText",
      boxShadow: nursery.cardShadow,

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
        width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,

        height: "100vh",
        position: "sticky",
        top: 0,

        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",

        display: "flex",
        flexDirection: "column",

        px: isOpen ? 2 : 1.25,
        py: 3,

        overflowX: "hidden",
        overflowY: "auto",

        transition: theme.transitions.create(["width", "padding"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          mb: isOpen ? 3 : 1,
          px: isOpen ? 1 : 0,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
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
              bgcolor: nursery.moonTint,
            }}
          >
            <BedtimeRoundedIcon sx={{ fontSize: 20, color: nursery.moon }} />
          </Box>

          {isOpen && (
            <Typography
              noWrap
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                fontSize: 19,
                color: "text.primary",
              }}
            >
              LullaTrack
            </Typography>
          )}
        </Stack>

        {isOpen && (
          <Tooltip title="Collapse sidebar">
            <IconButton
              size="small"
              onClick={onToggle}
              sx={{ color: "text.secondary" }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {!isOpen && (
        <Tooltip title="Expand sidebar" placement="right">
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{ color: "text.secondary", alignSelf: "center", mb: 2 }}
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {isOpen && (
        <Box sx={{ mb: 3 }}>
          <BabySelector />
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {navItems.map((item) => {
          const button = (
            <ListItemButton
              component={NavLink}
              to={item.to}
              end={item.end}
              sx={navItemStyles}
            >
              <ListItemIcon
                sx={{
                  minWidth: isOpen ? 40 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {isOpen && <ListItemText primary={item.label} />}
            </ListItemButton>
          );

          return (
            <Box key={item.to}>
              {isOpen ? (
                button
              ) : (
                <Tooltip title={item.label} placement="right">
                  {button}
                </Tooltip>
              )}
            </Box>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {(() => {
          const themeButton = (
            <ListItemButton
              onClick={handleThemeToggle}
              sx={{
                borderRadius: 3,
                mb: 0.75,
                color: "text.secondary",
                justifyContent: isOpen ? "space-between" : "center",
                px: isOpen ? 2 : 0,
                "&:hover": { bgcolor: nursery.moonTint },
              }}
            >
              <Stack
                direction="row"
                spacing={isOpen ? 1.25 : 0}
                sx={{ alignItems: "center" }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isOpen ? 40 : "auto",
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  {isDarkMode ? (
                    <DarkModeRoundedIcon />
                  ) : (
                    <LightModeRoundedIcon />
                  )}
                </ListItemIcon>

                {isOpen && (
                  <ListItemText
                    primary={isDarkMode ? "Dark mode" : "Light mode"}
                  />
                )}
              </Stack>

              {isOpen && (
                <Switch
                  edge="end"
                  size="small"
                  checked={isDarkMode}
                  onChange={handleThemeToggle}
                  onClick={(event) => event.stopPropagation()}
                />
              )}
            </ListItemButton>
          );

          return isOpen ? (
            themeButton
          ) : (
            <Tooltip
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              placement="right"
            >
              {themeButton}
            </Tooltip>
          );
        })()}

        {(() => {
          const signOutButton = (
            <ListItemButton
              onClick={handleSignOut}
              sx={{
                borderRadius: 3,
                color: "text.secondary",
                justifyContent: isOpen ? "flex-start" : "center",
                px: isOpen ? 2 : 0,

                "&:hover": {
                  bgcolor: nursery.roseTint,
                  color: nursery.rose,

                  "& .MuiListItemIcon-root": {
                    color: nursery.rose,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isOpen ? 40 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <LogoutRoundedIcon />
              </ListItemIcon>

              {isOpen && <ListItemText primary="Sign out" />}
            </ListItemButton>
          );

          return isOpen ? (
            signOutButton
          ) : (
            <Tooltip title="Sign out" placement="right">
              {signOutButton}
            </Tooltip>
          );
        })()}
      </List>
    </Box>
  );
}
