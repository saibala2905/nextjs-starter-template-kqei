"use client";

import {
  Bell,
  Search,
  Settings,
  Plus,
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
  collapsed,
  setCollapsed,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 transition hover:bg-slate-100"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* New Chat */}
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
          <Plus size={18} />
          <span className="hidden md:block">
            New Chat
          </span>
        </button>

        {/* Notifications */}
        <button className="rounded-lg p-2 transition hover:bg-slate-100">
          <Bell size={20} />
        </button>

        {/* Settings */}
        <button className="rounded-lg p-2 transition hover:bg-slate-100">
          <Settings size={20} />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-50">
          <UserCircle2 size={26} />

          <span className="hidden lg:block">
            Admin
          </span>
        </button>
      </div>
    </header>
  );
}