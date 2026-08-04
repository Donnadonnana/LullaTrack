import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "../../store/hooks";

export default function AuthGuard() {
  const { user, idToken, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !idToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
