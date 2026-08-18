import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { signOutUser } from "../../store/slices/authSlice";

import { clearBabyState } from "../../store/slices/babySlice";

import { toggleTheme } from "../../store/slices/themeSlice";

import BabySelector from "../BabySelector/BabySelector";
import { FONT_DISPLAY } from "../../theme/theme";

const EXPANDED_WIDTH = 250;
const COLLAPSED_WIDTH = 84;
const MOBILE_WIDTH = 280;

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
  onClose: () => void;
};

export default function Sidebar({ isOpen, onToggle, onClose }: SidebarProps) {
  const theme = useTheme();
  const { nursery } = theme.palette;

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const themeMode = useAppSelector((state) => state.theme.mode);
  const isDarkMode = themeMode === "dark";

  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    if (previousPathname.current === location.pathname) {
      return;
    }

    previousPathname.current = location.pathname;

    if (isMobile) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  // The icon-rail state only applies to desktop — inside the mobile drawer
  // everything is always shown with labels.
  const showLabels = isMobile || isOpen;

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
    minHeight: 48,
    color: "text.secondary",
    justifyContent: showLabels ? "flex-start" : "center",
    px: showLabels ? 2 : 0,
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

  const content = (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: showLabels ? "space-between" : "center",
          mb: showLabels ? 3 : 1,
          px: showLabels ? 1 : 0,
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

          {showLabels && (
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

        {isMobile ? (
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close menu"
            sx={{ color: "text.secondary" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        ) : (
          isOpen && (
            <Tooltip title="Collapse sidebar">
              <IconButton
                size="small"
                onClick={onToggle}
                sx={{ color: "text.secondary" }}
              >
                <ChevronLeftRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        )}
      </Stack>

      {!isMobile && !isOpen && (
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

      {showLabels && (
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
                  minWidth: showLabels ? 40 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {showLabels && <ListItemText primary={item.label} />}
            </ListItemButton>
          );

          return (
            <Box key={item.to}>
              {showLabels ? (
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
        <ListItemButton
          onClick={handleThemeToggle}
          sx={{
            borderRadius: 3,
            mb: 0.75,
            minHeight: 48,
            color: "text.secondary",
            justifyContent: showLabels ? "space-between" : "center",
            px: showLabels ? 2 : 0,
            "&:hover": { bgcolor: nursery.moonTint },
          }}
        >
          <Stack
            direction="row"
            spacing={showLabels ? 1.25 : 0}
            sx={{ alignItems: "center" }}
          >
            <ListItemIcon
              sx={{
                minWidth: showLabels ? 40 : "auto",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              {isDarkMode ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </ListItemIcon>

            {showLabels && (
              <ListItemText primary={isDarkMode ? "Dark mode" : "Light mode"} />
            )}
          </Stack>

          {showLabels && (
            <Switch
              edge="end"
              size="small"
              checked={isDarkMode}
              onChange={handleThemeToggle}
              onClick={(event) => event.stopPropagation()}
            />
          )}
        </ListItemButton>

        <ListItemButton
          onClick={handleSignOut}
          sx={{
            borderRadius: 3,
            minHeight: 48,
            color: "text.secondary",
            justifyContent: showLabels ? "flex-start" : "center",
            px: showLabels ? 2 : 0,

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
              minWidth: showLabels ? 40 : "auto",
              justifyContent: "center",
              color: "inherit",
            }}
          >
            <LogoutRoundedIcon />
          </ListItemIcon>

          {showLabels && <ListItemText primary="Sign out" />}
        </ListItemButton>
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onClose={onClose}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: MOBILE_WIDTH,
              px: 2,
              py: 3,
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              backgroundImage: "none",
            },
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

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
      {content}
    </Box>
  );
}
