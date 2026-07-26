"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./LeafletMap"), {
  ssr: false,
});

export default function CrimeMap() {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b p-6">

        <div>
          <h2 className="text-xl font-semibold">
            Geospatial Crime Intelligence
          </h2>

          <p className="text-sm text-slate-500">
            Interactive statewide crime visualization
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          Live Map
        </div>

      </div>

      <div className="h-[600px]">
        <Map />
      </div>

    </section>
  );
}