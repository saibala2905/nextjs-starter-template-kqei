"use client";

import CrimeTrendChart from "./CrimeTrendChart";
import CrimeCategoryChart from "./CrimeCategoryChart";
import type { MonthlyCrimeMovement, TopCrimeCategory } from "@/types/apiTypes";

interface CrimeTrendAnalyticsProps {
  monthlyMovement?: MonthlyCrimeMovement[];
  topCrimes?: TopCrimeCategory[];
}

export default function CrimeTrendAnalytics({
  monthlyMovement,
  topCrimes,
}: CrimeTrendAnalyticsProps) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CrimeTrendChart monthlyMovement={monthlyMovement} />
      </div>

      <div>
        <CrimeCategoryChart topCrimes={topCrimes} />
      </div>
    </section>
  );
}