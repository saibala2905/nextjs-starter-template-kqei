"use client";

import { Network } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";

import InvestigationWorkspace from "@/components/intelligence/workspace/InvestigationWorkspace";
import InvestigationCanvas from "@/components/intelligence/canvas/InvestigationCanvas";

import InvestigationSummary from "@/components/intelligence/panels/InvestigationSummary";
import EntityInspector from "@/components/intelligence/panels/EntityInspector";

export default function NetworkIntelligencePage() {
  return (
    <div className="space-y-8">

      <SectionHeader
        icon={<Network size={22} />}
        title="Network Intelligence"
        description="Build and analyse investigation knowledge graphs, entity relationships and criminal networks."
        badges={[
          {
            label: "Entity Search",
            color: "blue",
          },
          {
            label: "Knowledge Graph",
            color: "green",
          },
          {
            label: "Link Analysis",
            color: "purple",
          },
        ]}
        open={true}
        onToggle={() => {}}
      />

      <div className="grid gap-6 xl:grid-cols-12">

        {/* ====================== */}
        {/* Investigation Workspace */}
        {/* ====================== */}

        <div className="xl:col-span-3">

          <InvestigationWorkspace />

        </div>

        {/* ====================== */}
        {/* Investigation Area */}
        {/* ====================== */}

        <div className="space-y-6 xl:col-span-6">

          <InvestigationSummary />

          <InvestigationCanvas />

        </div>

        {/* ====================== */}
        {/* Investigation Inspector */}
        {/* ====================== */}

        <div className="xl:col-span-3">

          <EntityInspector />

        </div>

      </div>

    </div>
  );
}