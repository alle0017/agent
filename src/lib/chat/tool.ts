import { FunctionDef } from "./type.js";

export class Tool {
      
      constructor(
            public readonly definition: FunctionDef
      ) {}
}
export class FunctionalTool extends Tool {
      
      constructor(
            public readonly method: Function,
            definition: FunctionDef
      ) { 
            super(definition);
      }
}