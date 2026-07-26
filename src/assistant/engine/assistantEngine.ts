import { navigationTool } from "../tools/navigationTool";

export interface AssistantContext {
  navigate: (path: string) => void;

  messages: {
    role: string;
    content: string;
  }[];
}

export interface AssistantResult {
  handled: boolean;
  message: string;
}

const BACKEND_URL =
  "https://ksp-60075494775.development.catalystserverless.in/server/ksp_aio_function/";

export async function runAssistant(
  prompt: string,
  context: AssistantContext
): Promise<AssistantResult> {

  // ==========================================
  // 1. Navigation Tool
  // ==========================================

  const navigation = navigationTool(
    prompt,
    context.navigate
  );

  if (navigation.handled) {
    return navigation;
  }

  // ==========================================
  // 2. Investigation Tool
  // (Coming next)
  // ==========================================

  // const investigation =
  //   investigationTool(...)

  // ==========================================
  // 3. QuickML Backend
  // ==========================================

  try {

    const response = await fetch(
      BACKEND_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          messages: context.messages,
        }),
      }
    );

    if (!response.ok) {

      throw new Error(
        "Unable to contact KSP AI."
      );

    }

    const result =
      await response.json();

    return {
      handled: true,
      message:
        result.message ??
        result.response ??
        "No response received.",
    };

  } catch (error) {

    console.error(error);

    return {

      handled: false,

      message:
        "Unable to reach the KSP AI backend.",

    };

  }

}