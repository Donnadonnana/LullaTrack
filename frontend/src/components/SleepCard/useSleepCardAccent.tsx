import type { ReactNode } from "react";
import { useTheme } from "@mui/material";

import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";

import type { SleepLog } from "../../store/slices/sleepSlice";

export type SleepAccent = {
  icon: ReactNode;
  accent: string;
  accentTint: string;
  accentHover: string;
  title: string;
};

export function useSleepCardAccent(log: SleepLog): SleepAccent {
  const { nursery } = useTheme().palette;

  if (log.type === "wake") {
    return {
      icon: (
        <WbTwilightRoundedIcon sx={{ fontSize: 20, color: nursery.dawn }} />
      ),
      accent: nursery.dawn,
      accentTint: nursery.dawnTint,
      accentHover: "#C96F55",
      title: "Woke up",
    };
  }

  if (log.type === "nap") {
    return {
      icon: <LightModeRoundedIcon sx={{ fontSize: 20, color: nursery.sun }} />,
      accent: nursery.sun,
      accentTint: nursery.sunTint,
      accentHover: "#CC8530",
      title: `Nap ${log.sleepNumber}`,
    };
  }

  return {
    icon: <DarkModeRoundedIcon sx={{ fontSize: 20, color: nursery.moon }} />,
    accent: nursery.moon,
    accentTint: nursery.moonTint,
    accentHover: "#5A5296",
    title: "Night sleep",
  };
}
