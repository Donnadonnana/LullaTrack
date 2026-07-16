import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import BabyChangingStationOutlinedIcon from "@mui/icons-material/BabyChangingStationOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signOutUser } from "../../store/slices/authSlice";

const drawerWidth = 250;

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const babyIconColor =
    activeBaby?.gender === "boy"
      ? "#76A9EA"
      : activeBaby?.gender === "girl"
        ? "#E89AB7"
        : "text.secondary";

  const handleSignOut = () => {
    dispatch(signOutUser());
    navigate("/login", { replace: true });
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
        minHeight: "100vh",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 3,
      }}
    >
      <Typography
        variant="h5"
        color="primary"
        sx={{ px: 1, mb: 3, fontWeight: 800 }}
      >
        LullaTrack
      </Typography>

      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: "background.default",
        }}
      >
        {activeBaby ? (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor:
                  activeBaby.gender === "boy"
                    ? "rgba(118, 169, 234, 0.16)"
                    : "rgba(232, 154, 183, 0.16)",
              }}
            >
              <BabyChangingStationOutlinedIcon sx={{ color: babyIconColor }} />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                {activeBaby.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {activeBaby.ageMonths}{" "}
                {activeBaby.ageMonths === 1 ? "month" : "months"} old
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Box>
            <Typography sx={{ fontWeight: 700 }}>No baby selected</Typography>

            <Typography variant="body2" color="text.secondary">
              Complete onboarding to add a baby.
            </Typography>
          </Box>
        )}
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
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mb: 2 }} />

      <div>
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
      </div>
    </Box>
  );
}
