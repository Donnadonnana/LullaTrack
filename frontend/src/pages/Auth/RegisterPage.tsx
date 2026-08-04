import { useState, type FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  clearAuthError,
  setRegistrationDraft,
} from "../../store/slices/authSlice";

import { startOnboarding } from "../../store/slices/babySlice";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authError = useAppSelector((state) => state.auth.error);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(clearAuthError());
    setFormError(null);

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");

      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");

      return;
    }

    /*
     * Do not call registerAccount here.
     * The backend registration request requires
     * both user and baby information.
     */
    dispatch(
      setRegistrationDraft({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    );

    dispatch(startOnboarding("create"));

    navigate("/onboarding", {
      replace: true,
    });
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
              Create your account
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
              }}
            >
              Start tracking your baby&apos;s daily routine.
            </Typography>
          </Box>

          {(formError || authError) && (
            <Alert severity="error">{formError ?? authError}</Alert>
          )}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="First name"
              value={firstName}
              autoComplete="given-name"
              onChange={(event) => setFirstName(event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Last name"
              value={lastName}
              autoComplete="family-name"
              onChange={(event) => setLastName(event.target.value)}
              required
              fullWidth
            />
          </Stack>

          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            autoComplete="new-password"
            helperText="Use at least 6 characters."
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            fullWidth
          />

          <Button type="submit" variant="contained" size="large">
            Continue
          </Button>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
            }}
          >
            Already registered? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
