"use client";

interface EntityFilterProps {
  selected: string;
  onChange: (value: string) => void;
}

const filters = [
  "All",
  "Person",
  "Vehicle",
  "Phone",
  "Case",
  "Location",
  "Organisation",
  "Account",
  "Weapon",
];

export default function EntityFilter({
  selected,
  onChange,
}: EntityFilterProps) {
  return (
    <div className="space-y-2">

      <h3 className="text-sm font-semibold text-slate-700">
        Entity Filters
      </h3>

      <div className="flex flex-wrap gap-2">

        {filters.map((filter) => {

          const active = selected === filter;

          return (
            <button
              key={filter}
              onClick={() => onChange(filter)}
              className={`
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
            >
              {filter}
            </button>
          );
        })}

      </div>

    </div>
  );
}