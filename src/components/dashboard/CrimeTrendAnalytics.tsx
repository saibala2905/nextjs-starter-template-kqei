import CrimeTrendChart from "./CrimeTrendChart";
import CrimeCategoryChart from "./CrimeCategoryChart";

export default function CrimeTrendAnalytics() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      <div className="lg:col-span-2">
        <CrimeTrendChart />
      </div>

      <CrimeCategoryChart />

    </section>
  );
}