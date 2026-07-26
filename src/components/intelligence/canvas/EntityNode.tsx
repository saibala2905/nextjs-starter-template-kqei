// "use client";

// import { Handle, Position } from "reactflow";

// export default function EntityNode({
//   data,
// }: any) {
//   const entity = data.entity;

//   return (
//     <div className="min-w-[220px] rounded-xl border border-slate-300 bg-white shadow-md">

//       <Handle
//         type="target"
//         position={Position.Top}
//       />

//       <div className="border-b bg-slate-50 px-4 py-2">

//         <p className="text-xs font-medium uppercase text-slate-500">
//           {entity.type}
//         </p>

//         <h3 className="font-semibold">
//           {entity.label}
//         </h3>

//       </div>

//       <div className="space-y-1 p-4 text-sm">

//         <div className="flex justify-between">

//           <span>Risk</span>

//           <span className="font-semibold">
//             {entity.risk}
//           </span>

//         </div>

//         <div className="flex justify-between">

//           <span>Confidence</span>

//           <span className="font-semibold">
//             {entity.confidence}%
//           </span>

//         </div>

//       </div>

//       <Handle
//         type="source"
//         position={Position.Bottom}
//       />

//     </div>
//   );
// }

"use client";

import {
  Handle,
  Position,
  NodeProps,
} from "reactflow";

import { Entity } from "@/types/investigation";

interface EntityNodeData {
  entity: Entity;
}

export default function EntityNode({
  data,
}: NodeProps<EntityNodeData>) {

  const entity = data.entity;

  return (

    <div className="min-w-[220px] rounded-xl border border-slate-300 bg-white shadow-md">

      <Handle
        type="target"
        position={Position.Top}
      />

      <div className="border-b bg-slate-50 px-4 py-2">

        <p className="text-xs font-medium uppercase text-slate-500">
          {entity.type}
        </p>

        <h3 className="font-semibold">
          {entity.label}
        </h3>

      </div>

      <div className="space-y-1 p-4 text-sm">

        <div className="flex justify-between">

          <span>Risk</span>

          <span className="font-semibold">
            {entity.risk}
          </span>

        </div>

        <div className="flex justify-between">

          <span>Confidence</span>

          <span className="font-semibold">
            {entity.confidence}%
          </span>

        </div>

      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />

    </div>

  );

}