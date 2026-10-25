import { State } from "./state.js";
import { type Flow } from "./flow.js";
import { Actor } from "./actor.js";
export interface FlowCommand<T extends State> {
      run(state: T): Promise<T> | T
}

export class ForkFlowCommand<T extends State> implements FlowCommand<T> {
      constructor(private readonly flows: Flow<T>[]) {}
      public async run(state: T): Promise<T> {
            const promises = this.flows.map(flow => flow.run(state));
            return Promise.all(promises).then(states => states.reduce((p,c) => p.merge(c), state))
      }
}

export class SubFlowCommand<T extends State> extends ForkFlowCommand<T> {
      constructor(flow: Flow<T>) {
            super([flow]);
      }
}
export class ConditionalFlowCommand<T extends State, K extends string, Z extends Record<K, Flow<T>>> implements FlowCommand<T> {
      constructor(private readonly condition: (state: T) => K, private readonly actors: Z) {}
      public async run(state: T): Promise<T> {
            const actor = this.condition(state);
            return this.actors[actor].run(state);
      }
}
export class Reference<T extends State> implements FlowCommand<T> {
      constructor(private readonly actor: Actor<T>) {}
      public run(state: T): Promise<T> {
            return this.actor.run(state) as Promise<T>;
      }
}
export class NoneFlow<T extends State> implements FlowCommand<T> {
      public run(state: T): T {
            return state;
      }
}