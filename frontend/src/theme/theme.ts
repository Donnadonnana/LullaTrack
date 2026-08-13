import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "../store/slices/themeSlice";

export const FONT_DISPLAY = "'Fraunces', Georgia, serif";

// Extra palette slots for the sleep/nursery UI. Each has a light and dark
// value baked in below, so components never need to branch on `mode`
// themselves — they just read theme.palette.nursery.moon, etc.
declare module "@mui/material/styles" {
  interface Palette {
    nursery: {
      moon: string;
      moonTint: string;
      sun: string;
      sunTint: string;
      dawn: string;
      dawnTint: string;
      sage: string;
      sageTint: string;
      rose: string;
      roseTint: string;
      thread: string;
      panelTint: string;
      cardShadow: string;
      badgeOnGradient: string;
      gradientDivider: string;
      emptyStateBg: string;
    };
  }

  interface PaletteOptions {
    nursery?: Palette["nursery"];
  }
}

const nurseryLight = {
  moon: "#6C63AC",
  moonTint: "rgba(108, 99, 172, 0.10)",
  sun: "#E1963C",
  sunTint: "rgba(225, 150, 60, 0.12)",
  dawn: "#E0876B",
  dawnTint: "rgba(224, 135, 107, 0.14)",
  sage: "#7E9680",
  sageTint: "rgba(126, 150, 128, 0.12)",
  rose: "#C97B78",
  roseTint: "rgba(201, 123, 120, 0.10)",
  thread: "#E4DACD",
  panelTint: "rgba(238, 227, 216, 0.35)",
  cardShadow: "0 8px 24px rgba(58, 52, 80, 0.10)",
  badgeOnGradient: "rgba(255, 255, 255, 0.7)",
  gradientDivider: "rgba(255, 255, 255, 0.6)",
  emptyStateBg: "rgba(225, 150, 60, 0.05)",
};

const nurseryDark = {
  moon: "#A79CE0",
  moonTint: "rgba(167, 156, 224, 0.16)",
  sun: "#F2B368",
  sunTint: "rgba(242, 179, 104, 0.16)",
  dawn: "#F0A78E",
  dawnTint: "rgba(240, 167, 142, 0.16)",
  sage: "#A8C2AA",
  sageTint: "rgba(168, 194, 170, 0.16)",
  rose: "#E0A19E",
  roseTint: "rgba(224, 161, 158, 0.16)",
  thread: "#3A3542",
  panelTint: "rgba(255, 255, 255, 0.04)",
  cardShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  badgeOnGradient: "rgba(0, 0, 0, 0.28)",
  gradientDivider: "rgba(255, 255, 255, 0.12)",
  emptyStateBg: "rgba(242, 179, 104, 0.06)",
};

export const createAppTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: mode === "light" ? "#6C63AC" : "#A79CE0",
      },

      secondary: {
        main: mode === "light" ? "#E0876B" : "#F0A78E",
      },

      background: {
        default: mode === "light" ? "#FBF6EF" : "#1E1B24",
        paper: mode === "light" ? "#FFFFFF" : "#28242F",
      },

      text: {
        primary: mode === "light" ? "#3A3450" : "#F5F1FA",
        secondary: mode === "light" ? "#8B8398" : "#B6AFC4",
      },

      divider: mode === "light" ? "#EEE3D8" : "#3A3542",

      success: {
        main: mode === "light" ? "#7E9680" : "#A8C2AA", // Feeding
      },

      info: {
        main: mode === "light" ? "#8F85C9" : "#B9AEE6", // Sleep
      },

      warning: {
        main: mode === "light" ? "#E1963C" : "#F2B368", // Growth / Reminder
      },

      error: {
        main: mode === "light" ? "#C97B78" : "#E0A19E", // Health / Alert
      },

      nursery: mode === "light" ? nurseryLight : nurseryDark,
    },

    shape: {
      borderRadius: 16,
    },

    spacing: 8,

    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),

      h1: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      h2: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      h3: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      h4: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      h5: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      h6: { fontFamily: FONT_DISPLAY, fontWeight: 600 },

      subtitle1: {
        fontWeight: 600,
      },

      body1: {
        lineHeight: 1.7,
      },

      body2: {
        lineHeight: 1.6,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color .2s ease, color .2s ease",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "light"
                ? "0 2px 8px rgba(58, 52, 80, 0.06)"
                : "0 2px 10px rgba(0,0,0,0.25)",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "light"
                ? "0 2px 8px rgba(58, 52, 80, 0.06)"
                : "0 2px 10px rgba(0,0,0,0.25)",
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },

        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingLeft: 20,
            paddingRight: 20,
            height: 42,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            opacity: 0.8,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "none",
          },
        },
      },
    },
  });
