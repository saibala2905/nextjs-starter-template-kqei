"use client";

import { Trash2 } from "lucide-react";

import { Entity } from "@/types/investigation";

interface QueuePanelProps {
  entities: Entity[];
  onRemove: (id: string) => void;
}

export default function QueuePanel({
  entities,
  onRemove,
}: QueuePanelProps) {
  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-semibold text-slate-700">
          Current Investigation
        </h3>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {entities.length} Selected
        </span>

      </div>

      {entities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">
            No entities added to this investigation yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">

          {entities.map((entity) => (

            <div
              key={entity.id}
              className="flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm"
            >

              <div>

                <p className="font-semibold text-slate-800">
                  {entity.label}
                </p>

                <p className="text-xs text-slate-500">
                  {entity.id} • {entity.type}
                </p>

              </div>

              <button
                onClick={() => onRemove(entity.id)}
                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}