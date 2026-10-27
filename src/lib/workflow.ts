import { Chat } from "./chat/chat.js";
import { map, Message, ToolCallMessage, ToolResultMessage } from "./chat/message.js";
import { FunctionalTool, Tool } from "./chat/tool.js";
import { State } from "./workflow/state.js";
export type Class<T extends {} = {}> = new(...args: any[]) => T

export class AgentState extends State {
      constructor(public readonly chat: Chat) {
            super()
      }
}
type Consumer<T extends AgentState, M extends Message = Message> = (message: M, state: T) => Promise<T> | T

export class ToolManager<T extends AgentState> {
      private readonly tools: Map<string, Tool> = new Map;

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
      private usedTools() {
            return [...this.tools.values()];
      }
      public async run(messages: Message[], state: T) {
            for (const message of messages) {
                  state = await map<Promise<T> | T>(message)
                        .match(ToolCallMessage, m => this.execute(m, state))
                        .get()
                        .orElse(state);
            }
      }
      public use(tool: Tool) {
            this.tools.set(tool.definition.name, tool);
            return this;
      }
}
export function withTools<T extends AgentState>() {
      return new ToolManager();
}
