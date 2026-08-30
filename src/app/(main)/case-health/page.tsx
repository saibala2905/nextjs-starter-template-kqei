"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FolderCheck,
  Search,
  Filter,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Share2,
  Users,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseDetailModal from "@/components/cases/CaseDetailModal";
import { kspApi } from "@/services/kspApi";
import type {
  CaseListItem,
  CaseStatusSummaryResponse,
  OfficerWorkloadItem,
  GeoDistrict,
} from "@/types/apiTypes";

export default function CaseHealthPage() {
  const router = useRouter();

  // Selected case for modal
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  // Status Summary
  const [statusSummary, setStatusSummary] = useState<CaseStatusSummaryResponse | null>(null);

  // Officer Workloads
  const [officers, setOfficers] = useState<OfficerWorkloadItem[]>([]);
  const [officerFilterDistrict, setOfficerFilterDistrict] = useState<string>("all");
  const [officerSearch, setOfficerSearch] = useState<string>("");

  // Paginated Cases
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(1499);
  const [totalPages, setTotalPages] = useState<number>(75);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  // Case Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  // Master Districts
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);

  // Loading states
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Load summary & master data once
  useEffect(() => {
    async function init() {
      setLoadingSummary(true);
      try {
        const [summaryData, districtData, officerData] = await Promise.all([
          kspApi.getCaseStatusSummary().catch(() => null),
          kspApi.getGeoDistricts().catch(() => []),
          kspApi.getWorkloadOfficers().catch(() => []),
        ]);
        if (summaryData) setStatusSummary(summaryData);
        setDistricts(districtData);
        setOfficers(officerData);
      } catch (err) {
        console.error("Init case health error:", err);
      } finally {
        setLoadingSummary(false);
      }
    }
    init();
  }, []);

  // Fetch paginated cases
  const fetchCasesList = useCallback(async () => {
    setLoadingCases(true);
    try {
      const params: Record<string, string | number> = {
        page,
        pageSize,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (statusFilter !== "all") params.caseStatusId = Number(statusFilter);
      if (districtFilter !== "all") params.districtId = Number(districtFilter);

      const res = await kspApi.getCases(params);
      setCases(res.cases || []);
      setTotalRecords(res.pagination.totalRecords || 1499);
      setTotalPages(res.pagination.totalPages || Math.ceil(1499 / pageSize));
    } catch (err) {
      console.error("Error fetching cases:", err);
    } finally {
      setLoadingCases(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, districtFilter]);

  useEffect(() => {
    fetchCasesList();
  }, [fetchCasesList]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCasesList();
  };

  const filteredOfficers = officers.filter((o) => {
    const matchDistrict = officerFilterDistrict === "all" || String(o.districtId) === officerFilterDistrict;
    const matchSearch =
      !officerSearch ||
      o.employeeName.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.kgid.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.unitName.toLowerCase().includes(officerSearch.toLowerCase());
    return matchDistrict && matchSearch;
  });

  const getStatusBadge = (statusName: string) => {
    if (statusName.includes("Charge Sheet")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (statusName.includes("Closed")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (statusName.includes("Review")) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <SectionHeader
        icon={<FolderCheck size={20} />}
        title="Case Health & Investigation Lifecycle"
        description="Monitor case progression, 76 Investigating Officer workloads, stalled investigations, and detailed FIR records."
        badges={[
          { label: "1,499 Active Universe", color: "blue" },
          { label: "76 Investigating Officers", color: "purple" },
          { label: "ZCQL Search", color: "green" },
        ]}
        open={true}
        onToggle={() => {}}
      />

      {/* 1. Status Overview Strip */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusSummary?.statuses.map((st) => {
          const isUnderInv = st.statusId === 9901;
          const isChargeSheet = st.statusId === 9902;
          const isClosed = st.statusId === 9903;

          const colorClass = isUnderInv
            ? "border-amber-200 bg-amber-50/70 text-amber-900"
            : isChargeSheet
            ? "border-blue-200 bg-blue-50/70 text-blue-900"
            : isClosed
            ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
            : "border-purple-200 bg-purple-50/70 text-purple-900";

          return (
            <div
              key={st.statusId}
              className={`rounded-2xl border p-5 shadow-2xs transition hover:shadow-xs ${colorClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{st.statusName}</span>
                {isUnderInv ? (
                  <Clock size={18} className="text-amber-600" />
                ) : isChargeSheet ? (
                  <CheckCircle2 size={18} className="text-blue-600" />
                ) : isClosed ? (
                  <UserCheck size={18} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={18} className="text-purple-600" />
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-3xl font-extrabold">{loadingSummary ? "..." : st.count.toLocaleString()}</p>
                <span className="text-xs font-bold font-mono">{st.percentage}%</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-current opacity-80" style={{ width: `${st.percentage}%` }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* 2. Investigating Officer (IO) Workload Matrix */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Investigating Officer (IO) Caseload Workload</h2>
              <p className="text-xs text-slate-500">
                Active investigation assignments and disposal velocity across all 76 officers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Officer Search */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search Officer or KGID..."
                value={officerSearch}
                onChange={(e) => setOfficerSearch(e.target.value)}
                className="bg-transparent text-slate-800 outline-hidden w-40"
              />
            </div>

            {/* Officer District Filter */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <Filter size={14} className="text-slate-400" />
              <select
                value={officerFilterDistrict}
                onChange={(e) => setOfficerFilterDistrict(e.target.value)}
                className="bg-transparent font-medium text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="all">All Districts (38)</option>
                {districts.map((d) => (
                  <option key={d.districtId} value={String(d.districtId)}>
                    {d.districtName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto max-h-[340px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Officer Name</th>
                <th className="px-4 py-3">KGID</th>
                <th className="px-4 py-3">Jurisdiction</th>
                <th className="px-4 py-3 text-center">Active Cases</th>
                <th className="px-4 py-3 text-center">Chargesheeted</th>
                <th className="px-4 py-3 text-center">Closed</th>
                <th className="px-4 py-3 text-center">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.slice(0, 15).map((o) => {
                const isHigh = o.activeCases >= 20;
                const isModerate = o.activeCases >= 12;

                return (
                  <tr key={o.employeeId} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">{o.employeeName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{o.kgid}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span>{o.unitName}</span>
                      <span className="text-slate-400 block text-[10px]">{o.districtName}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-amber-700">{o.activeCases}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-700">{o.chargeSheetedCases}</td>
                    <td className="px-4 py-3 text-center font-semibold text-emerald-700">{o.closedCases}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          isHigh
                            ? "bg-red-100 text-red-800 border-red-200"
                            : isModerate
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {isHigh ? "Heavy Caseload" : isModerate ? "Moderate" : "Optimal"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-slate-400 text-right">
          Showing {Math.min(15, filteredOfficers.length)} of {filteredOfficers.length} officers
        </p>
      </section>

      {/* 3. Searchable FIR Case Directory */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
              <Search size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">FIR Investigation Case Directory</h2>
              <p className="text-xs text-slate-500">
                Paginated query search across 1,499 FIR records with multi-parameter filters
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search Crime No, Facts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-slate-800 outline-hidden w-48"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="9901">Under Investigation (9901)</option>
              <option value="9902">Charge Sheeted (9902)</option>
              <option value="9903">Closed (9903)</option>
              <option value="9904">Pending Review (9904)</option>
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d.districtId} value={String(d.districtId)}>
                  {d.districtName}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Cases Table */}
        <div className="mt-4 overflow-x-auto">
          {loadingCases ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RefreshCw className="h-7 w-7 animate-spin text-blue-600" />
              <p className="mt-2 text-xs font-medium">Executing ZCQL Query on CaseMaster...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold">No FIR records found matching current query</p>
              <p className="text-xs mt-1">Try broadening your search term or clearing filters</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Crime Number</th>
                  <th className="px-4 py-3">Registered Date</th>
                  <th className="px-4 py-3">Crime Classification</th>
                  <th className="px-4 py-3">Police Station &amp; District</th>
                  <th className="px-4 py-3">Investigating Officer</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr key={c.caseId} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3">
                      <span className="font-bold text-blue-700 block">{c.crimeNo}</span>
                      <span className="font-mono text-[10px] text-slate-400">ID: {c.caseId}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{c.registeredDate}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{c.crimeMinorHead}</span>
                      <span className="text-[10px] text-slate-500">{c.crimeMajorHead}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-medium text-slate-800">{c.policeStationName}</span>
                      <span className="text-[10px] text-slate-400 block">{c.districtName}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{c.officerName || "Unassigned"}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${getStatusBadge(
                          c.statusName
                        )}`}
                      >
                        {c.statusName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCaseId(c.caseId)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition shadow-2xs"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => router.push(`/intelligence/network?caseId=${c.caseId}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                        title="Open in Network Knowledge Graph"
                      >
                        <Share2 size={12} />
                        <span>Graph</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 mt-2">
          <p className="text-xs text-slate-500">
            Showing Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong> (Total <strong className="text-slate-800">{totalRecords}</strong> FIR Records)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loadingCases}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <span className="px-2 text-xs font-bold text-slate-700">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loadingCases}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Case Details Modal */}
      {selectedCaseId && (
        <CaseDetailModal
          caseId={selectedCaseId}
          onClose={() => setSelectedCaseId(null)}
          onOpenGraph={(cId) => {
            setSelectedCaseId(null);
            router.push(`/intelligence/network?caseId=${cId}`);
          }}
        />
      )}
    </div>
  );
}
