const BACKEND_URL =
  "https://ksp-60075494775.development.catalystserverless.in/server/ksp_aio_function/";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendToQuickML(
  messages: ChatMessage[]
) {

  const response = await fetch(
    BACKEND_URL,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    }
  );

  if (!response.ok) {

    throw new Error(
      "Unable to contact KSP AI."
    );

  }

  return response.json();

}