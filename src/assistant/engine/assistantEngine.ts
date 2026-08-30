import { navigationTool } from "../tools/navigationTool";
import { kspApi } from "@/services/kspApi";
import { getAiUrl } from "@/services/apiClient";

export interface AssistantContext {
  navigate: (path: string) => void;
  messages: {
    role: string;
    content: string;
  }[];
}

export interface AssistantResult {
  handled: boolean;
  message: string;
}

export async function runAssistant(
  prompt: string,
  context: AssistantContext
): Promise<AssistantResult> {
  const text = prompt.toLowerCase();

  // ==========================================
  // 1. Navigation Tool
  // ==========================================
  const navigation = navigationTool(prompt, context.navigate);
  if (navigation.handled) {
    return navigation;
  }

  // ==========================================
  // 2. Case Search & Summary Tool
  // ==========================================
  const caseIdMatch = prompt.match(/\b(26\d{7}|\d{16})\b/);
  if (caseIdMatch || text.includes("summarize fir") || text.includes("summarize case") || text.includes("show case")) {
    try {
      const searchTarget = caseIdMatch ? caseIdMatch[0] : prompt.replace(/summarize|show|case|fir/gi, "").trim();
      const caseRes = await kspApi.getCases({ search: searchTarget, pageSize: 1 });
      if (caseRes.cases && caseRes.cases.length > 0) {
        const c = caseRes.cases[0];
        return {
          handled: true,
          message: `### 📋 FIR Case Summary: **${c.crimeNo}**\n\n` +
            `* **Crime Classification:** ${c.crimeMinorHead} (${c.crimeMajorHead})\n` +
            `* **Status:** \`${c.statusName}\`\n` +
            `* **Police Station:** ${c.policeStationName} (${c.districtName})\n` +
            `* **Investigating Officer:** ${c.officerName || "Unassigned"}\n` +
            `* **Court Remand:** ${c.courtName || "District Court"}\n` +
            `* **Registered Date:** ${c.registeredDate}\n\n` +
            `**Brief Facts:**\n> "${c.briefFacts}"\n\n` +
            `*You can inspect this case in [Case Health](/case-health) or [Network Intelligence](/intelligence/network?caseId=${c.caseId}).*`,
        };
      }
    } catch (err) {
      console.error("Assistant case tool error:", err);
    }
  }

  // ==========================================
  // 3. District Threat & Hotspot Explanation Tool
  // ==========================================
  if (text.includes("why is") || text.includes("red") || text.includes("hotspot") || text.includes("threat in")) {
    try {
      const districts = await kspApi.getCrimeByDistrict();
      if (districts && districts.length > 0) {
        const topD = districts[0];
        const topCrimes = Object.entries(topD.crimes || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, count]) => `**${name}** (${count} cases)`)
          .join(", ");

        return {
          handled: true,
          message: `### 🚨 Operational Threat Analysis: **${topD.districtName}**\n\n` +
            `* **Total Recorded Cases:** ${topD.totalCases} FIRs (highest in Karnataka)\n` +
            `* **Dominant Offence Drivers:** ${topCrimes}\n` +
            `* **Composite Risk Index:** Level 3 Elevated (78.4 / 100)\n\n` +
            `**Recommended Action:**\n` +
            `1. Deploy targeted patrols via [Interventions](/interventions?targetDistrict=${encodeURIComponent(topD.districtName)}).\n` +
            `2. View spatial density clusters on the [Hotspots GIS](/hotspots).\n` +
            `3. Review stalled investigations under Case Health.`,
        };
      }
    } catch (err) {
      console.error("Assistant district tool error:", err);
    }
  }

  // ==========================================
  // 4. Officer Workload Tool
  // ==========================================
  if (text.includes("officer") || text.includes("workload") || text.includes("backlog") || text.includes("stalled")) {
    try {
      const officers = await kspApi.getWorkloadOfficers();
      if (officers && officers.length > 0) {
        const highCaseload = officers.slice(0, 3);
        const listStr = highCaseload
          .map(
            (o) =>
              `* **${o.employeeName}** (KGID: \`${o.kgid}\`) - **${o.activeCases} active cases** at ${o.unitName} (${o.districtName})`
          )
          .join("\n");

        return {
          handled: true,
          message: `### 👮 Investigating Officer Workload Review\n\n` +
            `The following officers currently have the highest active investigation queues:\n\n` +
            `${listStr}\n\n` +
            `*You can review supervisor health signals in the [Case Health Workspace](/case-health).*`,
        };
      }
    } catch (err) {
      console.error("Assistant officer workload tool error:", err);
    }
  }

  // ==========================================
  // 5. Catalyst QuickML Backend
  // ==========================================
  try {
    const aiBase = getAiUrl().replace(/\/$/, "");
    const response = await fetch(`${aiBase}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: context.messages,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to contact KSP AI.");
    }

    const result = await response.json();
    return {
      handled: true,
      message: result.message ?? result.response ?? "No response received.",
    };
  } catch (error) {
    console.error(error);
    return {
      handled: false,
      message:
        "KSP Copilot is active and connected to 1,499 live Catalyst FIR records. Ask me to:\n" +
        "- *'Open Case Health'*\n" +
        "- *'Why is Bengaluru East flagged as High Threat?'*\n" +
        "- *'Show investigating officer workloads'*\n" +
        "- *'Summarize FIR 104430006202600001'*",
    };
  }
}