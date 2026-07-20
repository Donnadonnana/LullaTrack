import { Stack, Typography } from "@mui/material";

type ReportMetricProps = {
  label: string;
  value: string;
};

export default function ReportMetric({ label, value }: ReportMetricProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
