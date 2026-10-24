import { Agent, AgentArgs } from '../chat/agent.js';
import { AgentMessage, Message } from '../chat/message.js';
export class TestAgent implements Agent {
      public async ask({ chat, }: AgentArgs): Promise<Message[]> {
            return [new AgentMessage('[agent] ping', [])]
      }
} 