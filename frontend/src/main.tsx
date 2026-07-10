import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { router } from "./routes";
import AppThemeProvider from "./theme/AppThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <App>
          <RouterProvider router={router} />
        </App>
        </AppThemeProvider>
    </Provider>
  </React.StrictMode>,
);
