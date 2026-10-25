import type { Class } from "../workflow.js";
import { Optional } from "../workflow/index.js";

export type Source = 'user' | 'agent' | 'tool_call' | 'tool_result';
export abstract class Message {
      constructor(
            public readonly source: Source,
      ) { }
      public abstract isUserGenerated(): boolean;
      public abstract template(): string;
}

export class UserMessage extends Message {
      constructor(public readonly message: string) {
            super('user');
      }
      public override isUserGenerated(): boolean {
            return true;
      }
      public template(): string {
            return this.message;
      }
}
export class ToolCallMessage extends Message {
      constructor(
            public readonly id: string,
            public readonly name: string,
            public readonly args: {} = {},
      ) {
            super('tool_call');
      }
      public override isUserGenerated(): boolean { return false; }
      public template(): string {
            return `called ${this.name} with arguments: ${JSON.stringify(this.args)}`;
      }
}
export class ToolResultMessage extends Message {
      public static fromError(id: string, name: string, error: string) {
            return new ToolResultMessage(id, name, { error })
      }
      public readonly result: {};
      constructor(public readonly id: string, public readonly name: string, result: {}) {
            super('tool_result');
            this.result = typeof result === 'object' && result !== null ? result : { value: result }
      }
      public override isUserGenerated(): boolean {
            return false;
      }
      public template(): string {
            return `tool ${this.name} responded with ${JSON.stringify(this.result)}`;
      }
}
export class AgentMessage extends Message {
      constructor(public readonly message: string, public readonly annotations: {}[]) {
            super('agent');
      }
      public override isUserGenerated(): boolean {
            return false;
      }
      public template(): string {
            return this.message;
      }
}
export class MessageMapper<T> {
      private readonly type: Class<Message>;
      private readonly value: Optional<T> = Optional.none();
      constructor(private readonly message: Message) {
            this.type = Object.getPrototypeOf(message).constructor;
      }

      public match<M extends Message>(message: Class<M>, f: (m: M) => T) {
            if (this.type == message) {
                  this.value.swapIfEmpty(f(this.message as M));
            }
            return this;
      }

      public get() {
            return this.value;
      }
}

export const map = <T>(message: Message) => new MessageMapper<T>(message);