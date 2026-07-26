// "use client";

// import { ReactNode } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";

// interface SectionHeaderProps {
//   icon: ReactNode;
//   title: string;
//   description: string;
//   summary?: string;
//   open: boolean;
//   onToggle: () => void;
// }

// export default function SectionHeader({
//   icon,
//   title,
//   description,
//   summary,
//   open,
//   onToggle,
// }: SectionHeaderProps) {
//   return (
//     <div className="mb-6">

//       <button
//         onClick={onToggle}
//         className="group w-full rounded-xl transition hover:bg-slate-50"
//       >
//         <div className="flex items-center justify-between px-2 py-3">

//           <div className="flex items-center gap-4">

//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
//               {icon}
//             </div>

//             <div className="text-left">

//               <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition">
//                 {title}
//               </h2>

//               <p className="text-sm text-slate-500">
//                 {description}
//               </p>

//               {summary && (
//                 <p className="mt-2 text-xs font-medium text-slate-600">
//                   {summary}
//                 </p>
//               )}

//             </div>

//           </div>

//           <div className="rounded-lg border bg-white p-2 shadow-sm">

//             {open ? (
//               <ChevronDown className="h-5 w-5 text-slate-600" />
//             ) : (
//               <ChevronRight className="h-5 w-5 text-slate-600" />
//             )}

//           </div>

//         </div>
//       </button>

//       <div className="mt-4 h-px bg-gradient-to-r from-blue-500 via-slate-300 to-transparent" />

//     </div>
//   );
// }

"use client";

import { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type BadgeColor =
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "purple"
  | "gray";

interface Badge {
  label: string;
  color?: BadgeColor;
}

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  badges?: Badge[];
  open: boolean;
  onToggle: () => void;
}

const badgeStyles: Record<BadgeColor, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  gray: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function SectionHeader({
  icon,
  title,
  description,
  badges = [],
  open,
  onToggle,
}: SectionHeaderProps) {
  return (
    <div className="mb-6">

      <button
        onClick={onToggle}
        className="group w-full rounded-xl transition hover:bg-slate-50"
      >

        <div className="flex items-center justify-between px-2 py-3">

          {/* Left Side */}
          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              {icon}
            </div>

            <div className="text-left">

              <h2 className="text-2xl font-bold text-slate-900 transition group-hover:text-blue-600">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>

              {badges.length > 0 && (

                <div className="mt-3 flex flex-wrap gap-2">

                  {badges.map((badge) => (

                    <span
                      key={badge.label}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${badgeStyles[badge.color ?? "gray"]}`}
                    >
                      {badge.label}
                    </span>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* Right Side */}

          <div className="rounded-lg border bg-white p-2 shadow-sm transition group-hover:border-blue-200">

            {open ? (
              <ChevronDown className="h-5 w-5 text-slate-600" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-600" />
            )}

          </div>

        </div>

      </button>

      <div className="mt-4 h-px bg-gradient-to-r from-blue-500 via-slate-300 to-transparent" />

    </div>
  );
}