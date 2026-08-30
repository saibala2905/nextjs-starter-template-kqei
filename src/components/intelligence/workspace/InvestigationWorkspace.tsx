"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardList, Network, RefreshCw } from "lucide-react";
import type { Node, Edge } from "reactflow";

import SearchBar from "./SearchBar";
import EntityFilter from "./EntityFilter";
import SearchResults from "./SearchResults";
import QueuePanel from "./QueuePanel";
import InvestigationActions from "./InvestigationActions";

import { searchEntities } from "@/lib/investigation/search";
import { buildInvestigation } from "@/lib/investigation/investigationEngine";
import { kspApi } from "@/services/kspApi";
import { Entity } from "@/types/investigation";
import { useInvestigationStore } from "@/store/investigationStore";

export default function InvestigationWorkspace() {
  const searchParams = useSearchParams();
  const caseIdParam = searchParams.get("caseId");

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [liveCaseResults, setLiveCaseResults] = useState<Entity[]>([]);
  const [searchingLive, setSearchingLive] = useState(false);

  const {
    entities,
    addEntity,
    removeEntity,
    clearCanvas,
    setCanvas,
    selectEntity,
  } = useInvestigationStore();

  // Search live cases if user searches
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setLiveCaseResults([]);
      return;
    }

    let isMounted = true;
    setSearchingLive(true);

    kspApi
      .getCases({ search: query.trim(), pageSize: 8 })
      .then((res) => {
        if (!isMounted) return;
        const converted: Entity[] = (res.cases || []).map((c) => ({
          id: `CASE-${c.caseId}`,
          type: "Case",
          label: c.crimeNo || `Case #${c.caseId}`,
          description: `${c.crimeMinorHead} at ${c.policeStationName}, ${c.districtName}. Facts: "${c.briefFacts}"`,
          risk: c.crimeMinorHead.toLowerCase().includes("murder") || c.crimeMinorHead.toLowerCase().includes("pocso") ? 88 : 65,
          confidence: 96,
          tags: [c.statusName, c.crimeMajorHead],
          properties: {
            CaseMasterID: c.caseId,
            CrimeNo: c.crimeNo,
            PoliceStation: c.policeStationName,
            District: c.districtName,
            Officer: c.officerName || "Unassigned",
            RegisteredDate: c.registeredDate,
            Court: c.courtName || "District Court",
          },
        }));
        setLiveCaseResults(converted);
      })
      .catch((err) => console.error("Live case search error:", err))
      .finally(() => {
        if (isMounted) setSearchingLive(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  // If URL has ?caseId=..., automatically build graph for that case
  useEffect(() => {
    if (!caseIdParam) return;

    kspApi
      .getCaseRelated(caseIdParam)
      .then((related) => {
        if (!related) return;

        const caseNodeId = `CASE-${related.caseId}`;
        const caseEntity: Entity = {
          id: caseNodeId,
          type: "Case",
          label: related.crimeNo || `Case #${related.caseId}`,
          description: `FIR registered at ${related.policeStation?.name || "Station"}. Status: ${related.legalStatus?.statusName}`,
          risk: 75,
          confidence: 98,
          tags: ["Live FIR", related.legalStatus?.statusName || "Active"],
          properties: {
            CaseId: related.caseId,
            CrimeNo: related.crimeNo,
            PoliceStation: related.policeStation?.name,
            Officer: related.investigatingOfficer?.name,
            Court: related.court?.name,
            Timing: `${related.occurrence?.from || "N/A"} to ${related.occurrence?.to || "N/A"}`,
          },
        };

        const ioEntity: Entity = {
          id: `IO-${related.investigatingOfficer?.id || "9301"}`,
          type: "Person",
          label: related.investigatingOfficer?.name || "Investigating Officer",
          description: `Investigating Officer (KGID: ${related.investigatingOfficer?.kgid || "N/A"})`,
          risk: 30,
          confidence: 95,
          tags: ["Investigating Officer", "Police Person"],
          properties: {
            EmployeeID: related.investigatingOfficer?.id,
            KGID: related.investigatingOfficer?.kgid,
            Station: related.policeStation?.name,
          },
        };

        const stationEntity: Entity = {
          id: `UNIT-${related.policeStation?.id || "9201"}`,
          type: "Organization",
          label: related.policeStation?.name || "Police Station",
          description: "Jurisdictional Police Station Unit",
          risk: 20,
          confidence: 100,
          tags: ["Police Station", "Unit"],
          properties: {
            UnitID: related.policeStation?.id,
            StationName: related.policeStation?.name,
          },
        };

        const courtEntity: Entity = {
          id: `COURT-${related.court?.id || "CR-01"}`,
          type: "Organization",
          label: related.court?.name || "District & Sessions Court",
          description: "Jurisdictional Court for trial & remand",
          risk: 10,
          confidence: 100,
          tags: ["Judiciary", "Court"],
          properties: {
            CourtName: related.court?.name,
          },
        };

        const locEntity: Entity = {
          id: `LOC-${related.caseId}`,
          type: "Location",
          label: `${related.occurrence?.location?.latitude?.toFixed(3)}°N, ${related.occurrence?.location?.longitude?.toFixed(3)}°E`,
          description: "Occurrence Location Coordinates",
          risk: 50,
          confidence: 90,
          tags: ["Incident GPS", "Scene of Crime"],
          properties: {
            Latitude: related.occurrence?.location?.latitude,
            Longitude: related.occurrence?.location?.longitude,
          },
        };

        // Build nodes
        const nodes: Node[] = [
          { id: caseNodeId, type: "entity", position: { x: 300, y: 200 }, data: { entity: caseEntity } },
          { id: ioEntity.id, type: "entity", position: { x: 80, y: 80 }, data: { entity: ioEntity } },
          { id: stationEntity.id, type: "entity", position: { x: 520, y: 80 }, data: { entity: stationEntity } },
          { id: courtEntity.id, type: "entity", position: { x: 80, y: 340 }, data: { entity: courtEntity } },
          { id: locEntity.id, type: "entity", position: { x: 520, y: 340 }, data: { entity: locEntity } },
        ];

        // Build edges
        const edges: Edge[] = [
          { id: `e-case-io`, source: caseNodeId, target: ioEntity.id, label: "Investigated By", animated: true },
          { id: `e-case-station`, source: caseNodeId, target: stationEntity.id, label: "Registered At", animated: true },
          { id: `e-case-court`, source: caseNodeId, target: courtEntity.id, label: "Under Jurisdiction", animated: true },
          { id: `e-case-loc`, source: caseNodeId, target: locEntity.id, label: "Occurred At", animated: true },
        ];

        setCanvas(nodes, edges);
        selectEntity(caseEntity);
      })
      .catch((err) => console.error("Error building auto graph for case:", err));
  }, [caseIdParam, setCanvas, selectEntity]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    let results = [...searchEntities(query), ...liveCaseResults];

    if (filter !== "All") {
      results = results.filter((entity) => entity.type === filter);
    }

    return results;
  }, [query, filter, liveCaseResults]);

  const handleAdd = (entity: Entity) => {
    const exists = entities.some((e) => e.id === entity.id);
    if (!exists) {
      addEntity(entity);
    }
  };

  const handleBuildGraph = () => {
    const investigation = buildInvestigation(entities, { depth: 1 });
    setCanvas(investigation.nodes, investigation.edges);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Investigation Workspace</h2>
            <p className="text-xs text-slate-500">
              Search live FIRs &amp; synthetic entities to build graph topologies
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-6">
        <SearchBar value={query} onChange={setQuery} />

        <EntityFilter selected={filter} onChange={setFilter} />

        {searchingLive && (
          <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
            <RefreshCw size={13} className="animate-spin" />
            <span>Searching 1,499 Live Catalyst CaseMaster records...</span>
          </div>
        )}

        <SearchResults entities={searchResults} onAdd={handleAdd} />

        <QueuePanel entities={entities} onRemove={removeEntity} />

        <InvestigationActions
          disabled={entities.length === 0}
          onClear={clearCanvas}
          onBuild={handleBuildGraph}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Active Graph Entities:</span>
          <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
            <Network size={13} />
            <span>{entities.length} Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}