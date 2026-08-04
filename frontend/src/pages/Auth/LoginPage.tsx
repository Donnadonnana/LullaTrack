import { useState, type FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, signInAccount } from "../../store/slices/authSlice";
import { startOnboarding } from "../../store/slices/babySlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const isLoading = status === "loading";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(clearAuthError());

    try {
      const session = await dispatch(
        signInAccount({
          email: email.trim(),
          password,
        }),
      ).unwrap();

      /*
       * Do not use `babies` from useAppSelector here.
       * That value belongs to the render before the
       * async thunk finished.
       *
       * The fulfilled thunk payload already contains
       * the latest babies from GET /users/me.
       */
      if (session.babies.length === 0) {
        dispatch(startOnboarding("create"));

        navigate("/onboarding", {
          replace: true,
        });

        return;
      }

      navigate("/", {
        replace: true,
      });
    } catch {
      // Redux stores the error in state.auth.error.
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 3,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: 4,
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              Welcome back
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
              }}
            >
              Sign in to continue to LullaTrack.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            autoComplete="current-password"
            disabled={isLoading}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
            }}
          >
            New to LullaTrack? <Link to="/register">Register</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
