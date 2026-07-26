// "use client";

// import {
//   MapPin,
//   Network,
//   Target,
// } from "lucide-react";

// import { usePathname } from "next/navigation";

// import { useInvestigationStore } from "@/store/investigationStore";

// export default function AssistantContext() {

//   const pathname = usePathname();

//   const {
//     entities,
//     relationships,
//     selectedEntity,
//   } = useInvestigationStore();

//   const currentModule = (() => {

//     if (pathname.includes("network"))
//       return "Network Intelligence";

//     if (pathname.includes("predictive"))
//       return "Predictive Intelligence";

//     if (pathname.includes("analytics"))
//       return "Crime Analytics";

//     if (pathname.includes("assistant"))
//       return "AI Assistant";

//     return "Dashboard";

//   })();

//   return (

//     <div className="border-b bg-slate-50 p-4">

//       <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">

//         Current Context

//       </div>

//       <div className="space-y-3">

//         <div className="flex items-center gap-3">

//           <MapPin
//             size={16}
//             className="text-blue-600"
//           />

//           <div>

//             <p className="text-xs text-slate-500">
//               Module
//             </p>

//             <p className="text-sm font-semibold">
//               {currentModule}
//             </p>

//           </div>

//         </div>

//         <div className="flex items-center gap-3">

//           <Target
//             size={16}
//             className="text-red-500"
//           />

//           <div>

//             <p className="text-xs text-slate-500">
//               Selected Entity
//             </p>

//             <p className="text-sm font-semibold">

//               {selectedEntity
//                 ? selectedEntity.label
//                 : "None"}

//             </p>

//           </div>

//         </div>

//         <div className="flex items-center gap-3">

//           <Network
//             size={16}
//             className="text-green-600"
//           />

//           <div>

//             <p className="text-xs text-slate-500">
//               Investigation
//             </p>

//             <p className="text-sm font-semibold">

//               {entities.length} Entities • {relationships.length} Links

//             </p>

//           </div>

//         </div>

//       </div>

//     </div>

//   );

// }

"use client";

import {
  MapPin,
  Network,
  Target,
} from "lucide-react";

import { usePathname } from "next/navigation";

import { useInvestigationStore } from "@/store/investigationStore";

interface Props {

  compact?: boolean;

}

export default function AssistantContext({

  compact = false,

}: Props) {

  const pathname = usePathname();

  const {
    entities,
    relationships,
    selectedEntity,
  } = useInvestigationStore();

  const currentModule = (() => {

    if (pathname.includes("network"))
      return "Network Intelligence";

    if (pathname.includes("predictive"))
      return "Predictive Intelligence";

    if (pathname.includes("analytics"))
      return "Crime Analytics";

    if (pathname.includes("assistant"))
      return "AI Assistant";

    return "Dashboard";

  })();

  if (compact) {

    return (

      <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-2 text-xs">

        <span>
          📍 {currentModule}
        </span>

        <span>
          🎯 {selectedEntity ? selectedEntity.label : "None"}
        </span>

        <span>
          🕸 {entities.length}E • {relationships.length}L
        </span>

      </div>

    );

  }

  return (

    <div className="border-b bg-slate-50 p-4">

      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">

        Current Context

      </div>

      <div className="space-y-3">

        <div className="flex items-center gap-3">

          <MapPin
            size={16}
            className="text-blue-600"
          />

          <div>

            <p className="text-xs text-slate-500">
              Module
            </p>

            <p className="text-sm font-semibold">
              {currentModule}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Target
            size={16}
            className="text-red-500"
          />

          <div>

            <p className="text-xs text-slate-500">
              Selected Entity
            </p>

            <p className="text-sm font-semibold">
              {selectedEntity
                ? selectedEntity.label
                : "None"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Network
            size={16}
            className="text-green-600"
          />

          <div>

            <p className="text-xs text-slate-500">
              Investigation
            </p>

            <p className="text-sm font-semibold">
              {entities.length} Entities • {relationships.length} Links
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}