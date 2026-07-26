// "use client";

// import { useState } from "react";

// import { useRouter } from "next/navigation";

// import { Rnd } from "react-rnd";

// import AssistantHeader from "./AssistantHeader";
// import AssistantContext from "./AssistantContext";
// import SuggestedActions from "./SuggestedActions";
// import TypingIndicator from "./TypingIndicator";

// import ChatInput from "./ChatInput";
// import MessageList, {
//   ChatMessage,
// } from "./MessageList";

// import { useAssistantStore } from "@/store/assistantStore";

// import { runAssistant } from "@/assistant/engine/assistantEngine";

// export default function AssistantDock() {

//   const router = useRouter();

//   const {
//     isOpen,
//     minimized,
//     x,
//     y,
//     width,
//     height,
//     close,
//     toggleMinimize,
//     setPosition,
//     setSize,
//   } = useAssistantStore();

//   const [messages, setMessages] =
//     useState<ChatMessage[]>([]);

//   const [input, setInput] =
//     useState("");

//   const [isTyping, setIsTyping] =
//     useState(false);

//   const hasConversation =
//     messages.length > 0;

//   async function handleSend() {

//     if (!input.trim()) return;

//     const prompt = input.trim();

//     // -----------------------------
//     // Add User Message
//     // -----------------------------

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         role: "user",
//         content: prompt,
//       },
//     ]);

//     setInput("");

//     setIsTyping(true);

//     try {

//       // -----------------------------
//       // Assistant Engine
//       // -----------------------------

//       const result =
//         await runAssistant(
//           prompt,
//           {
//             navigate: (
//               path: string
//             ) => router.push(path),
//           }
//         );

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: crypto.randomUUID(),
//           role: "assistant",
//           content:
//             result.message,
//         },
//       ]);

//     } catch (error) {

//       console.error(error);

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: crypto.randomUUID(),
//           role: "assistant",
//           content:
//             "Something went wrong while processing your request.",
//         },
//       ]);

//     } finally {

//       setIsTyping(false);

//     }

//   }

//   function handleSuggestedAction(
//     prompt: string
//   ) {

//     setInput(prompt);

//   }

//   if (!isOpen) return null;

//   return (

//     <Rnd
//       default={{
//         x,
//         y,
//         width,
//         height,
//       }}
//       minWidth={420}
//       minHeight={620}
//       bounds="window"
//       onDragStop={(e, d) => {

//         setPosition(
//           d.x,
//           d.y
//         );

//       }}
//       onResizeStop={(
//         e,
//         direction,
//         ref,
//         delta,
//         position
//       ) => {

//         setSize(
//           ref.offsetWidth,
//           ref.offsetHeight
//         );

//         setPosition(
//           position.x,
//           position.y
//         );

//       }}
//       style={{
//         zIndex: 9999,
//       }}
//     >

//       <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">

//         {/* Header */}

//         <AssistantHeader
//           onClose={close}
//           onMinimize={toggleMinimize}
//         />

//         {!minimized && (

//           <>

//             {/* Context */}

//             <div
//               className="
//                 transition-all
//                 duration-300
//                 ease-in-out
//               "
//             >

//               <AssistantContext
//                 compact={hasConversation}
//               />

//             </div>

//             {/* Conversation */}

//             <div className="flex-1 overflow-y-auto bg-slate-50">

//               <MessageList
//                 messages={messages}
//               />

//               {isTyping && (
//                 <TypingIndicator />
//               )}

//             </div>

//             {/* Suggested Actions */}

//             {!hasConversation && (

//               <div
//                 className="
//                   transition-all
//                   duration-300
//                   ease-in-out
//                 "
//               >

//                 <SuggestedActions
//                   onAction={
//                     handleSuggestedAction
//                   }
//                 />

//               </div>

//             )}

//             {/* Chat Input */}

//             <ChatInput
//               value={input}
//               onChange={setInput}
//               onSend={handleSend}
//             />

//           </>

//         )}

//       </div>

//     </Rnd>

//   );

// }

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Rnd } from "react-rnd";

import AssistantHeader from "./AssistantHeader";
import AssistantContext from "./AssistantContext";
import SuggestedActions from "./SuggestedActions";
import TypingIndicator from "./TypingIndicator";

import ChatInput from "./ChatInput";
import MessageList, {
  ChatMessage,
} from "./MessageList";

import { useAssistantStore } from "@/store/assistantStore";

import { runAssistant } from "@/assistant/engine/assistantEngine";

export default function AssistantDock() {

  const router = useRouter();

  const {
    isOpen,
    minimized,
    x,
    y,
    width,
    height,
    close,
    toggleMinimize,
    setPosition,
    setSize,
  } = useAssistantStore();

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [input, setInput] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const hasConversation =
    messages.length > 0;

  async function handleSend() {

    if (!input.trim()) return;

    const prompt = input.trim();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    // Update UI immediately
    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    setInput("");

    setIsTyping(true);

    try {

      const result =
        await runAssistant(
          prompt,
          {
            navigate: (
              path: string
            ) => router.push(path),

            messages:
              updatedMessages.map(
                (message) => ({
                  role: message.role,
                  content:
                    message.content,
                })
              ),
          }
        );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            result.message,
        },
      ]);

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Unable to contact KSP AI.",
        },
      ]);

    } finally {

      setIsTyping(false);

    }

  }

  function handleSuggestedAction(
    prompt: string
  ) {

    setInput(prompt);

  }

  if (!isOpen) return null;

  return (

    <Rnd
      default={{
        x,
        y,
        width,
        height,
      }}
      minWidth={420}
      minHeight={620}
      bounds="window"
      onDragStop={(e, d) => {

        setPosition(
          d.x,
          d.y
        );

      }}
      onResizeStop={(
        e,
        direction,
        ref,
        delta,
        position
      ) => {

        setSize(
          ref.offsetWidth,
          ref.offsetHeight
        );

        setPosition(
          position.x,
          position.y
        );

      }}
      style={{
        zIndex: 9999,
      }}
    >

      <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">

        <AssistantHeader
          onClose={close}
          onMinimize={toggleMinimize}
        />

        {!minimized && (

          <>

            <div
              className="
                transition-all
                duration-300
                ease-in-out
              "
            >

              <AssistantContext
                compact={hasConversation}
              />

            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">

              <MessageList
                messages={messages}
              />

              {isTyping && (
                <TypingIndicator />
              )}

            </div>

            {!hasConversation && (

              <div
                className="
                  transition-all
                  duration-300
                  ease-in-out
                "
              >

                <SuggestedActions
                  onAction={
                    handleSuggestedAction
                  }
                />

              </div>

            )}

            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
            />

          </>

        )}

      </div>

    </Rnd>

  );

}