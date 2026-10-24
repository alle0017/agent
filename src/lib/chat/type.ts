export type Type = 'integer' | 'string' | 'float' | 'object' | 'array' | 'boolean' | 'function';
export type BaseDefinition<T extends Type = Type> = {
      type: T,
      description: string
}
export type ObjectDefinition = {
      properties: Record<string, Definition>,
      required: string[]
} & BaseDefinition<'object'>;
export type ArrayDefinition = {
      items: Definition
} & BaseDefinition<'array'>
export type FunctionDefinition = {
      parameters: Definition
      name: string,
} & BaseDefinition<'function'>
export type Definition = ObjectDefinition | BaseDefinition | ArrayDefinition | FunctionDefinition

export interface DefBuilder {
      define(): Definition;
      example(): unknown;
}
export class PrimitiveDef implements DefBuilder {
      public static integer(definition: string) {
            return new PrimitiveDef('integer', definition)
      }
      public static float(definition: string) {
            return new PrimitiveDef('float', definition)
      }
      public static string(definition: string) {
            return new PrimitiveDef('string', definition)
      }
      public static boolean(definition: string) {
            return new PrimitiveDef('boolean', definition)
      }
      constructor(protected readonly type: Type, protected readonly description: string) {}
      public define(): Definition {
            return {
                  type: this.type,
                  description: this.description
            };
      }
      public example(): unknown {
            switch (this.type) {
                  case "string": return 'abcd';
                  case "boolean": return true;
                  case "object": return {};
                  case "function": return (() => {})
                  case "integer": return 0;
                  case "float": return 0.1
                  case "array": return [1,2,3]
            }
      }
}

export class ObjectDef implements DefBuilder {
      private readonly required: string[] = [];
      private readonly properties: Map<string,DefBuilder > = new Map;
      constructor(protected readonly description: string) {}

      public property(name: string, builder: DefBuilder, required: boolean = false) {
            this.properties.set(name, builder);
            if (required) {
                  this.required.push(name);
            }
            return this;
      }
      public define(): Definition {
            const properties: Record<string, Definition> = {};

            for (const [k,v] of this.properties) {
                  properties[k] = v.define();
            }
            return {
                  properties,
                  type: 'object',
                  description: this.description,
                  required: this.required
            };
      }
      public example(): unknown {
            const ex: Record<string, unknown> = {};
            for (const [k,v] of this.properties) {
                  ex[k] = v.example();
            }
            return ex;
      }
}


export class ArrayDef implements DefBuilder {
      constructor(protected readonly description: string, protected readonly items: DefBuilder) {}
      public define(): Definition {
            return {
                  type: 'array',
                  description: this.description,
                  items: this.items.define()
            }
      }
      public example(): unknown {
            return [1,2,3]
      }
}

export class FunctionDef implements DefBuilder {
      constructor(public readonly name: string, public readonly description: string, public readonly args: ObjectDef) {}
      public define(): Definition {
            return {
                  name: this.name,
                  type: 'function',
                  description: this.description,
                  parameters: this.args.define()
            }
      }
      public example(): unknown {
            return (() => {})
      }
}