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

import { useAppDispatch } from "../../store/hooks";
import { registerUser } from "../../store/slices/authSlice";
import { startOnboarding } from "../../store/slices/babySlice";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    dispatch(registerUser({ email }));
    dispatch(startOnboarding("create"));

    navigate("/onboarding", { replace: true });
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
              Create your account
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Start tracking your baby's daily routine.
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

          {/* TODO:  force pass for now, useing dummy data */}
          <Button type="submit" variant="contained" size="large">
            Register
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Already registered? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
