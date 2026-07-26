"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  // Bot,
  Settings,
  Shield,
  BrainCircuit,
  Network,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  collapsed,
}: SidebarProps) {
  const pathname = usePathname();

  const [openIntelligence, setOpenIntelligence] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/intelligence")) {
      setOpenIntelligence(true);
    }
  }, [pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Crime Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}

      <div className="border-b border-slate-700 p-6">

        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >

          <Shield className="h-8 w-8 text-blue-400" />

          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">
                KSP AI
              </h1>

              <p className="text-xs text-slate-400">
                Intelligence Platform
              </p>
            </div>
          )}

        </div>

      </div>

      <nav className="flex-1 p-3">

        {/* Main Pages */}

        {menuItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mb-2 flex items-center rounded-lg px-4 py-3 transition
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-200 hover:bg-slate-800"
              }
              ${collapsed ? "justify-center" : "gap-3"}
              `}
            >
              <Icon className="h-5 w-5" />

              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}

        {/* Intelligence Hub */}

        {!collapsed && (
          <div className="mt-3">

            <button
              onClick={() =>
                setOpenIntelligence(!openIntelligence)
              }
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-slate-200 hover:bg-slate-800"
            >

              <div className="flex items-center gap-3">

                <BrainCircuit className="h-5 w-5" />

                <span>Intelligence Hub</span>

              </div>

              {openIntelligence ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

            </button>

            {openIntelligence && (

              <div className="ml-7 mt-2 space-y-1">

                <Link
                  href="/intelligence/network"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
                  ${
                    pathname === "/intelligence/network"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >

                  <Network className="h-4 w-4" />

                  Network Intelligence

                </Link>

                <Link
                  href="/intelligence/predictive"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
                  ${
                    pathname === "/intelligence/predictive"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >

                  <Sparkles className="h-4 w-4" />

                  Predictive Intelligence

                </Link>

              </div>

            )}

          </div>
        )}

        {/* Remaining Pages */}

        {menuItems.slice(2).map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mt-2 flex items-center rounded-lg px-4 py-3 transition
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-200 hover:bg-slate-800"
              }
              ${collapsed ? "justify-center" : "gap-3"}
              `}
            >

              <Icon className="h-5 w-5" />

              {!collapsed && <span>{item.title}</span>}

            </Link>
          );
        })}

      </nav>
    </aside>
  );
}