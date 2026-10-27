import { Message, } from "../chat/message.js";
import { Chat } from "../chat/chat.js";
import { ObjectDef } from "../chat/type.js";
import { Agent, AgentArgs } from "../chat/agent.js";
import { GoogleAgentService, GoogleInput } from "./service.js";
import { deserialize, GoogleAiMessage } from "./messages.js";




export class GoogleAgent implements Agent {
      private static readonly MAX_STEPS = 10;

      private readonly service: GoogleAgentService;

      constructor(key: string, private readonly model: string) { 
            this.service = new GoogleAgentService(key);
      }

      private buildBody(chat: Chat, declarations: { name: string }[], structured: ObjectDef | undefined, systemPrompt: string): GoogleInput {
            const body: GoogleInput = {
                  model: this.model,
                  input: chat.messages.map(m => GoogleAiMessage.fromMessage(m).toJSON()),
                  store: false,
                  system_instruction: systemPrompt
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
      public async ask({ chat, structured, tools, systemPrompt = '' }: AgentArgs): Promise<Message[]> {
            const declarations = tools?.map(t => t.definition.define() as { name: string }) ?? [];
            const body: GoogleInput = this.buildBody(chat, declarations, structured, systemPrompt);
            const outputs = await this.service.fetch(body);
            return outputs.map(deserialize);
      }
}