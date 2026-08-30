"use client";

import KPICard from "./KPICard";
import {
  FileText,
  Search,
  MapPinned,
  CheckCircle2,
  Brain,
  Flame,
  Scale,
  AlertCircle,
} from "lucide-react";
import type { DashboardKPISummary } from "@/types/apiTypes";

interface KPIGridProps {
  kpis?: DashboardKPISummary;
  loading?: boolean;
}

export default function KPIGrid({ kpis, loading }: KPIGridProps) {
  const total = kpis?.totalCases ?? 1499;
  const active = kpis?.activeCases ?? 1034;
  const chargeSheeted = kpis?.chargeSheetedCases ?? 295;
  const closed = kpis?.closedCases ?? 134;
  const pendingReview = kpis?.pendingReviewCases ?? 36;
  const rate = kpis?.chargesheetRate ?? 19.7;

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Total FIRs (Data Store)"
        value={loading ? "..." : total.toLocaleString()}
        change="May - July 2026 Universe"
        icon={FileText}
        color="bg-blue-600"
      />

      <KPICard
        title="Under Investigation"
        value={loading ? "..." : active.toLocaleString()}
        change={`${Math.round((active / total) * 100)}% of total caseload`}
        icon={Search}
        color="bg-amber-500"
      />

      <KPICard
        title="Charge Sheeted"
        value={loading ? "..." : chargeSheeted.toLocaleString()}
        change={`${rate}% chargesheet rate`}
        icon={CheckCircle2}
        color="bg-emerald-600"
      />

      <KPICard
        title="Closed / Disposed"
        value={loading ? "..." : closed.toLocaleString()}
        change={`${Math.round((closed / total) * 100)}% final closure`}
        icon={Scale}
        color="bg-indigo-600"
      />

      <KPICard
        title="Active Districts"
        value="38"
        change="Statewide coverage"
        icon={MapPinned}
        color="bg-purple-600"
      />

      <KPICard
        title="Police Stations (Units)"
        value="76"
        change="2 stations per district"
        icon={Flame}
        color="bg-rose-500"
      />

      <KPICard
        title="Investigating Officers"
        value="76"
        change="Active case assignments"
        icon={Brain}
        color="bg-teal-600"
      />

      <KPICard
        title="Pending Review / Signals"
        value={loading ? "..." : pendingReview.toLocaleString()}
        change="Attention queue items"
        icon={AlertCircle}
        color="bg-orange-600"
      />
    </section>
  );
}