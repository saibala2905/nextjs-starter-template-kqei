"use client";

import { Bot } from "lucide-react";

import { useAssistantStore } from "@/store/assistantStore";

export default function AssistantLauncher() {

  const {
    isOpen,
    open,
  } = useAssistantStore();

  if (isOpen) return null;

  return (

    <button
      onClick={open}
      className="
        fixed
        bottom-6
        right-6
        z-[9999]
        flex
        items-center
        gap-3
        rounded-full
        bg-blue-600
        px-5
        py-4
        text-white
        shadow-2xl
        transition
        hover:scale-105
        hover:bg-blue-700
      "
    >

      <Bot size={22} />

      <span className="font-semibold">

        KSP AI

      </span>

    </button>

  );

}