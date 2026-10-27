import { Chat } from "./chat.js";
import { Message } from "./message.js";
import { Tool } from "./tool.js";
import { ObjectDef } from "./type.js";

export type AgentArgs = {
      chat: Chat,
      structured?: ObjectDef,
      tools?: Tool[]
      systemPrompt?: string
}
export interface Agent {
      ask(args: AgentArgs): Promise<Message[]>;
}

