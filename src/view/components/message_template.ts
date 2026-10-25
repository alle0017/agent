import { map, UserMessage, AgentMessage, ToolCallMessage, ToolResultMessage, Message } from "../../lib/index.js";
import { column, Component, Provider, row, Theme,  } from "../lib/index.js";

const { span, details, summary, div } = Component

function UserMessageTemplate(message: UserMessage) {
      return message.message;
}
function AgentMessageTemplate(message: AgentMessage) {
      return message.message;
}
const titleStyle = () => `font-weight: bolder; color: ${Provider.of(Theme).accentSecondary}; background-color: ${Provider.of(Theme).primary}; padding: 3px; border-radius: 2px;`

function ObjectTemplate(key: string, obj: {} | null): HTMLElement {
      if (!obj) {
            return div({ class: row() }, 
                  span({ style: titleStyle() }, 
                        `${key}: `
                  ),
                  span({}, `NULL`),
            );
      }
      return details({},
            summary({ }, 
                  span({ style: titleStyle() }, 
                        `${key}: `
                  )
            ),
            div({ style: `padding-top: 10px; padding-left: 10px; ${column()}`},
                  ...Object
                  .entries(obj)
                  .map(([k, v]) => typeof v == 'object' ?
                        ObjectTemplate(k, v):
                        div({ class: row() }, 
                              span({ style: titleStyle() }, 
                                    `${k}: `
                              ),
                              span({}, `${v}`),
                        ),
                  )
            )
      )
}
function ToolCallTemplate(message: ToolCallMessage) {
      return details({ },
            summary({ }, `call to tool ${message.name}`),
            div({ style: `padding-top: 10px; ${column()}` },
                  div({ class: row() }, 
                        span({ style: titleStyle() }, `call id:`),
                        span({}, message.id),
                  ),
                  ObjectTemplate('arguments', message.args)
            )
      )
}
function ToolResultTemplate(message: ToolResultMessage) {
      return details({ },
            summary({ }, `result from tool ${message.name}`),
            div({ style: `padding-top: 10px; ${column()}` },
                  div({ class: row() }, 
                        span({ style: titleStyle() }, `call id:`),
                        span({}, message.id),
                  ),
                  ObjectTemplate('result', message.result)
            )
      )
}
export function MessageTemplate({ message }: { message: Message }) {
      return map<HTMLElement | string>(message)
            .match(UserMessage, UserMessageTemplate)
            .match(AgentMessage, AgentMessageTemplate)
            .match(ToolCallMessage, ToolCallTemplate)
            .match(ToolResultMessage, ToolResultTemplate)
            .get()
            .get()
}