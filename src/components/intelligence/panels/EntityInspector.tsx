"use client";

import {
  AlertTriangle,
  BadgeInfo,
  Database,
  Hash,
  ShieldCheck,
  Tag,
} from "lucide-react";

import { useInvestigationStore } from "@/store/investigationStore";

export default function EntityInspector() {

  const {
    selectedEntity,
  } = useInvestigationStore();

  if (!selectedEntity) {

    return (

      <div className="rounded-2xl border bg-white shadow-sm">

        <div className="border-b px-6 py-5">

          <h2 className="text-lg font-semibold">
            Investigation Details
          </h2>

          <p className="text-sm text-slate-500">
            Select an entity from the graph.
          </p>

        </div>

        <div className="flex h-96 items-center justify-center">

          <div className="text-center">

            <Database
              className="mx-auto mb-4 text-slate-300"
              size={48}
            />

            <h3 className="text-lg font-semibold text-slate-700">
              No Entity Selected
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Click any node inside the investigation graph to
              inspect its intelligence profile.
            </p>

          </div>

        </div>

      </div>

    );

  }

  return (

    <div className="rounded-2xl border bg-white shadow-sm">

      {/* Header */}

      <div className="border-b px-6 py-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">

              {selectedEntity.type}

            </p>

            <h2 className="mt-1 text-xl font-bold">

              {selectedEntity.label}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {selectedEntity.id}

            </p>

          </div>

          <ShieldCheck
            className="text-blue-600"
            size={32}
          />

        </div>

      </div>

      {/* Body */}

      <div className="space-y-6 p-6">

        {/* Risk */}

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-xl border bg-slate-50 p-4">

            <div className="flex items-center gap-2">

              <AlertTriangle
                size={18}
                className="text-red-500"
              />

              <span className="text-sm text-slate-600">

                Risk

              </span>

            </div>

            <p className="mt-3 text-2xl font-bold">

              {selectedEntity.risk}

            </p>

          </div>

          <div className="rounded-xl border bg-slate-50 p-4">

            <div className="flex items-center gap-2">

              <BadgeInfo
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm text-slate-600">

                Confidence

              </span>

            </div>

            <p className="mt-3 text-2xl font-bold">

              {selectedEntity.confidence}%

            </p>

          </div>

        </div>

        {/* Description */}

        {selectedEntity.description && (

          <div>

            <h3 className="mb-3 font-semibold">

              Description

            </h3>

            <p className="text-sm leading-7 text-slate-600">

              {selectedEntity.description}

            </p>

          </div>

        )}

        {/* Tags */}

        {selectedEntity.tags.length > 0 && (

          <div>

            <h3 className="mb-3 flex items-center gap-2 font-semibold">

              <Tag size={18} />

              Tags

            </h3>

            <div className="flex flex-wrap gap-2">

              {selectedEntity.tags.map((tag) => (

                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                >

                  {tag}

                </span>

              ))}

            </div>

          </div>

        )}

        {/* Properties */}

        <div>

          <h3 className="mb-3 flex items-center gap-2 font-semibold">

            <Hash size={18} />

            Properties

          </h3>

          <div className="space-y-2">

            {Object.entries(
              selectedEntity.properties
            ).map(([key, value]) => (

              <div
                key={key}
                className="flex justify-between rounded-lg border bg-slate-50 px-4 py-3"
              >

                <span className="capitalize text-slate-600">

                  {key}

                </span>

                <span className="font-medium">

                  {String(value)}

                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Future AI */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

          <h3 className="font-semibold text-blue-700">

            AI Investigation Assistant

          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">

            This section will provide AI-generated
            investigation summaries, relationship
            analysis, behavioural insights, and
            recommended investigative actions based
            on the current entity.

          </p>

        </div>

      </div>

    </div>

  );

}