"use client";

import {
  Trash2,
  Network,
} from "lucide-react";

interface InvestigationActionsProps {
  disabled?: boolean;
  onClear: () => void;
  onBuild: () => void;
}

export default function InvestigationActions({
  disabled = false,
  onClear,
  onBuild,
}: InvestigationActionsProps) {
  return (
    <div className="space-y-3">

      <button
        disabled={disabled}
        onClick={onBuild}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:bg-slate-300
        "
      >
        <Network size={18} />

        Build Investigation Graph

      </button>

      <button
        onClick={onClear}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          py-3
          text-sm
          font-semibold
          transition
          hover:bg-slate-50
        "
      >
        <Trash2 size={18} />

        Clear Investigation

      </button>

    </div>
  );
}