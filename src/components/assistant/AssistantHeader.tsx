"use client";

import {
  Bot,
  Minus,
  X,
} from "lucide-react";

interface Props {

  onClose: () => void;

  onMinimize: () => void;

}

export default function AssistantHeader({

  onClose,

  onMinimize,

}: Props) {

  return (

    <div className="flex items-center justify-between border-b bg-blue-600 px-5 py-4 text-white">

      <div className="flex items-center gap-3">

        <Bot size={18} />

        <div>

          <p className="font-semibold">
            KSP AI
          </p>

          <p className="text-xs text-blue-100">
            Investigation Copilot
          </p>

        </div>

      </div>

      <div className="flex gap-2">

        <button
          onClick={onMinimize}
          className="rounded p-1 hover:bg-blue-500"
        >
          <Minus size={18} />
        </button>

        <button
          onClick={onClose}
          className="rounded p-1 hover:bg-blue-500"
        >
          <X size={18} />
        </button>

      </div>

    </div>

  );

}