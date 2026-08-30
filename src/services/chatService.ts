import { getAiUrl } from "./apiClient";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendToQuickML(messages: ChatMessage[]) {
  const aiBase = getAiUrl().replace(/\/$/, "");
  const response = await fetch(`${aiBase}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`KSP AI Error [${response.status}]: ${errorText}`);
  }

  return response.json();
}