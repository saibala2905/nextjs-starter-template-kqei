import type { ToolResult } from "../engine/toolTypes";

interface Route {

  name: string;

  path: string;

  keywords: string[];

}

const ROUTES: Route[] = [

  {
    name: "Dashboard",

    path: "/dashboard",

    keywords: [
      "dashboard",
      "home",
      "overview",
      "main page",
    ],
  },

  {
    name: "Crime Analytics",

    path: "/analytics",

    keywords: [
      "analytics",
      "crime analytics",
      "analysis",
    ],
  },

  {
    name: "Network Intelligence",

    path: "/intelligence/network",

    keywords: [
      "network",
      "network intelligence",
      "investigation",
      "knowledge graph",
      "link analysis",
    ],
  },

  {
    name: "Predictive Intelligence",

    path: "/intelligence/predictive",

    keywords: [
      "predictive",
      "prediction",
      "forecast",
      "hotspot",
      "predictive intelligence",
    ],
  },

  {
    name: "Settings",

    path: "/settings",

    keywords: [
      "settings",
      "preferences",
      "configuration",
      "config",
    ],
  },

];

export function navigationTool(

  prompt: string,

  navigate: (path: string) => void

): ToolResult {

  const text = prompt.toLowerCase();

  for (const route of ROUTES) {

    const matched = route.keywords.some(
      keyword => text.includes(keyword)
    );

    if (matched) {

      navigate(route.path);

      return {

        handled: true,

        message: `Opening ${route.name}...`,

      };

    }

  }

  return {

    handled: false,

    message: "",

  };

}