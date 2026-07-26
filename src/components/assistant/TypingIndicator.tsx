"use client";

import { Bot } from "lucide-react";

export default function TypingIndicator() {

  return (

    <div className="flex items-center gap-3 p-4">

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">

        <Bot
          size={16}
          className="text-blue-600"
        />

      </div>

      <div className="rounded-xl border bg-white px-4 py-3">

        <div className="flex gap-1">

          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{
              animationDelay: "0.2s",
            }}
          />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{
              animationDelay: "0.4s",
            }}
          />

        </div>

      </div>

    </div>

  );

}