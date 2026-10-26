import { border, column, Theme, Provider, Component, type Child } from '../lib/index.js';
import { Message, } from '../../lib/index.js';
import { MessageTemplate } from './message_template.js';
import { ActionBar } from './action_bar.js';

const { div } = Component;

type MessageArg = { 
      message: Message, 
      color: string, 
      align: 'start' | 'end', 
      bordered?: boolean 
}
export function AbstractMessage({ message, color, align, bordered = true }: MessageArg, ...children: Child[]) {
      const style = `
            align-self: ${align}; 
            width: 70%; 
            padding: 5px; 
            min-height: 100px; 
            background-color: ${color}; 
            border-radius: 7px; 
            ${bordered ? border(Provider.of(Theme).secondary): 'border: none'}; 
            ${column()}
      `;

      return div({ style  },
            div({ style: 'text-transform: capitalize; padding: 2%; height: 100%;'},
                  MessageTemplate({ message })
            ),
            ...children
      )
}

export function HumanMessage({ message }: { message: Message }) {
      return AbstractMessage({ color: Provider.of(Theme).primary, align: 'end', message },
            ActionBar({ copy: () => console.log('copy!'), retry: () => console.log('retry!'), })
      )
}

export function AgentMessage({ message }: { message: Message }) {
      return AbstractMessage({ color: Provider.of(Theme).background, align: 'start', message, bordered: false },
            ActionBar({ copy: () => console.log('copy!') })
      )
}

export function AnyMessage({ message }: { message: Message }) {
      if (message.isUserGenerated()) {
            return HumanMessage({ message });
      }
      return AgentMessage({ message });
}