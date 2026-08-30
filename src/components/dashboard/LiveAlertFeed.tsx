"use client";

import { AlertTriangle, ShieldCheck, BellRing, Info } from "lucide-react";

interface AlertItem {
  id: string;
  type: "Critical" | "Warning" | "Information" | "Resolved";
  location: string;
  title: string;
  description: string;
  time: string;
}

const liveAlerts: AlertItem[] = [
  {
    id: "alt-1",
    type: "Critical",
    location: "Bengaluru City (Unit 9209)",
    title: "Theft Cluster Spike",
    description: "Concentrated FIR registration in last 48 hours (+18% vs baseline).",
    time: "10 mins ago",
  },
  {
    id: "alt-2",
    type: "Warning",
    location: "Hubballi-Dharwad",
    title: "Delayed FIR Investigation",
    description: "4 cases crossed 45-day review threshold without IO progress entry.",
    time: "25 mins ago",
  },
  {
    id: "alt-3",
    type: "Information",
    location: "Mysuru District",
    title: "Cyber Fraud Trend Shift",
    description: "Subhead shift towards UPI / digital payment impersonation frauds.",
    time: "1 hour ago",
  },
  {
    id: "alt-4",
    type: "Resolved",
    location: "Belagavi",
    title: "Chargesheet Submitted",
    description: "FIR No. 202600142 chargesheet filed in District Court.",
    time: "2 hours ago",
  },
];

export default function LiveAlertFeed() {
  const getBadgeStyle = (type: AlertItem["type"]) => {
    switch (type) {
      case "Critical":
        return {
          icon: AlertTriangle,
          container: "bg-red-50 text-red-700 border-red-200",
          tag: "bg-red-100 text-red-800",
        };
      case "Warning":
        return {
          icon: BellRing,
          container: "bg-amber-50 text-amber-700 border-amber-200",
          tag: "bg-amber-100 text-amber-800",
        };
      case "Information":
        return {
          icon: Info,
          container: "bg-blue-50 text-blue-700 border-blue-200",
          tag: "bg-blue-100 text-blue-800",
        };
      case "Resolved":
        return {
          icon: ShieldCheck,
          container: "bg-emerald-50 text-emerald-700 border-emerald-200",
          tag: "bg-emerald-100 text-emerald-800",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Live Attention Queue</h2>
          <p className="text-xs text-slate-500">Real-time signals requiring supervisor review</p>
        </div>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </div>

      <div className="space-y-3">
        {liveAlerts.map((alert) => {
          const style = getBadgeStyle(alert.type);
          const Icon = style.icon;

          return (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-100 p-3.5 hover:bg-slate-50/80 transition"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 shrink-0 ${style.container}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{alert.title}</h3>
                    <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-blue-600 font-medium mt-0.5">{alert.location}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
                  <span className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${style.tag}`}>
                    {alert.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}