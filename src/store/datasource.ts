import { DatasourceState, PreflightState, Transaction, PureTransaction, ReadonlyState } from "./state.js";
import type { Class, Entity } from "./repository.js";
export class EntityMetadata {
      public static readonly keys: Map<Class, string> = new Map
      public static readonly tables: Map<Class, string> = new Map
}

export function key<T extends Entity>(keyName: keyof T) {
      return (constructor: Class<T>) => {
            EntityMetadata.keys.set(constructor, keyName.toString());
      }
}
export function table(name: string) {
      return (constructor: Class) => {
            EntityMetadata.tables.set(constructor, name.toString());
      }
}
export function schema<T extends new (...args: any[]) => Datasource>(name: string, version: number, entities: Record<string, Class>) {
      const schema: Map<string, string> = new Map;
      for (const entity of Object.values(entities)) {

            schema.set(
                  EntityMetadata.tables.get(entity) ?? entity.name,  
                  EntityMetadata.keys.get(entity) ?? '_auto'
            );
      }
      return (constructor: T) => {
            return class extends constructor {
                  constructor(...args: any[]) {
                        super(...args);
                        this.changeState(new PreflightState(this, name, version, schema));
                  }
            }
      }
}

export abstract class Datasource {
      private state: DatasourceState;

      constructor() {
            this.state = new ReadonlyState;
      }

      public changeState(state: DatasourceState) {
            this.state = state;
      }

      public execute<T>(transaction: Transaction<T>) {
            return this.state.execute(transaction);
      }
      public executeDataPure(transaction: PureTransaction) {
            return this.state.executeDataPure(transaction);
      }
}