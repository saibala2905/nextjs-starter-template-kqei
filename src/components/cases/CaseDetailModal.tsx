"use client";

import { useEffect, useState } from "react";
import {
  X,
  Shield,
  MapPin,
  Calendar,
  Scale,
  FileText,
  AlertTriangle,
  Clock,
  ExternalLink,
  Share2,
} from "lucide-react";
import { kspApi } from "@/services/kspApi";
import type { DetailedCaseResponse, CaseRelatedEntitiesResponse } from "@/types/apiTypes";

interface CaseDetailModalProps {
  caseId: number | null;
  onClose: () => void;
  onOpenGraph?: (caseId: number) => void;
}

export default function CaseDetailModal({
  caseId,
  onClose,
  onOpenGraph,
}: CaseDetailModalProps) {
  const [caseData, setCaseData] = useState<DetailedCaseResponse | null>(null);
  const [relatedData, setRelatedData] = useState<CaseRelatedEntitiesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      kspApi.getCaseById(caseId).catch((err) => {
        console.error("Case details fetch error:", err);
        return null;
      }),
      kspApi.getCaseRelated(caseId).catch((err) => {
        console.error("Case related fetch error:", err);
        return null;
      }),
    ]).then(([details, related]) => {
      if (!isMounted) return;
      if (!details) {
        setError(`Unable to load FIR record for Case #${caseId}`);
      } else {
        setCaseData(details);
        setRelatedData(related);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  if (!caseId) return null;

  const isHeinous = caseData?.crimeDetails.gravity === "Heinous";
  const statusName = caseData?.investigation.statusName || "Under Investigation";

  const getStatusBadge = (status: string) => {
    if (status.includes("Charge Sheet")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (status.includes("Closed")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (status.includes("Review")) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-xs">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {caseData?.crimeNo || `Case #${caseId}`}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadge(
                    statusName
                  )}`}
                >
                  {statusName}
                </span>
                {isHeinous && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 border border-red-200 flex items-center gap-1">
                    <AlertTriangle size={11} /> Heinous Offence
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Case No: <span className="font-mono text-slate-700">{caseData?.caseNo || "N/A"}</span> • Registered: {caseData?.registeredDate || "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
              <p className="mt-3 text-sm font-medium">Fetching FIR Record from Catalyst Data Store...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 border border-red-200">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="font-semibold">{error}</p>
            </div>
          ) : caseData ? (
            <>
              {/* Crime & Classification Strip */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Crime Category</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{caseData.crimeDetails.minorHeadName}</p>
                  <p className="text-xs text-slate-500">{caseData.crimeDetails.majorHeadName}</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Police Station</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{caseData.jurisdiction.policeStationName || `Unit ${caseData.jurisdiction.policeStationId}`}</p>
                  <p className="text-xs text-slate-500">{caseData.jurisdiction.districtName}</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Investigating Officer</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{caseData.investigation.officerName || "Unassigned"}</p>
                  <p className="text-xs font-mono text-slate-500">KGID: {caseData.investigation.officerKGID || "N/A"}</p>
                </div>
              </div>

              {/* Brief Facts of the Incident */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <FileText size={15} className="text-blue-600" />
                  <span>FIR Brief Facts &amp; Occurrence Details</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                  {caseData.incident.briefFacts || "No summary facts recorded in this FIR."}
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span><strong>Incident Timing:</strong> {caseData.incident.from || "N/A"} to {caseData.incident.to || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span><strong>Reported to Station:</strong> {caseData.incident.infoReceivedAtStation || "Same Day"}</span>
                  </div>
                </div>
              </div>

              {/* Court & Legal Mapping */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    <Scale size={15} className="text-purple-600" />
                    <span>Jurisdictional Court</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{caseData.jurisdiction.courtName || "District & Sessions Court"}</p>
                  <p className="text-xs text-slate-500 mt-1">Court Code ID: {caseData.jurisdiction.courtId || "CR-01"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    <MapPin size={15} className="text-emerald-600" />
                    <span>Geographic Coordinates</span>
                  </div>
                  <p className="text-sm font-mono font-semibold text-slate-900">
                    {caseData.incident.latitude && caseData.incident.longitude
                      ? `${caseData.incident.latitude.toFixed(4)}° N, ${caseData.incident.longitude.toFixed(4)}° E`
                      : "Coordinates Pending Geocoding"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{caseData.jurisdiction.districtName} Police Zone</p>
                </div>
              </div>

              {/* Linked Investigation Network Preview */}
              {relatedData && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
                      <Share2 size={15} className="text-blue-700" />
                      <span>Linked Entity Graph Topology</span>
                    </div>
                    {onOpenGraph && (
                      <button
                        onClick={() => onOpenGraph(caseData.caseId)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 transition underline cursor-pointer"
                      >
                        <span>Inspect in Network Intelligence</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Investigating Officer</span>
                      <span className="font-semibold text-slate-800 truncate block mt-0.5">
                        {relatedData.investigatingOfficer?.name || "Assigned IO"}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Station Hub</span>
                      <span className="font-semibold text-slate-800 truncate block mt-0.5">
                        {relatedData.policeStation?.name || "Station Unit"}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Court Trial</span>
                      <span className="font-semibold text-slate-800 truncate block mt-0.5">
                        {relatedData.court?.name || "Court"}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Legal Phase</span>
                      <span className="font-semibold text-slate-800 truncate block mt-0.5">
                        {relatedData.legalStatus?.statusName || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-6 py-3.5">
          <span className="text-xs text-slate-500">
            Source: <strong className="text-slate-700">Zoho Catalyst CaseMaster</strong> (ZCQL Authenticated)
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
