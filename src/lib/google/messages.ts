import { Message, ToolCallMessage, AgentMessage, UserMessage, ToolResultMessage  } from "../chat/message.js";

export type GoogleContent = {
      type: 'text' | 'model_output',
      text: string,
      annotations?: {}[]
}

export type ModelOutput = {
      content: Array<GoogleContent>,
      type: "model_output"
}
export type FunctionCall = {
      type: 'function_call'
      annotations: string[]
      id: string,
      name: string,
      arguments: {}
}
export type FunctionResult = {
      type: 'function_result'
      call_id: string,
      name: string,
      result: {}
}
export type UserInput = {
      content: Array<GoogleContent>,
      type: "user_input"
}
export type GoogleSerializable = ModelOutput | FunctionCall | FunctionResult | UserInput

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
      public abstract toJSON(): GoogleSerializable;
}
export class GoogleUserMessage extends GoogleAiMessage<UserMessage> {
      public override toJSON() {
            return {
                  type: 'user_input' as const,
                  content: [{ type: 'text' as const, text: this.msg.message }],
            };
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
                  type: 'model_output' as const,
                  content: [{ type: 'text' as const, text: this.msg.message, annotations: this.msg.annotations }]
            };
      }
}

export class GoogleToolCallMessage extends GoogleAiMessage<ToolCallMessage> {
      public override toJSON() {
            return {
                  type: 'function_call' as const,
                  id: this.msg.id,
                  name: this.msg.name,
                  arguments: this.msg.args,
                  annotations: []
            };
      }
}

export function deserialize(message: GoogleSerializable) {
      switch (message.type) {
            case "model_output": return new AgentMessage(message.content.filter(m => m.type == 'text').map(p => p.text).reduce((p,c) => p + c, ''), [])
            case "function_call": return new ToolCallMessage(message.id, message.name, message.arguments ?? {})
            case 'function_result': return new ToolResultMessage(message.call_id, message.name, message.result);
            case "user_input": return new UserMessage(message.content.filter(m => m.type == 'text').map(p => p.text).reduce((p,c) => p + c, ''))
            default: return new AgentMessage('thinking...', []);
      }
}