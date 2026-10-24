import type { Datasource } from "./datasource.js";
interface IDBEvent<T> extends Event {
      target: { result: T } & EventTarget
}

export type Transaction<T> = (db: IDBDatabase) => IDBRequest<T>;
export type PureTransaction = (db: IDBDatabase) => void;

export interface DatasourceState {
      execute<T>(transaction: Transaction<T>): Promise<T>
      executeDataPure(transaction: PureTransaction): void;
}

type PromiseHandler<T> = {
      resolve(v: T): void,
      reject(e: any): void
}


type Pending = {
      handler: PromiseHandler<unknown>,
      transaction: Transaction<unknown>
} | { transaction: PureTransaction }


export class ReadonlyState implements DatasourceState {
      execute<T>(transaction: Transaction<T>): Promise<T> {
            throw new Error("Method invoked in a non executable phase");
      }
      executeDataPure(transaction: PureTransaction): void {
            throw new Error("Method invoked in a non executable phase");
      }
}
export class PreflightState implements DatasourceState {
      private readonly pending: Pending[] = [];
      constructor(private readonly source: Datasource, name: string, version: number, schema: Map<string, string>) {
            const request = window.indexedDB.open(name, version);
            request.addEventListener('success', e => {
                  const db = (e as IDBEvent<IDBDatabase>).target.result
                  const state = new InflightState(db);
                  this.resolvePending(state);
                  source.changeState(state);
            })
            request.addEventListener('upgradeneeded', (e: Event) => {
                  const db = (e as IDBEvent<IDBDatabase>).target.result
                  for (const [k,v] of schema) {
                        if (!db.objectStoreNames.contains(k)) {
                              db.createObjectStore(k, { keyPath: v });
                        }
                  }
            });
      }
      private resolvePending(state: DatasourceState) {
            for (const pending of this.pending) {
                  if (!('handler' in pending)) {
                        state.executeDataPure(pending.transaction);
                        continue;
                  }
                  state
                        .execute(pending.transaction)
                        .then(pending.handler.resolve)
                        .catch(pending.handler.reject);
            }
      }
      public execute<T>(transaction: Transaction<T>): Promise<T> {
            return new Promise((resolve, reject) => {
                  this.pending.push({
                        handler: { reject, resolve },
                        transaction: transaction as Transaction<unknown>
                  });
            })
      }
      public executeDataPure(transaction: PureTransaction): void {
            this.pending.push({ transaction });
      }
}

export class InflightState implements DatasourceState {
      constructor(private readonly db: IDBDatabase) {}

      public execute<T>(transaction: Transaction<T>): Promise<T> {
            return new Promise((resolve,reject) => {
                  const request = transaction(this.db);
                  request.addEventListener('success', e => resolve((e as IDBEvent<T>).target.result));
                  request.addEventListener('error', e => reject(new Error('transaction failed')));
            });
      }
      public executeDataPure<T>(transaction: PureTransaction) {
            transaction(this.db);
      }
}