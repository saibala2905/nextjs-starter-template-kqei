"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Settings,
  Shield,
  BrainCircuit,
  Network,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronRight,
  FolderCheck,
  Flame,
  Target,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const [openIntelligence, setOpenIntelligence] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/intelligence") || pathname.startsWith("/hotspots") || pathname.startsWith("/interventions")) {
      setOpenIntelligence(true);
    }
  }, [pathname]);

  const topMenuItems = [
    {
      title: "Command Center",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Live",
    },
    {
      title: "Crime Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Case Health & IO",
      href: "/case-health",
      icon: FolderCheck,
      badge: "Core",
    },
  ];

  const intelligenceItems = [
    {
      title: "Hotspot GIS",
      href: "/hotspots",
      icon: Flame,
    },
    {
      title: "Network Intelligence",
      href: "/intelligence/network",
      icon: Network,
    },
    {
      title: "Predictive Risk",
      href: "/intelligence/predictive",
      icon: Sparkles,
    },
    {
      title: "Interventions",
      href: "/interventions",
      icon: Target,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } select-none border-r border-slate-800 shadow-xl`}
    >
      {/* Brand Logo */}
      <div className="border-b border-slate-800 p-5">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 ring-1 ring-blue-500/30">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                KSP AI <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">v2.0</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Karnataka Police Command</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Core Operational Workspaces */}
        <div className="px-3 py-1.5">
          {!collapsed && <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Operations</p>}
        </div>

        {topMenuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center" : "justify-between"}`}
              title={collapsed ? item.title : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
                {!collapsed && <span>{item.title}</span>}
              </div>
              {!collapsed && item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    item.badge === "Live"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Intelligence Hub Section */}
        <div className="pt-3">
          {!collapsed && (
            <button
              onClick={() => setOpenIntelligence(!openIntelligence)}
              className="flex w-full items-center justify-between rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-4 w-4 text-purple-400" />
                <span>Intelligence Suite</span>
              </div>
              {openIntelligence ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>
          )}

          {(!collapsed ? openIntelligence : true) && (
            <div className={`${!collapsed ? "ml-4 mt-1 pl-2 border-l border-slate-800 space-y-1" : "space-y-1"}`}>
              {intelligenceItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const active = pathname === subItem.href;

                return (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    } ${collapsed ? "justify-center" : "gap-2.5"}`}
                    title={collapsed ? subItem.title : undefined}
                  >
                    <SubIcon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
                    {!collapsed && <span>{subItem.title}</span>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* System Settings */}
        <div className="pt-4 border-t border-slate-800/80 mt-4">
          <Link
            href="/settings"
            className={`flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
              pathname === "/settings"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            } ${collapsed ? "justify-center" : "gap-3"}`}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4 text-slate-400" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </nav>

      {/* Footer / Status Indicator */}
      {!collapsed && (
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <div className="text-xs">
              <p className="font-semibold text-slate-200">Catalyst Data Store</p>
              <p className="text-[10px] text-slate-400">1,499 FIRs Synced</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}