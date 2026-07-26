"use client";

import { useRef } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
}: ChatInputProps) {

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      if (!value.trim()) return;

      onSend();

    }

  }

  return (

    <div className="border-t bg-white p-4">

      <div className="flex items-end gap-3 rounded-xl border bg-slate-50 px-3 py-2">

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask KSP AI anything..."
          value={value}
          disabled={disabled}
          onChange={(e) =>
            onChange(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="
            max-h-40
            min-h-[28px]
            flex-1
            resize-none
            bg-transparent
            outline-none
            text-sm
            placeholder:text-slate-400
          "
        />

        <button
          onClick={onSend}
          disabled={
            disabled ||
            !value.trim()
          }
          className="
            rounded-lg
            bg-blue-600
            p-2
            text-white
            transition
            hover:bg-blue-700
            disabled:bg-slate-300
          "
        >

          <SendHorizontal size={18} />

        </button>

      </div>

    </div>

  );

}