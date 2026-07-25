import { Button, MenuItem, Select, Stack, Switch } from "@mui/material";
import PageHeader from "../components/PageLayout/PageHeader";
import SettingsSection from "../components/Settings/SettingsSection"
import SettingsRow from "../components/Settings/SettingsRow";

export default function SettingsPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Settings"
      />

      <SettingsSection
        title="Preferences"
        description="Customize how LullaTrack works for you."
      >
        <SettingsRow
          label="Theme"
          description="Choose your preferred appearance."
          control={
            <Select size="small" value="system" sx={{ minWidth: 150 }}>
              <MenuItem value="system">System</MenuItem>

              <MenuItem value="light">Light</MenuItem>

              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          }
        />

        <SettingsRow
          label="Time format"
          description="Choose how times are displayed."
          control={
            <Select size="small" value="12-hour" sx={{ minWidth: 150 }}>
              <MenuItem value="12-hour">12-hour</MenuItem>

              <MenuItem value="24-hour">24-hour</MenuItem>
            </Select>
          }
        />

        <SettingsRow
          label="Measurement units"
          description="Choose metric or imperial units."
          control={
            <Select size="small" value="metric" sx={{ minWidth: 150 }}>
              <MenuItem value="metric">Metric</MenuItem>

              <MenuItem value="imperial">Imperial</MenuItem>
            </Select>
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="Choose which reminders you receive."
      >
        <SettingsRow
          label="Feeding reminders"
          control={<Switch defaultChecked />}
        />

        <SettingsRow
          label="Sleep reminders"
          control={<Switch defaultChecked />}
        />

        <SettingsRow label="Daily summary" control={<Switch />} />
      </SettingsSection>

      <SettingsSection
        title="Account"
        description="Manage your account session and data."
      >
        <SettingsRow
          label="Sign out"
          description="Sign out of LullaTrack on this device."
          control={<Button variant="outlined">Sign out</Button>}
        />

        <SettingsRow
          label="Delete account"
          description="Permanently remove your account and data."
          control={
            <Button variant="outlined" color="error">
              Delete account
            </Button>
          }
        />
      </SettingsSection>
    </Stack>
  );
}
