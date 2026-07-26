import {
  ShieldAlert,
  TrendingUp,
  Brain,
  MapPinned,
} from "lucide-react";

export default function SituationAssessment() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">
        <Brain className="h-6 w-6 text-blue-600" />

        <div>
          <h2 className="text-xl font-semibold">
            AI Situation Assessment
          </h2>

          <p className="text-sm text-slate-500">
            Real-time intelligence generated from statewide crime data.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <div className="rounded-xl bg-red-50 p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-600" />
            <h3 className="font-semibold">
              Threat Level
            </h3>
          </div>

          <p className="mt-4 text-3xl font-bold text-red-600">
            HIGH
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Crime intensity exceeds historical average.
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-600" />

            <h3 className="font-semibold">
              Risk Score
            </h3>
          </div>

          <p className="mt-4 text-3xl font-bold">
            82 / 100
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Based on AI prediction models.
          </p>
        </div>

      </div>

      <div className="mt-8">

        <h3 className="mb-3 font-semibold">
          Key Findings
        </h3>

        <ul className="space-y-3 text-slate-600">

          <li>
            • Vehicle theft increased by 21% in Bengaluru East.
          </li>

          <li>
            • Cyber fraud complaints rising in Mysuru.
          </li>

          <li>
            • Two organised crime groups show linked activity.
          </li>

          <li>
            • Emerging hotspot identified near Hubballi.
          </li>

        </ul>

      </div>

      <div className="mt-8 rounded-xl bg-green-50 p-5">

        <div className="mb-3 flex items-center gap-2">

          <MapPinned className="text-green-600" />

          <h3 className="font-semibold">
            AI Recommendations
          </h3>

        </div>

        <ul className="space-y-2 text-slate-700">

          <li>
            ✓ Increase patrol deployment in Bengaluru East.
          </li>

          <li>
            ✓ Strengthen cyber monitoring in Mysuru.
          </li>

          <li>
            ✓ Monitor organised activity in Hubballi.
          </li>

        </ul>

      </div>

    </div>
  );
}