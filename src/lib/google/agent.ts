import { AgentMessage, Message, ToolCallMessage, } from "../chat/message.js";
import { Chat } from "../chat/chat.js";
import { ObjectDef } from "../chat/type.js";
import { Agent, AgentArgs } from "../chat/agent.js";
import { GoogleAgentService, GoogleAgentResponse, GoogleInput } from "./service.js";
import { GoogleAiMessage } from "./messages.js";



function fromOutput(message: GoogleAgentResponse) {
      switch (message.type) {
            case "text": return new AgentMessage(message.text, message.annotations)
            case "function_call": return new ToolCallMessage(message.id, message.name, message.arguments ?? {})
            default: return new AgentMessage('thinking...', []);
      }
}

export class GoogleAgent implements Agent {
      private static readonly MAX_STEPS = 10;

      private readonly service: GoogleAgentService;

      constructor(key: string, private readonly model: string) { 
            this.service = new GoogleAgentService(key);
      }

      private buildBody(chat: Chat, declarations: { name: string }[], structured: ObjectDef | undefined): GoogleInput {
            const body: GoogleInput = {
                  model: this.model,
                  input: chat.messages.map(m => GoogleAiMessage.fromMessage(m).toJSON()),
                  store: false,
            };
            if (declarations.length) {
                  body.tools = declarations;
            }
            if (structured) {
                  body.response_mime_type = 'application/json';
                  body.response_format = structured.define();
            }
            if (chat.config.temperature !== undefined) {
                  body.generation_config = { temperature: chat.config.temperature };
            }
            return body;
      }
      public async ask({ chat, structured, tools }: AgentArgs): Promise<Message[]> {
            const declarations = tools?.map(t => t.definition.define() as { name: string }) ?? [];
            const body: GoogleInput = this.buildBody(chat, declarations, structured);
            const outputs = await this.service.fetch(body);
            return outputs.map(fromOutput);
      }
}