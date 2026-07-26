"use client";

import { useState } from "react";

import {
  Shield,
  BrainCircuit,
  MapPinned,
  ChartColumnIncreasing,
} from "lucide-react";

import HeroBanner from "@/components/dashboard/HeroBanner";
import KPIGrid from "@/components/dashboard/KPIGrid";
import SituationAssessment from "@/components/dashboard/SituationAssessment";
import LiveAlertFeed from "@/components/dashboard/LiveAlertFeed";
import CrimeMap from "@/components/dashboard/CrimeMap";
import CrimeTrendAnalytics from "@/components/dashboard/CrimeTrendAnalytics";

import SectionHeader from "@/components/ui/SectionHeader";

export default function DashboardPage() {
  const [sections, setSections] = useState({
    assessment: true,
    intelligence: true,
    analytics: true,
  });

  const toggle = (key: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-12">

      {/* ====================================================== */}
      {/* Operational Overview */}
      {/* ====================================================== */}

      <section>

        <SectionHeader
          icon={<Shield size={22} />}
          title="Operational Overview"
          description="Real-time statewide operational intelligence and AI-powered situational awareness."
          badges={[
            { label: "Hero Banner", color: "blue" },
            { label: "6 KPIs", color: "green" },
            { label: "System Live", color: "green" },
          ]}
          open={true}
          onToggle={() => {}}
        />

        <div className="space-y-8">

          <HeroBanner />

          <KPIGrid />

        </div>

      </section>

      {/* ====================================================== */}
      {/* AI Situation Assessment */}
      {/* ====================================================== */}

      <section>

        <SectionHeader
          icon={<BrainCircuit size={22} />}
          title="AI Situation Assessment"
          description="Current threat level, AI recommendations and live operational alerts."
          badges={[
            { label: "Threat: HIGH", color: "red" },
            { label: "Risk Score: 82", color: "orange" },
            { label: "4 AI Recommendations", color: "blue" },
            { label: "Live Alerts", color: "purple" },
          ]}
          open={sections.assessment}
          onToggle={() => toggle("assessment")}
        />

        {sections.assessment && (

          <div className="grid gap-8 xl:grid-cols-3">

            <div className="xl:col-span-2">
              <SituationAssessment />
            </div>

            <div>
              <LiveAlertFeed />
            </div>

          </div>

        )}

      </section>

      {/* ====================================================== */}
      {/* Geospatial Crime Intelligence */}
      {/* ====================================================== */}

      <section>

        <SectionHeader
          icon={<MapPinned size={22} />}
          title="Geospatial Crime Intelligence"
          description="Interactive statewide hotspot monitoring and district-level crime visualization."
          badges={[
            { label: "Interactive Map", color: "blue" },
            { label: "18 Hotspots", color: "red" },
            { label: "12 High Risk Districts", color: "orange" },
            { label: "Live GIS", color: "green" },
          ]}
          open={sections.intelligence}
          onToggle={() => toggle("intelligence")}
        />

        {sections.intelligence && (

          <CrimeMap />

        )}

      </section>

      {/* ====================================================== */}
      {/* Crime Analytics */}
      {/* ====================================================== */}

      <section>

        <SectionHeader
          icon={<ChartColumnIncreasing size={22} />}
          title="Crime Analytics"
          description="Crime trends, category distribution and predictive statistical insights."
          badges={[
            { label: "Trend Analysis", color: "purple" },
            { label: "5 Crime Categories", color: "blue" },
            { label: "7 Day Intelligence", color: "green" },
            { label: "AI Forecast", color: "orange" },
          ]}
          open={sections.analytics}
          onToggle={() => toggle("analytics")}
        />

        {sections.analytics && (

          <CrimeTrendAnalytics />

        )}

      </section>

    </div>
  );
}