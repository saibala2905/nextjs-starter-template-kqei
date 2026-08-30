"use client";

interface Props {
  onAction: (prompt: string) => void;
}

const actions = [
  "Why is Bengaluru flagged as High Threat?",
  "Check Investigating Officer workloads",
  "Open Case Health Workspace",
  "Show Hotspots GIS clusters",
  "Summarize FIR 104430006202600001",
];

export default function SuggestedActions({ onAction }: Props) {
  return (
    <div className="border-t border-slate-200 bg-white p-3.5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Evidence-Grounded Actions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onAction(action)}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}