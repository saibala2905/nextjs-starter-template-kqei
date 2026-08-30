/**
 * Typed KSP API Service
 * Wraps all endpoints of the Catalyst ksp_aio_function microservice
 */

import { apiClient } from "./apiClient";
import type {
  DashboardOverviewResponse,
  FilteredKPIsResponse,
  CrimeSummaryItem,
  CrimeTrendResponse,
  DistrictCrimeMatrixItem,
  UnitCrimeBreakdownItem,
  GeoDistrict,
  GeoUnit,
  GeoCasePoint,
  PaginatedCasesResponse,
  DetailedCaseResponse,
  CaseRelatedEntitiesResponse,
  CaseStatusSummaryResponse,
  DistrictStatusMatrixItem,
  UnitStatusMatrixItem,
  OfficerWorkloadItem,
  UnitWorkloadItem,
  DistrictWorkloadItem,
} from "@/types/apiTypes";

export const kspApi = {
  // ==========================================
  // 1. Executive Dashboard
  // ==========================================
  getDashboardOverview: () => {
    return apiClient<DashboardOverviewResponse>("/api/dashboard/overview");
  },

  getDashboardKPIs: (params?: {
    from?: string;
    to?: string;
    districtId?: number;
    unitId?: number;
    crimeMinorHeadId?: number;
    caseStatusId?: number;
  }) => {
    return apiClient<FilteredKPIsResponse>("/api/dashboard/kpis", { params });
  },

  // ==========================================
  // 2. Crime Intelligence
  // ==========================================
  getCrimeSummary: () => {
    return apiClient<CrimeSummaryItem[]>("/api/crime/summary");
  },

  getCrimeTrends: (params?: {
    from?: string;
    to?: string;
    crimeMinorHeadId?: number;
  }) => {
    return apiClient<CrimeTrendResponse>("/api/crime/trends", { params });
  },

  getCrimeByDistrict: () => {
    return apiClient<DistrictCrimeMatrixItem[]>("/api/crime/by-district");
  },

  getCrimeByUnit: (districtId?: number) => {
    return apiClient<UnitCrimeBreakdownItem[]>("/api/crime/by-unit", {
      params: { districtId },
    });
  },

  // ==========================================
  // 3. Geographic & Maps
  // ==========================================
  getGeoDistricts: () => {
    return apiClient<GeoDistrict[]>("/api/geo/districts");
  },

  getGeoUnits: (districtId?: number) => {
    return apiClient<GeoUnit[]>("/api/geo/units", {
      params: { districtId },
    });
  },

  getGeoCases: (params?: {
    districtId?: number;
    unitId?: number;
    crimeMinorHeadId?: number;
    limit?: number;
  }) => {
    return apiClient<GeoCasePoint[]>("/api/geo/cases", { params });
  },

  // ==========================================
  // 4. Case Management & Search
  // ==========================================
  getCases: (params?: {
    page?: number;
    pageSize?: number;
    districtId?: number;
    unitId?: number;
    crimeMinorHeadId?: number;
    caseStatusId?: number;
    from?: string;
    to?: string;
    search?: string;
  }) => {
    return apiClient<PaginatedCasesResponse>("/api/cases", { params });
  },

  getCaseById: (caseId: number | string) => {
    return apiClient<DetailedCaseResponse>(`/api/cases/${caseId}`);
  },

  getCaseRelated: (caseId: number | string) => {
    return apiClient<CaseRelatedEntitiesResponse>(`/api/cases/${caseId}/related`);
  },

  // ==========================================
  // 5. Case Status & Workload
  // ==========================================
  getCaseStatusSummary: () => {
    return apiClient<CaseStatusSummaryResponse>("/api/case-status/summary");
  },

  getCaseStatusByDistrict: () => {
    return apiClient<DistrictStatusMatrixItem[]>("/api/case-status/by-district");
  },

  getCaseStatusByUnit: (districtId?: number) => {
    return apiClient<UnitStatusMatrixItem[]>("/api/case-status/by-unit", {
      params: { districtId },
    });
  },

  getWorkloadOfficers: (params?: { districtId?: number; unitId?: number }) => {
    return apiClient<OfficerWorkloadItem[]>("/api/workload/officers", { params });
  },

  getWorkloadUnits: (districtId?: number) => {
    return apiClient<UnitWorkloadItem[]>("/api/workload/units", {
      params: { districtId },
    });
  },

  getWorkloadDistricts: () => {
    return apiClient<DistrictWorkloadItem[]>("/api/workload/districts");
  },

  // ==========================================
  // 6. System Health
  // ==========================================
  getHealth: () => {
    return apiClient<{ status: string; timestamp: string }>("/api/health");
  },
};
