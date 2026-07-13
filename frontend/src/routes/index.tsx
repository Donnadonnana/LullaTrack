import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../components/Guards/AuthGuard";

import MainLayout from "../layouts";
import DashboardPage from "../pages/DashboardPage";
import SleepPage from "../pages/SleepPage";
import FeedingPage from "../pages/FeedingPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import OnboardingPage from "../pages/Onboarding/OnboardingPage";

export const router: any = createBrowserRouter([
  {
    path: "/login",

    element: <LoginPage />,
  },

  {
    path: "/register",

    element: <RegisterPage />,
  },

  {
    element: <AuthGuard />,

    children: [
      {
        path: "/onboarding",

        element: <OnboardingPage />,
      },

      {
        path: "/",

        element: <MainLayout />,

        children: [
          {
            index: true,

            element: <DashboardPage />,

            handle: {
              title: "Dashboard",
            },
          },

          {
            path: "sleep",

            element: <SleepPage />,

            handle: {
              title: "Sleep",
            },
          },

          {
            path: "feeding",

            element: <FeedingPage />,

            handle: {
              title: "Feeding",
            },
          },
        ],
      },
    ],
  },

  {
    path: "*",

    element: <NotFoundPage />,
  },
]);

export default router;
