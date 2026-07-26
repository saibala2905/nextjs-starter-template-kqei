"use client";

import { Plus, AlertTriangle } from "lucide-react";

import type { Entity } from "@/types/investigation";

interface SearchResultsProps {
  entities: Entity[];
  onAdd: (entity: Entity) => void;
}

export default function SearchResults({
  entities,
  onAdd,
}: SearchResultsProps) {
  if (entities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">
          No matching entities found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-semibold text-slate-700">
          Search Results
        </h3>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
          {entities.length} Results
        </span>

      </div>

      {entities.map((entity) => (

        <div
          key={entity.id}
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            transition-all
            hover:border-blue-400
            hover:shadow-md
          "
        >

          <div className="flex items-start justify-between">

            <div className="space-y-2">

              <div className="flex items-center gap-2">

                <span className="font-semibold text-slate-900">
                  {entity.label}
                </span>

                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {entity.type}
                </span>

              </div>

              <p className="text-xs font-medium text-slate-500">
                {entity.id}
              </p>

              {entity.description && (
                <p className="text-sm text-slate-600">
                  {entity.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">

                {entity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      rounded-full
                      bg-slate-100
                      px-2
                      py-1
                      text-[11px]
                      text-slate-600
                    "
                  >
                    {tag}
                  </span>
                ))}

              </div>

              <div className="flex items-center gap-6 pt-1">

                <div className="flex items-center gap-2">

                  <AlertTriangle
                    size={14}
                    className="text-orange-500"
                  />

                  <span className="text-xs text-slate-500">
                    Risk
                  </span>

                  <span className="font-semibold text-orange-600">
                    {entity.risk}
                  </span>

                </div>

                <div className="text-xs text-slate-500">

                  Confidence

                  <span className="ml-2 font-semibold text-green-600">
                    {entity.confidence}%
                  </span>

                </div>

              </div>

            </div>

            <button
              onClick={() => onAdd(entity)}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-3
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <Plus size={16} />

              Add to Investigation

            </button>

          </div>

        </div>

      ))}

    </div>
  );
}