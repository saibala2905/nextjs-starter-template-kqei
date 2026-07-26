import {
  AssistantTool,
  // ToolContext,
  ToolResult,
} from "../engine/toolTypes";

export const investigationTool: AssistantTool = {

  id: "investigation",

  name: "Investigation",

  description:
    "Investigation commands",

  canHandle(prompt) {

    const text =
      prompt.toLowerCase();

    return (
      text.includes("investigation") ||
      text.includes("graph")
    );

  },

  async execute(
    // prompt,
    // context
  ): Promise<ToolResult> {

    return {

      handled: true,

      message:
        "Investigation tools will be connected in the next step.",

    };

  },

};