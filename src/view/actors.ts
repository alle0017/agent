import { Agent, AgentArgs, Chat, AgentMessage, TestAgent, AgentActor, AgentState, consume, Flow, ToolActor, tool, FunctionDef, ObjectDef, PrimitiveDef } from "../lib/index.js"


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

export class Tools extends ToolActor<AgentState> {
      private readonly _agent: Agent = new TestAgent
      protected agent(): Agent {
            return this._agent;
      }
      protected prompt(state: AgentState): AgentArgs {
            return {
                  chat: state.chat,
                  tools: this.usedTools()
            }
      }
      @tool(new FunctionDef('getWeather', 'get the weather in a given city', new ObjectDef('arguments of the function').property('city', PrimitiveDef.string('city where to check the weather'))))
      private getWeather({ city }: { city: string }) {
            return `is windy today in ${city}`;
      }
}

export async function ask(chat: Chat) {
      await Flow
      .from(new OracleActor)
      .pipe(new Tools)
      .run(new AgentState(chat))
}