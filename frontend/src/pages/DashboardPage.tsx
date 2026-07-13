import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { startOnboarding } from "../store/slices/babySlice";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { babies, activeBabyId } = useAppSelector(
    (state) => state.babies
  );

  const activeBaby = babies.find(
    (baby) => baby.id === activeBabyId
  );

  const openOnboarding = (
    mode: "add" | "restart"
  ) => {
    dispatch(startOnboarding(mode));
    navigate("/onboarding");
  };

  // TODO: temp buttons to test onboarding 
  return (
    <Stack spacing={3}>
      <Typography variant="h5">
        Welcome to {activeBaby?.name ?? "LullaTrack"}
      </Typography>

      {activeBaby && (
        <Typography color="text.secondary">
          {activeBaby.name} is {activeBaby.ageMonths} months old.
        </Typography>
      )}

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => openOnboarding("add")}
        >
          Add another baby
        </Button>

        <Button
          variant="outlined"
          onClick={() => openOnboarding("restart")}
          disabled={!activeBaby}
        >
          Restart onboarding
        </Button>
      </Stack>
    </Stack>
  );
}