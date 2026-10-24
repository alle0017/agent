import { State } from "./state.js";
export interface Actor<T> {
      run(state: T): Promise<T>
}

export class System {
      private static readonly map: Map<string, Actor<State>> = new Map;

      public static getActor(id: string) {
            if (!this.map.has(id)) {
                  throw new Error(`actor ${id} doesn't exists`);
            }
            return this.map.get(id)!;
      }

      public static use(id: string, actor: Actor<State>) {
            this.map.set(id, actor);
            return this;
      }
}

export abstract class ActorRef<T> implements Actor<T> {
      public abstract run(state: T): Promise<T>;
}