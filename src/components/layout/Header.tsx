"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  Plus,
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import InteractiveDemoTour from "@/components/demo/InteractiveDemoTour";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
  collapsed,
  setCollapsed,
}: HeaderProps) {
  const [showDemoTour, setShowDemoTour] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-2 transition hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Karnataka State Police <span className="text-blue-600 text-sm font-semibold ml-1">Command Hub</span>
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Interactive Demo Tour Trigger */}
          <button
            onClick={() => setShowDemoTour(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-3.5 py-1.5 text-xs font-black text-white transition shadow-md shadow-blue-500/20 cursor-pointer animate-pulse"
            title="Launch Interactive Demo Tour"
          >
            <Sparkles size={14} className="animate-spin" />
            <span>Interactive Demo Tour</span>
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search FIR, suspect, vehicle..."
              className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* New Chat */}
          <button
            onClick={() => {
              const chatBtn = document.querySelector('button[aria-label="Toggle KSP AI"]') as HTMLButtonElement | null;
              if (chatBtn) chatBtn.click();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span className="hidden md:block">AI Copilot</span>
          </button>

          {/* Notifications */}
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer">
            <Bell size={18} />
          </button>

          {/* Settings */}
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer">
            <Settings size={18} />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50/60">
            <UserCircle2 size={20} className="text-blue-600" />
            <span className="hidden lg:block">Admin SP</span>
          </div>
        </div>
      </header>

      {/* Global Interactive Demo Tour Popover */}
      <InteractiveDemoTour
        isOpen={showDemoTour}
        onClose={() => setShowDemoTour(false)}
      />
    </>
  );
}