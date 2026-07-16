import { useState, type MouseEvent } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Stack,
  Typography,
} from "@mui/material";

import BabyChangingStationOutlinedIcon from "@mui/icons-material/BabyChangingStationOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveBaby, startOnboarding } from "../../store/slices/babySlice";

const getBabyColor = (gender: "boy" | "girl") =>
  gender === "boy" ? "#76A9EA" : "#E89AB7";

const getBabyBackground = (gender: "boy" | "girl") =>
  gender === "boy" ? "rgba(118, 169, 234, 0.16)" : "rgba(232, 154, 183, 0.16)";

export default function BabySelector() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleSelectBaby = (babyId: string) => {
    dispatch(setActiveBaby(babyId));
    handleClose();
  };

  const handleAddBaby = () => {
    dispatch(startOnboarding("add"));
    handleClose();
    navigate("/onboarding");
  };

  const handleEditBaby = (
    event: MouseEvent<HTMLButtonElement>,
    babyId: string,
  ) => {
    // Prevent selecting the list item before opening edit.
    event.stopPropagation();

    dispatch(setActiveBaby(babyId));
    dispatch(startOnboarding("restart"));

    handleClose();
    navigate("/onboarding");
  };

  if (!activeBaby) {
    return (
      <ListItemButton
        onClick={handleAddBaby}
        sx={{
          borderRadius: 3,
          bgcolor: "background.default",
        }}
      >
        <AddOutlinedIcon sx={{ mr: 1.5 }} />

        <ListItemText primary="Add a baby" secondary="Complete onboarding" />
      </ListItemButton>
    );
  }

  const activeBabyColor = getBabyColor(activeBaby.gender);
  const activeBabyBackground = getBabyBackground(activeBaby.gender);

  return (
    <>
      <ButtonBase
        onClick={handleOpen}
        aria-haspopup="menu"
        aria-expanded={isOpen ? "true" : undefined}
        sx={{
          width: "100%",
          display: "block",
          textAlign: "left",
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            width: "100%",
            p: 2,
            borderRadius: 3,
            alignItems: "center",
            bgcolor: "background.default",

            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: activeBabyBackground,
            }}
          >
            <BabyChangingStationOutlinedIcon sx={{ color: activeBabyColor }} />
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
              {activeBaby.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {activeBaby.ageMonths}{" "}
              {activeBaby.ageMonths === 1 ? "month" : "months"} old
            </Typography>
          </Box>

          <KeyboardArrowDownOutlinedIcon
            sx={{
              color: "text.secondary",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms ease",
            }}
          />
        </Stack>
      </ButtonBase>

      <Menu
        anchorEl={anchorElement}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxWidth: "calc(100vw - 32px)",
              mt: 1,
              overflow: "hidden",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            Your babies
          </Typography>
        </Box>

        <Divider />

        {/* Only this section scrolls */}
        <List
          disablePadding
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            py: 1,
          }}
        >
          {babies.map((baby) => {
            const isActive = baby.id === activeBabyId;
            const babyColor = getBabyColor(baby.gender);
            const babyBackground = getBabyBackground(baby.gender);

            return (
              <ListItemButton
                key={baby.id}
                selected={isActive}
                onClick={() => handleSelectBaby(baby.id)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  pr: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    mr: 1.5,
                    bgcolor: babyBackground,
                  }}
                >
                  <BabyChangingStationOutlinedIcon
                    fontSize="small"
                    sx={{ color: babyColor }}
                  />
                </Avatar>

                <ListItemText
                  primary={baby.name}
                  secondary={`${baby.ageMonths} ${
                    baby.ageMonths === 1 ? "month" : "months"
                  } old`}
                  slotProps={{
                    primary: {
                      noWrap: true,
                      sx: {
                        fontWeight: isActive ? 700 : 500,
                      },
                    },
                  }}
                />

                {isActive && (
                  <CheckOutlinedIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mr: 0.5 }}
                  />
                )}

                <IconButton
                  size="small"
                  aria-label={`Edit ${baby.name}`}
                  onClick={(event) => handleEditBaby(event, baby.id)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            );
          })}
        </List>

        <Divider />

        {/* This remains fixed and does not scroll */}
        <Box sx={{ p: 1 }}>
          <ListItemButton
            onClick={handleAddBaby}
            sx={{
              borderRadius: 2,
              color: "primary.main",
            }}
          >
            <AddOutlinedIcon sx={{ mr: 1.5 }} />

            <ListItemText
              primary="Add a new baby"
              slotProps={{
                primary: {
                  sx: {
                    fontWeight: 700,
                  },
                },
              }}
            />
          </ListItemButton>
        </Box>
      </Menu>
    </>
  );
}
