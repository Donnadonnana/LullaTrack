import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "../store/slices/themeSlice";

export const createAppTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: mode === "light" ? "#7C6FF6" : "#9A8CFF",
      },

      secondary: {
        main: mode === "light" ? "#FFB6A3" : "#FFCAA5",
      },

      background: {
        default: mode === "light" ? "#FAFAF7" : "#1B1D22",
        paper: mode === "light" ? "#FFFFFF" : "#262A31",
      },

      text: {
        primary: mode === "light" ? "#4e5263" : "#F7F8FA",
        secondary: mode === "light" ? "#6B7280" : "#B6BCC8",
      },

      divider: mode === "light" ? "#E8EAF0" : "#353A44",

      success: {
        main: "#8BC9A3", // Feeding
      },

      info: {
        main: "#A5D8FF", // Sleep
      },

      warning: {
        main: "#FFD6A5", // Growth / Reminder
      },

      error: {
        main: "#F4A6B8", // Health / Alert
      },
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

      h1: {
        fontWeight: 700,
      },

      h2: {
        fontWeight: 700,
      },

      h3: {
        fontWeight: 700,
      },

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 600,
      },

      h6: {
        fontWeight: 600,
      },

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
                ? "0 2px 8px rgba(0,0,0,0.04)"
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
                ? "0 2px 8px rgba(0,0,0,0.04)"
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
            borderRadius: 12,
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