import { Agent, AgentArgs } from '../chat/agent.js';
import { AgentMessage, Message, ToolCallMessage } from '../chat/message.js';
export class TestAgent implements Agent {
      public async ask({ chat, tools }: AgentArgs): Promise<Message[]> {
            if (tools && tools.length >= 1) {
                  return [new ToolCallMessage(crypto.randomUUID(), tools[0].definition.name, tools[0].definition.args.example() as {})];
            }
            return [new AgentMessage('[agent] ping', [])]
      }
} 