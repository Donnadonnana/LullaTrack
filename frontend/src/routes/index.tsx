import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts";
import DashboardPage from "../pages/DashboardPage";
import SleepPage from "../pages/SleepPage";
import FeedingPage from "../pages/FeedingPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router: any = createBrowserRouter([
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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);