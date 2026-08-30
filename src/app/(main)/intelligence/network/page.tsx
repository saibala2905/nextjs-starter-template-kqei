"use client";

import { Suspense } from "react";
import { Network, RefreshCw } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import InvestigationWorkspace from "@/components/intelligence/workspace/InvestigationWorkspace";
import InvestigationCanvas from "@/components/intelligence/canvas/InvestigationCanvas";
import InvestigationSummary from "@/components/intelligence/panels/InvestigationSummary";
import EntityInspector from "@/components/intelligence/panels/EntityInspector";

export default function NetworkIntelligencePage() {
  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        icon={<Network size={20} />}
        title="Network Intelligence & Link Analysis"
        description="Construct multi-dimensional investigation graphs connecting FIR Cases, Investigating Officers, Police Stations, Courts, and Incident Locations."
        badges={[
          { label: "React Flow Engine", color: "blue" },
          { label: "Catalyst Link Graph", color: "green" },
          { label: "Multi-Hop Analysis", color: "purple" },
        ]}
        open={true}
        onToggle={() => {}}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        {/* ====================== */}
        {/* Investigation Workspace (3 cols) */}
        {/* ====================== */}
        <div className="xl:col-span-4">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-slate-400">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                <span className="text-xs">Loading investigation workspace...</span>
              </div>
            }
          >
            <InvestigationWorkspace />
          </Suspense>
        </div>

        {/* ====================== */}
        {/* Investigation Area & Canvas (5 cols) */}
        {/* ====================== */}
        <div className="space-y-6 xl:col-span-5">
          <InvestigationSummary />
          <InvestigationCanvas />
        </div>

        {/* ====================== */}
        {/* Investigation Inspector (3 cols) */}
        {/* ====================== */}
        <div className="xl:col-span-3">
          <EntityInspector />
        </div>
      </div>
    </div>
  );
}