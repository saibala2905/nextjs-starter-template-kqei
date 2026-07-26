export interface ToolContext {
  navigate?: (path: string) => void;
}

export interface ToolResult {
  handled: boolean;
  message: string;
}

export interface AssistantTool {
  id: string;

  name: string;

  description: string;

  canHandle(
    prompt: string
  ): boolean;

  execute(
    prompt: string,
    context: ToolContext
  ): Promise<ToolResult>;
}