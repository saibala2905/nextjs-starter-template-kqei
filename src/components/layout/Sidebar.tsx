"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Bot,
  BarChart3,
  FileText,
  FolderOpen,
  Settings,
  Shield,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Assistant",
    href: "/assistant",
    icon: Bot,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  collapsed,
}: SidebarProps) {
  const pathname = usePathname();

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

      {/* Menu */}

      <nav className="flex-1 p-3">

        {menuItems.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mb-2 flex items-center rounded-lg px-4 py-3 transition-all
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-200"
              }
              ${collapsed ? "justify-center" : "gap-3"}
              `}
            >
              <Icon className="h-5 w-5" />

              {!collapsed && (
                <span>{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}