import { map, UserMessage, AgentMessage, ToolCallMessage, ToolResultMessage, Message } from "../../lib/index.js";
import { Component } from "../lib/index.js";

const { span } = Component

export function MessageTemplate({ message }: { message: Message }) {
      return map<HTMLElement>(message)
            .match(UserMessage, m => span({ }, m.message ))
            .match(AgentMessage, m => span({ }, m.message ))
            .match(ToolCallMessage, m => span({ }, m.id ))
            .match(ToolResultMessage, m => span({ }, m.id ))
            .get()
            .get()
}