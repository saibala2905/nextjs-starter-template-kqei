// "use client";

// import Image from "next/image";
// import {
//   Activity,
//   Clock3,
//   ShieldCheck,
// } from "lucide-react";

// export default function HeroBanner() {
//   const now = new Date();

//   const greeting =
//     now.getHours() < 12
//       ? "Good Morning"
//       : now.getHours() < 17
//       ? "Good Afternoon"
//       : "Good Evening";

//   const formattedDate = now.toLocaleDateString("en-IN", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   const formattedTime = now.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <section
//       className="
//         relative
//         mb-8
//         overflow-hidden
//         rounded-2xl
//         border
//         border-slate-200
//         bg-gradient-to-r
//         from-white
//         via-slate-50
//         to-blue-50
//         shadow-sm
//       "
//     >
//       {/* Left Accent */}
//       <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />

//       {/* Karnataka Watermark */}
//       <Image
//         src="/images/karnataka_map.svg"
//         alt=""
//         width={420}
//         height={420}
//         priority
//         className="
//           pointer-events-none
//           absolute
//           -right-12
//           -bottom-20
//           opacity-[0.05]
//           select-none
//         "
//       />

//       {/* Content */}
//       <div className="relative z-10 flex flex-col justify-between gap-8 p-8 lg:flex-row lg:items-center">
//         {/* Left Section */}
//         <div className="flex items-start gap-5">
//           <div className="rounded-2xl bg-blue-100 p-4">
//             <ShieldCheck className="h-10 w-10 text-blue-700" />
//           </div>

//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">
//               AI Crime Intelligence Command Center
//             </h1>

//             <p className="mt-1 text-lg font-medium text-slate-600">
//               Karnataka State Police
//             </p>

//             <p className="mt-6 text-lg font-semibold text-slate-800">
//               {greeting}, Administrator.
//             </p>

//             <p className="mt-3 max-w-3xl leading-7 text-slate-500">
//               Monitor crime intelligence, emerging threats,
//               predictive policing insights, criminal networks
//               and investigative analytics from a unified AI
//               powered platform.
//             </p>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex flex-col gap-5 lg:items-end">
//           {/* Live Status */}
//           <div className="flex items-center gap-3 rounded-full bg-green-100 px-5 py-2">
//             <span className="relative flex h-3 w-3">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>

//               <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
//             </span>

//             <span className="text-sm font-semibold text-green-700">
//               System Live
//             </span>
//           </div>

//           {/* Last Updated */}
//           <div className="flex items-center gap-2 text-slate-500">
//             <Clock3 className="h-4 w-4" />

//             <span className="text-sm">
//               Last Updated
//             </span>
//           </div>

//           {/* Date */}
//           <div className="text-right">
//             <p className="font-semibold text-slate-700">
//               {formattedDate}
//             </p>

//             <p className="text-sm text-slate-500">
//               {formattedTime}
//             </p>
//           </div>

//           {/* Operational Status */}
//           <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
//             <div className="flex items-center gap-3">
//               <Activity className="h-5 w-5 text-blue-600" />

//               <div>
//                 <p className="text-sm font-semibold text-blue-700">
//                   Operational Status
//                 </p>

//                 <p className="text-xs text-slate-600">
//                   All Intelligence Services Operational
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import {
  Activity,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function HeroBanner() {
  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";

  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      className="
        relative
        mb-8
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-gradient-to-r
        from-white
        via-slate-50
        to-blue-50
        shadow-sm
      "
    >
      {/* Left Accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />

      {/* Karnataka Watermark */}
      <img
        src="https://ksp-fe-assets-development.zohostratus.in/images/karnataka_map.svg"
        alt=""
        draggable={false}
        className="
          pointer-events-none
          absolute
          -right-12
          -bottom-20
          w-[420px]
          opacity-[0.05]
          select-none
        "
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between gap-8 p-8 lg:flex-row lg:items-center">

        {/* Left */}
        <div className="flex items-start gap-5">

          <div className="rounded-2xl bg-blue-100 p-4">
            <ShieldCheck className="h-10 w-10 text-blue-700" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              AI Crime Intelligence Command Center
            </h1>

            <p className="mt-1 text-lg font-medium text-slate-600">
              Karnataka State Police
            </p>

            <p className="mt-6 text-lg font-semibold text-slate-800">
              {greeting}, Administrator.
            </p>

            <p className="mt-3 max-w-3xl leading-7 text-slate-500">
              Monitor crime intelligence, emerging threats,
              predictive policing insights, criminal networks
              and investigative analytics from a unified AI
              powered platform.
            </p>

          </div>

        </div>

        {/* Right */}
        <div className="flex flex-col gap-5 lg:items-end">

          {/* System Live */}
          <div className="flex items-center gap-3 rounded-full bg-green-100 px-5 py-2">

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>

              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>

            </span>

            <span className="text-sm font-semibold text-green-700">
              System Live
            </span>

          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-slate-500">

            <Clock3 className="h-4 w-4" />

            <span className="text-sm">
              Last Updated
            </span>

          </div>

          {/* Date & Time */}
          <div className="text-right">

            <p className="font-semibold text-slate-700">
              {formattedDate}
            </p>

            <p className="text-sm text-slate-500">
              {formattedTime}
            </p>

          </div>

          {/* Operational Status */}
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">

            <div className="flex items-center gap-3">

              <Activity className="h-5 w-5 text-blue-600" />

              <div>

                <p className="text-sm font-semibold text-blue-700">
                  Operational Status
                </p>

                <p className="text-xs text-slate-600">
                  All Intelligence Services Operational
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}