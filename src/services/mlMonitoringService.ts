/**
 * ML-Based Crime Monitoring, Anomaly Detection & Sentinel Protocol Service
 */

import type { GeoCasePoint } from "@/types/apiTypes";

export interface SentinelProtocol {
  id: string;
  name: string;
  code: string;
  description: string;
  targetDistricts: string[]; // e.g. ["Bengaluru city", "Bengaluru District"] or ["all"]
  crimeHead: string; // e.g. "Theft", "Cyber", "Murder", "POCSO", "all"
  metricType: "incident_count" | "velocity_spike" | "unsolved_ratio";
  threshold: number; // e.g. 15 cases or 2.0 Z-score
  severity: "low" | "elevated" | "critical";
  status: "active" | "paused" | "breached";
  autoAction: "patrol_dispatch" | "cyber_advisory" | "toll_barricade" | "supervisor_escalation";
  currentValue: number;
  zScore: number;
  lastEvaluated: string;
  breachReason?: string;
  createdAt: string;
}

export interface AnomalyCluster {
  districtName: string;
  crimeHead: string;
  currentCount: number;
  expectedBaseline: number;
  zScore: number;
  isAnomalous: boolean;
  severity: "normal" | "elevated" | "critical";
  detectedPattern: string;
}

const STORAGE_KEY = "ksp_sentinel_protocols";

// Default Standard Police Protocols
export const DEFAULT_PROTOCOLS: SentinelProtocol[] = [
  {
    id: "prot-1",
    name: "Operation Night Vigil",
    code: "PROT-NV-01",
    description: "Monitors property theft and burglary clustering in urban commercial zones.",
    targetDistricts: ["Bengaluru city", "Bengaluru District"],
    crimeHead: "Theft",
    metricType: "incident_count",
    threshold: 15,
    severity: "elevated",
    status: "active",
    autoAction: "patrol_dispatch",
    currentValue: 0,
    zScore: 1.8,
    lastEvaluated: new Date().toISOString(),
    createdAt: "2026-08-30T12:00:00.000Z",
  },
  {
    id: "prot-2",
    name: "Cyber Shield Sentinel",
    code: "PROT-CS-02",
    description: "Detects statistical velocity surges in digital financial & UPI fraud.",
    targetDistricts: ["Mysuru District", "Hubballi Dharwad City", "Mangalooru City"],
    crimeHead: "Cyber",
    metricType: "velocity_spike",
    threshold: 2.0,
    severity: "critical",
    status: "active",
    autoAction: "cyber_advisory",
    currentValue: 0,
    zScore: 2.4,
    lastEvaluated: new Date().toISOString(),
    createdAt: "2026-08-30T12:00:00.000Z",
  },
  {
    id: "prot-3",
    name: "Highway Intercept Protocol",
    code: "PROT-HI-03",
    description: "Monitors dacoity and highway robbery incidents along the NH-44 / NH-48 corridors.",
    targetDistricts: ["Tumakuru", "Chitradurga", "Belagavi Dist"],
    crimeHead: "Robbery",
    metricType: "incident_count",
    threshold: 4,
    severity: "critical",
    status: "active",
    autoAction: "toll_barricade",
    currentValue: 0,
    zScore: 1.2,
    lastEvaluated: new Date().toISOString(),
    createdAt: "2026-08-30T12:00:00.000Z",
  },
  {
    id: "prot-4",
    name: "POCSO Rapid Response Sentinel",
    code: "PROT-PR-04",
    description: "Statewide trigger for immediate fast-track prosecution and juvenile officer alert.",
    targetDistricts: ["all"],
    crimeHead: "POCSO",
    metricType: "incident_count",
    threshold: 1,
    severity: "critical",
    status: "active",
    autoAction: "supervisor_escalation",
    currentValue: 0,
    zScore: 0.9,
    lastEvaluated: new Date().toISOString(),
    createdAt: "2026-08-30T12:00:00.000Z",
  },
];

export class MLMonitoringService {
  /**
   * Retrieve active protocols from localStorage or defaults
   */
  static getProtocols(): SentinelProtocol[] {
    if (typeof window === "undefined") return DEFAULT_PROTOCOLS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load protocols from localStorage:", e);
    }
    return DEFAULT_PROTOCOLS;
  }

  /**
   * Save protocols to localStorage
   */
  static saveProtocols(protocols: SentinelProtocol[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(protocols));
    } catch (e) {
      console.error("Failed to save protocols to localStorage:", e);
    }
  }

  /**
   * Compute Statistical Z-Score Anomaly Detection on Cases
   */
  static detectAnomalies(cases: GeoCasePoint[]): AnomalyCluster[] {
    if (!cases || cases.length === 0) return [];

    // Group by District and Crime Head
    const countsByDistrictCrime: Record<string, number> = {};
    const districtTotals: Record<string, number> = {};

    for (const c of cases) {
      const dName = c.districtName || "Statewide";
      const crime = c.crime || "Other";
      const key = `${dName}__${crime}`;
      countsByDistrictCrime[key] = (countsByDistrictCrime[key] || 0) + 1;
      districtTotals[dName] = (districtTotals[dName] || 0) + 1;
    }

    const counts = Object.values(countsByDistrictCrime);
    if (counts.length === 0) return [];

    // Compute mean and standard deviation
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance =
      counts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / counts.length;
    const stdDev = Math.max(Math.sqrt(variance), 1.0);

    const anomalies: AnomalyCluster[] = [];

    for (const [key, count] of Object.entries(countsByDistrictCrime)) {
      const [districtName, crimeHead] = key.split("__");
      const zScore = Math.round(((count - mean) / stdDev) * 100) / 100;
      const isAnomalous = zScore >= 1.8;

      let severity: "normal" | "elevated" | "critical" = "normal";
      if (zScore >= 2.5 || (crimeHead.toLowerCase().includes("murder") && count >= 3)) {
        severity = "critical";
      } else if (zScore >= 1.8) {
        severity = "elevated";
      }

      let detectedPattern = `Nominal activity (${count} incidents)`;
      if (severity === "critical") {
        detectedPattern = `High-density spatial surge: ${Math.round(zScore * 100)}% above baseline expectation.`;
      } else if (severity === "elevated") {
        detectedPattern = `Elevated cluster observed (${count} incidents vs ${Math.round(mean)} baseline).`;
      }

      anomalies.push({
        districtName,
        crimeHead,
        currentCount: count,
        expectedBaseline: Math.round(mean * 10) / 10,
        zScore,
        isAnomalous,
        severity,
        detectedPattern,
      });
    }

    return anomalies.sort((a, b) => b.zScore - a.zScore);
  }

  /**
   * Evaluate Protocols against Live Data Store FIRs
   */
  static evaluateProtocols(
    protocols: SentinelProtocol[],
    cases: GeoCasePoint[]
  ): SentinelProtocol[] {
    const anomalies = this.detectAnomalies(cases);

    return protocols.map((p) => {
      if (p.status === "paused") {
        return { ...p, lastEvaluated: new Date().toISOString() };
      }

      // Filter matching cases for this protocol
      const matchingCases = cases.filter((c) => {
        const matchDistrict =
          p.targetDistricts.includes("all") ||
          p.targetDistricts.some((td) =>
            (c.districtName || "").toLowerCase().includes(td.toLowerCase())
          );

        const matchCrime =
          p.crimeHead === "all" ||
          (c.crime || "").toLowerCase().includes(p.crimeHead.toLowerCase());

        return matchDistrict && matchCrime;
      });

      const count = matchingCases.length;
      let zScore = 1.0;
      const matchedAnomaly = anomalies.find(
        (a) =>
          p.targetDistricts.some((td) =>
            a.districtName.toLowerCase().includes(td.toLowerCase())
          ) && a.crimeHead.toLowerCase().includes(p.crimeHead.toLowerCase())
      );
      if (matchedAnomaly) {
        zScore = matchedAnomaly.zScore;
      }

      let isBreached = false;
      let breachReason = "";

      if (p.metricType === "incident_count") {
        isBreached = count >= p.threshold;
        if (isBreached) {
          breachReason = `Incident threshold breached: ${count} cases registered (limit: ${p.threshold}).`;
        }
      } else if (p.metricType === "velocity_spike") {
        isBreached = zScore >= p.threshold;
        if (isBreached) {
          breachReason = `Velocity spike detected: Z-Score ${zScore} exceeds threshold (${p.threshold}).`;
        }
      }

      const status: "active" | "paused" | "breached" = isBreached
        ? "breached"
        : "active";

      return {
        ...p,
        currentValue: count,
        zScore,
        status,
        breachReason,
        lastEvaluated: new Date().toISOString(),
      };
    });
  }

  /**
   * Create a new Protocol
   */
  static createProtocol(newProtocol: Omit<SentinelProtocol, "id" | "createdAt" | "currentValue" | "zScore" | "lastEvaluated">): SentinelProtocol {
    const protocols = this.getProtocols();
    const created: SentinelProtocol = {
      ...newProtocol,
      id: `prot-${Date.now()}`,
      currentValue: 0,
      zScore: 1.0,
      lastEvaluated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...protocols];
    this.saveProtocols(updated);
    return created;
  }

  /**
   * Toggle Protocol Status (Active <-> Paused)
   */
  static toggleStatus(protocolId: string): SentinelProtocol[] {
    const protocols = this.getProtocols();
    const updated = protocols.map((p) => {
      if (p.id === protocolId) {
        const nextStatus: "active" | "paused" = p.status === "paused" ? "active" : "paused";
        return { ...p, status: nextStatus };
      }
      return p;
    });
    this.saveProtocols(updated);
    return updated;
  }

  /**
   * Delete a Protocol
   */
  static deleteProtocol(protocolId: string): SentinelProtocol[] {
    const protocols = this.getProtocols();
    const updated = protocols.filter((p) => p.id !== protocolId);
    this.saveProtocols(updated);
    return updated;
  }
}
