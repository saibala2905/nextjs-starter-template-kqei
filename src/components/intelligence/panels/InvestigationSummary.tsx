// "use client";

// import {
//   BrainCircuit,
//   Network,
//   ShieldAlert,
//   Sparkles,
// } from "lucide-react";

// import { useMemo } from "react";

// import { useInvestigationStore } from "@/store/investigationStore";

// export default function InvestigationSummary() {

//   const {
//     canvasNodes,
//     canvasEdges,
//   } = useInvestigationStore();

//   const summary = useMemo(() => {

//     const entities =
//       canvasNodes.map(
//         (node: any) => node.data.entity
//       );

//     const highRisk =
//       entities.filter(
//         (entity) => entity.risk >= 80
//       ).length;

//     const avgRisk =
//       entities.length === 0
//         ? 0
//         : Math.round(
//             entities.reduce(
//               (sum, entity) => sum + entity.risk,
//               0
//             ) / entities.length
//           );

//     return {

//       entityCount: entities.length,

//       relationshipCount:
//         canvasEdges.length,

//       highRisk,

//       avgRisk,

//     };

//   }, [canvasNodes, canvasEdges]);

//   return (

//     <div className="mb-6 rounded-2xl border bg-white shadow-sm">

//       <div className="border-b px-6 py-4">

//         <div className="flex items-center gap-3">

//           <BrainCircuit className="text-blue-600" />

//           <div>

//             <h2 className="font-semibold">
//               Investigation Summary
//             </h2>

//             <p className="text-sm text-slate-500">
//               Live intelligence overview
//             </p>

//           </div>

//         </div>

//       </div>

//       <div className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-4">

//         <Card
//           icon={<Network size={20} />}
//           title="Entities"
//           value={summary.entityCount}
//           color="blue"
//         />

//         <Card
//           icon={<Network size={20} />}
//           title="Relationships"
//           value={summary.relationshipCount}
//           color="green"
//         />

//         <Card
//           icon={<ShieldAlert size={20} />}
//           title="High Risk"
//           value={summary.highRisk}
//           color="red"
//         />

//         <Card
//           icon={<Sparkles size={20} />}
//           title="Average Risk"
//           value={`${summary.avgRisk}%`}
//           color="amber"
//         />

//       </div>

//       <div className="border-t bg-blue-50 px-6 py-4">

//         <p className="text-sm font-semibold text-blue-700">
//           AI Recommendation
//         </p>

//         <p className="mt-2 text-sm text-slate-600">

//           {summary.highRisk > 0
//             ? "Review high-risk entities first and expand their immediate network."
//             : "Continue expanding the investigation to identify additional connected entities."}

//         </p>

//       </div>

//     </div>

//   );

// }

// interface CardProps {
//   icon: React.ReactNode;
//   title: string;
//   value: string | number;
//   color:
//     | "blue"
//     | "green"
//     | "red"
//     | "amber";
// }

// function Card({
//   icon,
//   title,
//   value,
//   color,
// }: CardProps) {

//   const colors = {

//     blue: "bg-blue-100 text-blue-700",

//     green: "bg-green-100 text-green-700",

//     red: "bg-red-100 text-red-700",

//     amber: "bg-amber-100 text-amber-700",

//   };

//   return (

//     <div className="rounded-xl border p-5">

//       <div className="flex items-center justify-between">

//         <div>

//           <p className="text-sm text-slate-500">
//             {title}
//           </p>

//           <p className="mt-2 text-3xl font-bold">
//             {value}
//           </p>

//         </div>

//         <div
//           className={`rounded-xl p-3 ${colors[color]}`}
//         >
//           {icon}
//         </div>

//       </div>

//     </div>

//   );

// }

"use client";

import { useMemo } from "react";

import type { Node } from "reactflow";

import {
  BrainCircuit,
  Network,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import type { Entity } from "@/types/investigation";

import { useInvestigationStore } from "@/store/investigationStore";

export default function InvestigationSummary() {

  const {
    canvasNodes,
    canvasEdges,
  } = useInvestigationStore();

  const summary = useMemo(() => {

    const entities = canvasNodes.map(
      (node: Node<{ entity: Entity }>) =>
        node.data.entity
    );

    const highRisk = entities.filter(
      (entity) => entity.risk >= 80
    ).length;

    const avgRisk =
      entities.length === 0
        ? 0
        : Math.round(
            entities.reduce(
              (sum, entity) =>
                sum + entity.risk,
              0
            ) / entities.length
          );

    return {

      entityCount: entities.length,

      relationshipCount:
        canvasEdges.length,

      highRisk,

      avgRisk,

    };

  }, [canvasNodes, canvasEdges]);

  return (

    <div className="mb-6 rounded-2xl border bg-white shadow-sm">

      {/* Header */}

      <div className="border-b px-6 py-4">

        <div className="flex items-center gap-3">

          <BrainCircuit className="text-blue-600" />

          <div>

            <h2 className="font-semibold">
              Investigation Summary
            </h2>

            <p className="text-sm text-slate-500">
              Live intelligence overview
            </p>

          </div>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-4">

        <Card
          icon={<Network size={20} />}
          title="Entities"
          value={summary.entityCount}
          color="blue"
        />

        <Card
          icon={<Network size={20} />}
          title="Relationships"
          value={summary.relationshipCount}
          color="green"
        />

        <Card
          icon={<ShieldAlert size={20} />}
          title="High Risk"
          value={summary.highRisk}
          color="red"
        />

        <Card
          icon={<Sparkles size={20} />}
          title="Average Risk"
          value={`${summary.avgRisk}%`}
          color="amber"
        />

      </div>

      {/* AI Recommendation */}

      <div className="border-t bg-blue-50 px-6 py-4">

        <p className="text-sm font-semibold text-blue-700">
          AI Recommendation
        </p>

        <p className="mt-2 text-sm text-slate-600">

          {summary.highRisk > 0
            ? "Review high-risk entities first and expand their immediate network."
            : "Continue expanding the investigation to identify additional connected entities."}

        </p>

      </div>

    </div>

  );

}

interface CardProps {

  icon: React.ReactNode;

  title: string;

  value: string | number;

  color:
    | "blue"
    | "green"
    | "red"
    | "amber";

}

function Card({
  icon,
  title,
  value,
  color,
}: CardProps) {

  const colors = {

    blue: "bg-blue-100 text-blue-700",

    green: "bg-green-100 text-green-700",

    red: "bg-red-100 text-red-700",

    amber: "bg-amber-100 text-amber-700",

  };

  return (

    <div className="rounded-xl border p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>

        </div>

        <div
          className={`rounded-xl p-3 ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>

  );

}