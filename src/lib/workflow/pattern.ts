import { AgentState } from "../workflow.js";
import { Actor } from "./actor.js";
import { Flow } from "./flow";

export function ReAct<T extends AgentState>(reason: Actor<T>, act: Actor<T>, evaluate: (state: T) => boolean) {
      return Flow
      .from(reason)
      .when(state => evaluate(state) ? 'continue': 'finish',
            {
                  'continue': Flow.from(act).pipe(reason),
                  'finish': Flow.ofNone()
            }
      )
}

/**
 * pattern that implements the `generator evaluator` design pattern.
 * is an alias of the `ReAct` pattern
 */
export const GenEval = ReAct;