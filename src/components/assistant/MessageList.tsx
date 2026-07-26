"use client";

import MessageBubble from "./MessageBubble";

export interface ChatMessage {

  id: string;

  role: "user" | "assistant";

  content: string;

}

interface Props {

  messages: ChatMessage[];

}

export default function MessageList({

  messages,

}: Props) {

  if (
    messages.length === 0
  ) {

    return (

      <div className="flex h-full items-center justify-center p-8">

        <div className="space-y-4 text-center">

          <h2 className="text-lg font-semibold">

            Welcome to KSP AI

          </h2>

          <p className="text-sm text-slate-500">

            I can help investigate entities,
            analyse relationships,
            predict crime patterns,
            generate reports and navigate
            the Intelligence Platform.

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="space-y-4 p-4">

      {messages.map((message) => (

        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
        />

      ))}

    </div>

  );

}