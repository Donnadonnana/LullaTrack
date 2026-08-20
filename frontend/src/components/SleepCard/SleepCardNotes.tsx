import { Collapse, TextField, Typography, useTheme } from "@mui/material";

type SleepCardNotesProps = {
  notes: string;
  showNotes: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

export default function SleepCardNotes({
  notes,
  showNotes,
  onToggle,
  onChange,
}: SleepCardNotesProps) {
  const { nursery } = useTheme().palette;

  return (
    <>
      <Typography
        component="button"
        type="button"
        onClick={onToggle}
        sx={{
          alignSelf: "flex-start",
          border: 0,
          p: 0,
          bgcolor: "transparent",
          color: nursery.moon,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {showNotes ? "Hide notes" : "+ Add notes"}
      </Typography>

      <Collapse in={showNotes}>
        <TextField
          label="Wake-ups, feeding, or notes"
          value={notes}
          onChange={(event) => onChange(event.target.value)}
          multiline
          minRows={2}
          maxRows={4}
          size="small"
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
        />
      </Collapse>
    </>
  );
}
