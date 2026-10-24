import { Datasource, EntityMetadata } from "./datasource.js"
export type Class<T extends Entity = Entity> = new() => T

export class Entity {
      public readonly _auto = crypto.randomUUID();
}

export abstract class Repository<T extends Entity> {
      private readonly table: string;
      private readonly key: keyof T;
      constructor(private readonly datasource: Datasource, private readonly entity: Class<T>) {
            this.table = EntityMetadata.tables.get(entity) ?? entity.name;
            this.key = (EntityMetadata.keys.get(entity) ?? '_auto') as keyof T;
      }

      public get(key: string) {
            return this.datasource.execute(db => {
                  const trans = db.transaction([this.table], "readonly");
                  const store = trans.objectStore(this.table);
                  const request: IDBRequest<T> = store.get(key);
                  return request;
            })
      }

      public getAll() {
            return this.datasource.execute(db => {
                  const trans = db.transaction([this.table], "readonly");
                  const store = trans.objectStore(this.table);
                  const request: IDBRequest<T[]> = store.getAll();
                  return request;
            })
      }

      public insertOrUpdate(obj: T) {
            return this.datasource.execute(db => {
                  const trans = db.transaction([this.table], "readwrite");
                  const store = trans.objectStore(this.table);
                  const request = store.put(obj);
                  return request;
            });
      }

      public delete(obj: T) {
            return this.datasource.execute(db => {
                  const trans = db.transaction([this.table], "readwrite");
                  const store = trans.objectStore(this.table);
                  const key = obj[this.key];
                  if (typeof key != 'string') {
                        throw new TypeError(`invalid key type found for table ${this.table}`);
                  }
                  const request = store.delete(key);
                  return request;
            });
      }
}
