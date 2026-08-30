/**
 * KSP Crime Intelligence & Data Store API Types
 * Grounded in the OpenAPI 3.0 specification for ksp_aio_function
 */

// ==========================================
// Dashboard Types
// ==========================================

export interface DashboardKPISummary {
  totalCases: number;
  activeCases: number;
  chargeSheetedCases: number;
  closedCases: number;
  pendingReviewCases: number;
  chargesheetRate: number;
}

export interface MonthlyCrimeMovement {
  period: string; // e.g. "2026-05"
  month: string;  // e.g. "May 2026"
  totalCases: number;
}

export interface TopCrimeCategory {
  crimeMinorHeadId: number;
  crimeName: string;
  crimeGroupName: string;
  count: number;
  percentage: number;
}

export interface TopDistrictSummary {
  districtId: number;
  districtName: string;
  count: number;
}

export interface CaseStatusBreakdownItem {
  statusId: number;
  statusName: string;
  count: number;
  percentage: number;
}

export interface DashboardOverviewResponse {
  state: {
    name: string;
    period: {
      from: string;
      to: string;
    };
  };
  kpis: DashboardKPISummary;
  crimeMovement: MonthlyCrimeMovement[];
  topCrimeCategories: TopCrimeCategory[];
  topDistricts: TopDistrictSummary[];
  caseStatusBreakdown: CaseStatusBreakdownItem[];
}

export interface FilteredKPIsResponse {
  totalCases: number;
  activeCases: number;
  underInvestigation: number;
  chargeSheeted: number;
  closed: number;
  growthPercent: number;
}

// ==========================================
// Crime Intelligence Types
// ==========================================

export interface CrimeSummaryItem {
  crimeMinorHeadId: number;
  crime: string;
  crimeMajorHead: string;
  count: number;
}

export interface CrimeTrendPoint {
  date: string;
  count: number;
}

export interface CrimeTrendResponse {
  filter: {
    crimeMinorHeadId: number | null;
    crime: string;
    from: string;
    to: string;
  };
  dataPoints: CrimeTrendPoint[];
}

export interface DistrictCrimeMatrixItem {
  districtId: number;
  districtName: string;
  totalCases: number;
  crimes: Record<string, number>;
}

export interface UnitCrimeBreakdownItem {
  unitId: number;
  unitName: string;
  districtId: number;
  districtName: string;
  totalCases: number;
}

// ==========================================
// Geographic Types
// ==========================================

export interface GeoDistrict {
  districtId: number;
  districtName: string;
  state: string;
  totalCases: number;
}

export interface GeoUnit {
  unitId: number;
  unitName: string;
  districtId: number;
  districtName: string;
}

export interface GeoCasePoint {
  caseId: number;
  crimeNo: string;
  crime: string;
  crimeMinorHeadId: number;
  districtId: number | null;
  districtName: string;
  unitId: number;
  unitName: string;
  statusId: number;
  statusName: string;
  latitude: number;
  longitude: number;
  registeredDate: string;
  briefFacts: string;
}

// ==========================================
// Case Management Types
// ==========================================

export interface CaseListItem {
  caseId: number;
  crimeNo: string;
  caseNo: string;
  registeredDate: string;
  crimeMajorHead: string;
  crimeMinorHead: string;
  crimeMinorHeadId: number;
  districtId: number | null;
  districtName: string;
  policeStationId: number;
  policeStationName: string;
  officerId: number;
  officerName: string;
  courtId: number;
  courtName: string;
  statusId: number;
  statusName: string;
  incidentFromDate: string;
  incidentToDate: string;
  latitude: number | null;
  longitude: number | null;
  briefFacts: string;
}

export interface PaginatedCasesResponse {
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  cases: CaseListItem[];
}

export interface DetailedCaseResponse {
  caseId: number;
  crimeNo: string;
  caseNo: string;
  registeredDate: string;
  crimeDetails: {
    majorHeadId: number;
    majorHeadName: string;
    minorHeadId: number;
    minorHeadName: string;
    gravity: string;
  };
  jurisdiction: {
    districtId: number | null;
    districtName: string;
    policeStationId: number;
    policeStationName: string;
    courtId: number;
    courtName: string;
  };
  investigation: {
    investigatingOfficerId: number;
    officerName: string;
    officerKGID: string;
    statusId: number;
    statusName: string;
  };
  incident: {
    from: string;
    to: string;
    infoReceivedAtStation: string;
    latitude: number | null;
    longitude: number | null;
    briefFacts: string;
  };
}

export interface CaseRelatedEntitiesResponse {
  caseId: number;
  crimeNo: string;
  policeStation: {
    id: number;
    name: string;
  } | null;
  investigatingOfficer: {
    id: number;
    name: string;
    kgid: string;
  } | null;
  court: {
    id: number;
    name: string;
  } | null;
  occurrence: {
    from: string;
    to: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  legalStatus: {
    statusId: number;
    statusName: string;
  };
}

// ==========================================
// Status & Workload Types
// ==========================================

export interface CaseStatusSummaryItem {
  statusId: number;
  statusName: string;
  count: number;
  percentage: number;
}

export interface CaseStatusSummaryResponse {
  totalCases: number;
  statuses: CaseStatusSummaryItem[];
}

export interface DistrictStatusMatrixItem {
  districtId: number;
  districtName: string;
  totalCases: number;
  underInvestigation: number;
  chargeSheeted: number;
  closed: number;
  pendingReview: number;
}

export interface UnitStatusMatrixItem {
  unitId: number;
  unitName: string;
  districtId: number | null;
  districtName: string;
  totalCases: number;
  underInvestigation: number;
  chargeSheeted: number;
  closed: number;
}

export interface OfficerWorkloadItem {
  employeeId: number;
  employeeName: string;
  kgid: string;
  districtId: number;
  districtName: string;
  unitId: number;
  unitName: string;
  totalAssignedCases: number;
  activeCases: number;
  chargeSheetedCases: number;
  closedCases: number;
}

export interface UnitWorkloadItem {
  unitId: number;
  unitName: string;
  districtId: number;
  districtName: string;
  totalCases: number;
  activeCases: number;
  disposedCases: number;
}

export interface DistrictWorkloadItem {
  districtId: number;
  districtName: string;
  totalCases: number;
  activeCases: number;
  closedCases: number;
}
