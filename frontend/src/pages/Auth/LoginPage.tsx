import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signInUser } from "../../store/slices/authSlice";
import { startOnboarding } from "../../store/slices/babySlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const babies = useAppSelector((state) => state.babies.babies);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    dispatch(signInUser({ email }));

    if (babies.length === 0) {
      dispatch(startOnboarding("create"));
      navigate("/onboarding", { replace: true });
      return;
    }

    navigate("/", { replace: true });
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
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Welcome back
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Sign in to continue to LullaTrack.
            </Typography>
          </Box>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />

          <TextField label="Password" type="password" required fullWidth />
          {/* TODO: happy path for now, using dummy data */}
          <Button type="submit" variant="contained" size="large">
            Sign in
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            New to LullaTrack? <Link to="/register">Register</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
