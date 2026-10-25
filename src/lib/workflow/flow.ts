import { List } from "./list.js";
import { State } from "./state.js";
import { FlowCommand, Reference, ForkFlowCommand, ConditionalFlowCommand, SubFlowCommand } from "./flow_commands.js";
import { Actor } from "./actor.js";

export class Flow<T extends State> {
      public static from<T extends State>(actor: Actor<T>) {
            return new Flow<T>(new Reference(actor));
      }

      private readonly stream: List<FlowCommand<T>>;

      constructor(init: FlowCommand<T>) {
            this.stream = new List(init);
      }
      public subflow(flow: Flow<T>) {
            this.stream.append(new SubFlowCommand(flow));
            return this;
      }
      public fork(...flows: Flow<T>[]) {
            this.stream.append(new ForkFlowCommand(flows));
            return this;
      }
      public when<K extends string, Z extends Record<K, Flow<T>>>(condition: (state: T) => K, actors: Z) {
            this.stream.append(new ConditionalFlowCommand(condition, actors));
            return this;
      }
      public pipe(actor: Actor<T>) {
            this.stream.append(new Reference(actor));
            return this;
      }
      public async run(state: T): Promise<T> {
            for (const node of this.stream) {
                  state = await node.run(state);
            }
            return state;
      }
}