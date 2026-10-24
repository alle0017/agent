import { Agent, AgentArgs, Chat, AgentMessage, TestAgent, AgentActor, AgentState, consume, System, Flow } from "../lib/index.js"


export class OracleActor extends AgentActor<AgentState> {
      private readonly _agent: Agent = new TestAgent
      protected agent(): Agent {
            return this._agent;
      }
      protected prompt(state: AgentState): AgentArgs {
            return {
                  chat: state.chat
            }
      }
      @consume(AgentMessage)
      private append(message: AgentMessage, state: AgentState) {
            state.chat.append(message);
            return state;
      }
}

System.use('oracle', new OracleActor);

export async function ask(chat: Chat) {
      return (await Flow.from<AgentState>('oracle').run(new AgentState(chat))).chat
}