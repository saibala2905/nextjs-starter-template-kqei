import {
  AlertTriangle,
  ShieldCheck,
  BellRing,
} from "lucide-react";

const alerts = [
  {
    type: "Critical",
    location: "Bengaluru East",
    message: "Vehicle Theft Spike",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
  {
    type: "Warning",
    location: "Hubballi",
    message: "Gang Activity Detected",
    color: "bg-orange-100 text-orange-700",
    icon: BellRing,
  },
  {
    type: "Information",
    location: "Mysuru",
    message: "Cyber Fraud Trend",
    color: "bg-blue-100 text-blue-700",
    icon: ShieldCheck,
  },
  {
    type: "Resolved",
    location: "Mangaluru",
    message: "Repeat Offender Arrested",
    color: "bg-green-100 text-green-700",
    icon: ShieldCheck,
  },
];

export default function LiveAlertFeed() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Live Intelligence Feed
      </h2>

      <div className="space-y-4">

        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.message}
              className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition"
            >

              <div className="flex items-start gap-3">

                <div className={`rounded-lg p-2 ${alert.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {alert.message}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {alert.location}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs">
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