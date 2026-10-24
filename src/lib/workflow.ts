import { Agent, AgentArgs } from "./chat/agent.js";
import { Chat } from "./chat/chat.js";
import { Message, ToolCallMessage, ToolResultMessage } from "./chat/message.js";
import { FunctionalTool, Tool } from "./chat/tool.js";
import { FunctionDef, } from "./chat/type.js";
import { ActorRef } from "./workflow/actor.js";
import { State } from "./workflow/state.js";
export type Class<T extends {} = {}> = new(...args: any[]) => T

export class AgentState extends State {
      constructor(public readonly chat: Chat) {
            super()
      }
}
type Consumer<T extends AgentState, M extends Message = Message> = (message: M, state: T) => Promise<T> | T

export abstract class AgentActor<T extends AgentState> extends ActorRef<T> {
      private readonly consumers: Map<Class<Message>, Set<Consumer<T>>> = new Map;
      protected abstract agent(): Agent;
      protected abstract prompt(state: T): AgentArgs;

      public async run(state: T): Promise<T> {
            const agent = this.agent();
            const messages = await agent.ask(this.prompt(state));
            for (const message of messages) {
                  const type = Object.getPrototypeOf(message).constructor;
                  const consumers = this.consumers.get(type);
                  if (!consumers) {
                        continue;
                  }
                  for (const consumer of consumers) {
                        const promise = consumer(message, state);
                        if (promise instanceof Promise) {
                              state = await promise
                        } else {
                              state = promise;
                        }
                  }
            }
            return state;
      }

      public addConsumer<M extends Message>(message: Class<M>, consumer: Consumer<T, M>) {
            this.consumers.getOrInsertComputed(message, () => new Set).add(consumer as Consumer<T>);
            return this;
      }
}

export function consume<M extends Message>(message: Class<M>) {
      return <T extends AgentState>(method: Consumer<T, M>, ctx: ClassMethodDecoratorContext<AgentActor<T>>) => {
            ctx.addInitializer(function (this) {
                  this.addConsumer(message, (m, s) => method.call(this, m, s));
            })
      }
}
export function tool(def: FunctionDef) {
      return <T extends AgentState>(method: Function, ctx: ClassMethodDecoratorContext<ToolActor<T>>) => {
            ctx.addInitializer(function (this) {
                  this.use(
                        new FunctionalTool(
                              (...args: any[]) => method.call(this, ...args),
                              def
                        )
                  );
            })
      }
}

export abstract class ToolActor<T extends AgentState> extends AgentActor<T> {
      private readonly tools: Map<string, Tool> = new Map;

      @consume(ToolCallMessage)
      private async execute(message: ToolCallMessage, state: T) {
            const tool = this.tools.get(message.name);

            if (!(tool instanceof FunctionalTool)) {
                  state.chat.append(ToolResultMessage.fromError(message.id, message.name, `Unknown or non-executable tool: ${message.name}`));
                  return state;
            }
            try {
                  let promise = tool.method(message.args);
                  while (promise && promise instanceof Promise) {
                        promise = await promise;
                  }
                  state.chat.append(new ToolResultMessage(message.id, message.name, promise));
            } catch (e) {
                  state.chat.append(ToolResultMessage.fromError(message.id, message.name, e instanceof Error ? e.message : String(e)));
            }
            return state
      }
      protected usedTools() {
            return [...this.tools.values()];
      }
      public use(tool: Tool) {
            this.tools.set(tool.definition.name, tool);
            return this;
      }
}