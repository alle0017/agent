import { Agent, AgentArgs } from '../chat/agent.js';
import { AgentMessage, Message, ToolCallMessage } from '../chat/message.js';
export class TestAgent implements Agent {
      public ask({ chat, tools }: AgentArgs): Promise<Message[]> {
            return new Promise(resolve => {
                  setTimeout(() => {
                        if (tools && tools.length >= 1) {
                              resolve([new ToolCallMessage(crypto.randomUUID(), tools[0].definition.name, tools[0].definition.args.example() as {})]);
                              return;
                        }
                        resolve([new AgentMessage('[agent] ping', [])])
                  }, 3000)
            });
      }
} 