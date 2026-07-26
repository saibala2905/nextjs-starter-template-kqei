"use client";

import { useMemo, useState } from "react";

import {
  ClipboardList,
  Network,
} from "lucide-react";

import SearchBar from "./SearchBar";
import EntityFilter from "./EntityFilter";
import SearchResults from "./SearchResults";
import QueuePanel from "./QueuePanel";
import InvestigationActions from "./InvestigationActions";

import { searchEntities } from "@/lib/investigation/search";
import { buildInvestigation } from "@/lib/investigation/investigationEngine";

import { Entity } from "@/types/investigation";

import { useInvestigationStore } from "@/store/investigationStore";

export default function InvestigationWorkspace() {

  const [query, setQuery] = useState("");

  const [filter, setFilter] = useState("All");

  const {
    entities,
    addEntity,
    removeEntity,
    clearCanvas,
    setCanvas,
  } = useInvestigationStore();

  const searchResults = useMemo(() => {

    if (!query.trim()) return [];

    let results = searchEntities(query);

    if (filter !== "All") {

      results = results.filter(
        (entity) => entity.type === filter
      );

    }

    return results;

  }, [query, filter]);

  const handleAdd = (entity: Entity) => {

    const exists = entities.some(
      (e) => e.id === entity.id
    );

    if (!exists) {

      addEntity(entity);

    }

  };

  const handleBuildGraph = () => {

    const investigation =
      buildInvestigation(
        entities,
        {
          depth: 1,
        }
      );

    setCanvas(
      investigation.nodes,
      investigation.edges
    );

    console.log(
      "Investigation Result",
      investigation
    );

  };

  return (

    <div className="rounded-2xl border bg-white shadow-sm">

      {/* Header */}

      <div className="border-b px-6 py-5">

        <div className="flex items-center gap-3">

          <ClipboardList className="h-6 w-6 text-blue-600" />

          <div>

            <h2 className="text-lg font-semibold">
              Investigation Workspace
            </h2>

            <p className="text-sm text-slate-500">
              Search, collect and analyse investigation entities.
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-6 p-6">

        <SearchBar
          value={query}
          onChange={setQuery}
        />

        <EntityFilter
          selected={filter}
          onChange={setFilter}
        />

        <SearchResults
          entities={searchResults}
          onAdd={handleAdd}
        />

        <QueuePanel
          entities={entities}
          onRemove={removeEntity}
        />

        <InvestigationActions
          disabled={entities.length === 0}
          onClear={clearCanvas}
          onBuild={handleBuildGraph}
        />

      </div>

      {/* Footer */}

      <div className="border-t bg-slate-50 px-6 py-4">

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-600">
            Active Investigation
          </span>

          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1">

            <Network className="h-4 w-4 text-blue-600" />

            <span className="text-sm font-semibold text-blue-700">
              {entities.length} Entities Selected
            </span>

          </div>

        </div>

      </div>

    </div>

  );

}