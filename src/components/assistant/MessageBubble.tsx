"use client";

import { Bot, User } from "lucide-react";

interface Props {

  role: "user" | "assistant";

  content: string;

}

export default function MessageBubble({

  role,

  content,

}: Props) {

  const isUser =
    role === "user";

  return (

    <div
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {!isUser && (

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">

          <Bot
            size={16}
            className="text-blue-600"
          />

        </div>

      )}

      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-blue-600 text-white"
            : "border bg-white"
        }`}
      >

        {content}

      </div>

      {isUser && (

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">

          <User size={16} />

        </div>

      )}

    </div>

  );

}