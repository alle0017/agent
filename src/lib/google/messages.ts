import { Message, ToolCallMessage, AgentMessage, UserMessage, ToolResultMessage  } from "../chat/message.js";
export abstract class GoogleAiMessage<T extends Message> {
      public static fromMessage(msg: Message) {
            if (msg instanceof ToolCallMessage) {
                  return new GoogleToolCallMessage(msg);
            } else if (msg instanceof AgentMessage) {
                  return new GoogleAgentMessage(msg);
            } else if (msg instanceof UserMessage) {
                  return new GoogleUserMessage(msg);
            } else if (msg instanceof ToolResultMessage) {
                  return new GoogleToolResultMessage(msg);
            }
            throw new Error('invalid message found ' + msg)
      }
      constructor(protected readonly msg: T) {}
      public abstract toJSON(): {};
}
export class GoogleUserMessage extends GoogleAiMessage<UserMessage> {
      public override toJSON() {
            return {
                  type: 'user_input',
                  content: [{ type: 'text', text: this.msg.message }]
            } as const;
      }
}
export class GoogleToolResultMessage extends GoogleAiMessage<ToolResultMessage> {      
      public override toJSON() {
            return {
                  type: 'function_result',
                  name: this.msg.name,
                  call_id: this.msg.id,
                  result: this.msg.result,
            } as const;
      }
}
export class GoogleAgentMessage extends GoogleAiMessage<AgentMessage> {
      public override toJSON() {
            return {
                  type: 'model_output',
                  content: [{ type: 'text', text: this.msg.message, annotations: this.msg.annotations }]
            } as const;
      }
}

export class GoogleToolCallMessage extends GoogleAiMessage<ToolCallMessage> {
      public override toJSON() {
            return {
                  type: 'function_call',
                  id: this.msg.id,
                  name: this.msg.name,
                  arguments: this.msg.args,
            } as const;
      }
}
