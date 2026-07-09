import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { router } from "./routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App>
          <RouterProvider router={router} />
        </App>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
