import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";

import ReportCard from "../ReportCard/ReportCard";
import ReportMetric from "../ReportCard/ReportMetric";

import type { SleepDailyReport } from "../../types/reports";

import { formatMinutes } from "../../utils/reports";

type SleepReportCardProps = {
  report: SleepDailyReport;
  title?: string;
};

export default function SleepReportCard({
  report,
  title = "Sleep today",
}: SleepReportCardProps) {
  return (
    <ReportCard
      title={title}
      icon={<BedtimeOutlinedIcon />}
      primaryValue={formatMinutes(report.totalSleepMinutes)}
      primaryLabel="Total sleep"
      trend={report.trend}
    >
      <ReportMetric
        label="Nap sleep"
        value={formatMinutes(report.totalNapMinutes)}
      />

      <ReportMetric
        label="Night sleep"
        value={formatMinutes(report.nightSleepMinutes)}
      />

      <ReportMetric
        label="Average wake window"
        value={formatMinutes(report.averageWakeWindowMinutes)}
      />

      <ReportMetric label="Number of naps" value={`${report.napCount}`} />
    </ReportCard>
  );
}
