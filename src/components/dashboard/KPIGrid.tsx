import KPICard from "./KPICard";

import {
  FileText,
  Search,
  MapPinned,
  Users,
  Brain,
  Flame,
} from "lucide-react";

export default function KPIGrid() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <KPICard
        title="Today's FIRs"
        value="2,438"
        change="+8.4% vs Yesterday"
        icon={FileText}
        color="bg-blue-600"
      />

      <KPICard
        title="Active Investigations"
        value="8,432"
        change="312 added today"
        icon={Search}
        color="bg-orange-500"
      />

      <KPICard
        title="High Risk Districts"
        value="5"
        change="2 districts escalated"
        icon={MapPinned}
        color="bg-red-500"
      />

      <KPICard
        title="Repeat Offenders"
        value="412"
        change="18 newly identified"
        icon={Users}
        color="bg-violet-600"
      />

      <KPICard
        title="AI Prediction Confidence"
        value="94%"
        change="Model performing normally"
        icon={Brain}
        color="bg-green-600"
      />

      <KPICard
        title="Crime Hotspots"
        value="12"
        change="3 new hotspots detected"
        icon={Flame}
        color="bg-amber-500"
      />

    </section>
  );
}