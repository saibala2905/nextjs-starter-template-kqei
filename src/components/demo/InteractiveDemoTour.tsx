"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Mic,
  ArrowRight,
  CheckCircle2,
  Maximize2,
  ShieldAlert,
  Network,
  Bot,
  Cloud,
  LayoutDashboard,
} from "lucide-react";

export interface DemoStep {
  id: number;
  title: string;
  badge: string;
  route: string;
  icon: typeof LayoutDashboard;
  summary: string[];
  script: string;
  actionLabel?: string;
  actionPayload?: "hud" | "chat" | "modal";
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "Executive Command Center",
    badge: "Operational Intelligence",
    route: "/dashboard",
    icon: LayoutDashboard,
    summary: [
      "1,499 authentic FIR records loaded from Zoho Catalyst Data Store ZCQL.",
      "Live KPI cards: Active investigations, chargesheet rates, and caseload growth.",
      "Automated AI Situation Assessment with Threat Level 3 risk scoring.",
    ],
    script:
      "Namaskara and hello. Welcome to KSP AI v2.0. This Command Center monitors statewide crime registrations, active caseloads, and investigation velocities in real time.",
    actionLabel: "View Dashboard Overview",
  },
  {
    id: 2,
    title: "Tactical War Room Map HUD",
    badge: "GIS Command Experience",
    route: "/dashboard",
    icon: Maximize2,
    summary: [
      "Full-canvas ESRI GIS map with Apple-style translucent frosted glassmorphism.",
      "Dynamic Sonar Radar Sector Scans across all 38 Karnataka districts.",
      "One-click 'Lock-On Heinous FIR' and interactive pin mission cards.",
      "Adaptive glass theming across Dark, Light, and Aerial Satellite imagery.",
    ],
    script:
      "The Tactical HUD transforms the state map into an interactive command center with sonar sweeps and lock-on heinous case targeting.",
    actionLabel: "Launch Tactical HUD",
    actionPayload: "hud",
  },
  {
    id: 3,
    title: "ML Sentinel Protocols & Rule Engine",
    badge: "Autonomous Surveillance",
    route: "/monitoring",
    icon: ShieldAlert,
    summary: [
      "Statistical Gaussian Z-score anomaly detector discovering velocity bursts across 38 districts.",
      "Custom security protocol builder (Operation Night Vigil, Cyber Shield, Highway Intercept).",
      "Dynamic animated pulsing Geo-Fence perimeters projected directly onto GIS maps.",
      "Automated police unit dispatches (Mobile Patrol 108, Cyber Advisories, Toll Barricades).",
    ],
    script:
      "Our ML Sentinel engine automatically detects statistical crime bursts and projects live pulsing geo-fences with automated police dispatchers.",
    actionLabel: "Open Sentinel Command Center",
  },
  {
    id: 4,
    title: "Network Intelligence Knowledge Graph",
    badge: "Syndicate Link Analysis",
    route: "/intelligence/network",
    icon: Network,
    summary: [
      "Interactive React Flow graph mapping suspects, vehicles, phones, and bank accounts.",
      "Automated syndicate ring discovery and financial fraud transaction trails.",
      "Live entity risk scoring algorithms and confidence metric evaluations.",
    ],
    script:
      "The Knowledge Graph connects suspects, phone records, and vehicles to reveal hidden criminal syndicates and financial fraud links.",
    actionLabel: "Explore Knowledge Graph",
  },
  {
    id: 5,
    title: "Bilingual AI Investigation Copilot",
    badge: "Zoho QuickML Assistant",
    route: "/dashboard",
    icon: Bot,
    summary: [
      "Native English and Kannada conversational AI powered by Zoho QuickML.",
      "Generates instant FIR summaries, suggests legal sections, and navigates the platform.",
      "Persistent floating copilot accessible anywhere in the command ecosystem.",
    ],
    script:
      "Our bilingual AI Copilot powered by Zoho QuickML assists officers in fluent Kannada and English with case law and instant FIR analysis.",
    actionLabel: "Open AI Copilot",
    actionPayload: "chat",
  },
  {
    id: 6,
    title: "Zoho Catalyst Serverless Cloud",
    badge: "Sub-Second Cloud Architecture",
    route: "/dashboard",
    icon: Cloud,
    summary: [
      "Unified microservice Node.js backend (ksp_aio_function) handling 17 ZCQL endpoints.",
      "ZCQL Data Store querying authentic FIR records with sub-second latency.",
      "100% cloud-native deployment on Zoho Catalyst Slate with zero idle server costs.",
    ],
    script:
      "KSP AI is built entirely on Zoho Catalyst serverless infrastructure for sub-second performance, high reliability, and zero idle costs.",
    actionLabel: "Finish Demo Tour",
  },
];

interface InteractiveDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchHUD?: () => void;
  onOpenChat?: () => void;
}

export default function InteractiveDemoTour({
  isOpen,
  onClose,
  onLaunchHUD,
  onOpenChat,
}: InteractiveDemoTourProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = DEMO_STEPS[currentStepIndex];

  // Auto-navigate to step's route and trigger feature actions
  const handleGoToStep = (index: number) => {
    if (index < 0 || index >= DEMO_STEPS.length) return;
    setCurrentStepIndex(index);
    const targetStep = DEMO_STEPS[index];

    if (targetStep.actionPayload === "hud") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ksp:toggle-hud", { detail: { mode: "hud" } }));
      }
    }

    if (targetStep.route && pathname !== targetStep.route) {
      if (targetStep.actionPayload === "hud") {
        router.push("/dashboard?view=hud");
      } else {
        router.push(targetStep.route);
      }
    }
  };

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      handleGoToStep(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      handleGoToStep(currentStepIndex - 1);
    }
  };

  const handleExecuteAction = () => {
    if (step.actionPayload === "hud") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ksp:toggle-hud", { detail: { mode: "hud" } }));
      }
      if (pathname !== "/dashboard") {
        router.push("/dashboard?view=hud");
      }
      if (onLaunchHUD) onLaunchHUD();
    } else if (step.actionPayload === "chat") {
      if (typeof document !== "undefined") {
        const chatBtn = document.querySelector('button[aria-label="Toggle KSP AI"]') as HTMLButtonElement | null;
        if (chatBtn) chatBtn.click();
      }
      if (onOpenChat) onOpenChat();
    } else if (step.route && pathname !== step.route) {
      router.push(step.route);
    }
  };

  if (!isOpen) return null;

  const StepIcon = step.icon;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="overflow-hidden rounded-3xl border-2 border-cyan-400/50 bg-slate-950/90 text-white shadow-[0_20px_60px_0_rgba(0,0,0,0.8)] backdrop-blur-3xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-2 text-white shadow-md">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">
                  Interactive Solution Walkthrough
                </h3>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-400/30">
                  Step {step.id} of {DEMO_STEPS.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Step Progress Dots */}
            <div className="hidden sm:flex items-center gap-1 mr-3">
              {DEMO_STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => handleGoToStep(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentStepIndex
                      ? "w-6 bg-cyan-400"
                      : i < currentStepIndex
                      ? "w-2 bg-blue-500"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  title={`Jump to ${s.title}`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              title="Close Tour"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Title & Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2.5 text-cyan-300 border border-white/10 shrink-0">
                <StepIcon size={20} />
              </div>
              <div>
                <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                  {step.badge}
                </span>
                <h2 className="text-base font-extrabold text-white mt-0.5">{step.title}</h2>
              </div>
            </div>

            {step.actionLabel && (
              <button
                onClick={handleExecuteAction}
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-3.5 py-2 text-xs font-bold text-white transition shadow-md cursor-pointer shrink-0"
              >
                <span>{step.actionLabel}</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          {/* Key Bullet Highlights */}
          <ul className="space-y-1.5 pl-1">
            {step.summary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Voiceover Presenter Script Box */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px] mb-1">
              <Mic size={13} className="animate-pulse text-cyan-400" />
              <span>Presenter Voiceover Script:</span>
            </div>
            <p className="text-[11px] text-cyan-100 italic leading-relaxed font-sans">
              &quot;{step.script}&quot;
            </p>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition font-bold text-xs cursor-pointer"
          >
            Skip / Exit Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition border ${
                currentStepIndex === 0
                  ? "border-white/5 text-slate-600 cursor-not-allowed"
                  : "border-white/15 bg-white/5 text-white hover:bg-white/15 cursor-pointer"
              }`}
            >
              <ChevronLeft size={14} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-1.5 text-xs font-black text-slate-950 transition shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <span>{currentStepIndex === DEMO_STEPS.length - 1 ? "Finish Tour" : "Next"}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
