import type { ToolResult } from "../engine/toolTypes";

interface Route {
  name: string;
  path: string;
  keywords: string[];
}

const ROUTES: Route[] = [
  {
    name: "Command Center Dashboard",
    path: "/dashboard",
    keywords: ["dashboard", "home", "overview", "command center", "main page"],
  },
  {
    name: "Crime Analytics",
    path: "/analytics",
    keywords: ["analytics", "crime analytics", "analysis", "trends", "matrix"],
  },
  {
    name: "Case Health & Investigation Lifecycle",
    path: "/case-health",
    keywords: ["case health", "case", "cases", "io", "officer", "workload", "investigation lifecycle"],
  },
  {
    name: "Hotspot Intelligence (GIS)",
    path: "/hotspots",
    keywords: ["hotspot", "hotspots", "gis", "clusters", "spatial"],
  },
  {
    name: "Network Intelligence",
    path: "/intelligence/network",
    keywords: ["network", "network intelligence", "knowledge graph", "link analysis", "entity"],
  },
  {
    name: "Predictive Risk Intelligence",
    path: "/intelligence/predictive",
    keywords: ["predictive", "prediction", "forecast", "forecasting", "predictive intelligence"],
  },
  {
    name: "Interventions & Action Feedback",
    path: "/interventions",
    keywords: ["intervention", "interventions", "preventive", "patrol", "checkpost", "action feedback"],
  },
  {
    name: "System Settings",
    path: "/settings",
    keywords: ["settings", "preferences", "configuration", "config", "endpoint"],
  },
];

export function navigationTool(
  prompt: string,
  navigate: (path: string) => void
): ToolResult {
  const text = prompt.toLowerCase();

  for (const route of ROUTES) {
    const matched = route.keywords.some((keyword) => text.includes(keyword));

    if (matched) {
      navigate(route.path);
      return {
        handled: true,
        message: `Opening **${route.name}**...`,
      };
    }
  }

  return {
    handled: false,
    message: "",
  };
}