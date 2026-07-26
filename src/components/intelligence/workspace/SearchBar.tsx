"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-slate-700">
        Search Investigation Entities
      </label>

      <div className="relative">

        <Search
          className="
            absolute
            left-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search person, vehicle, phone, case, location..."
          className="
            h-12
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            pl-12
            pr-20
            text-sm
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />

        {value && (
          <button
            onClick={() => onChange("")}
            className="
              absolute
              right-12
              top-1/2
              -translate-y-1/2
              rounded-md
              p-1
              hover:bg-slate-100
            "
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        )}

        <div
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            rounded-md
            border
            bg-slate-50
            px-2
            py-1
            text-[10px]
            font-semibold
            text-slate-500
          "
        >
          Ctrl K
        </div>

      </div>

      <p className="text-xs text-slate-500">
        Search across people, vehicles, cases, phones, organisations,
        financial accounts and locations.
      </p>

    </div>
  );
}