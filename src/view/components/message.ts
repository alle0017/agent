import { border, column, Theme, Provider, Component, type Child } from '../lib/index.js';
import { Message, } from '../../lib/index.js';
import { MessageTemplate } from './message_template.js';
import { ActionBar } from './action_bar.js';
import { Icons } from './icons.js';

const { div } = Component;

type MessageArg = { 
      message: Message, 
      color: string, 
      align: 'start' | 'end', 
      bordered?: boolean 
}
export function AbstractMessage({ message, color, align, bordered = true }: MessageArg, ...children: Child[]) {
      const style = `align-self: ${align}; width: 70%; padding: 5px; min-height: 100px; height: max-content; ${column()}`;

      return div({ style  },
            div({ style: `text-transform: capitalize; padding: 2%; height: 100%; background-color: ${color}; border-radius: 7px; ${bordered ? border(Provider.of(Theme).secondary): 'border: none'};`},
                  MessageTemplate({ message })
            ),
            ...children
      )
}

export function HumanMessage({ message }: { message: Message }) {
      return AbstractMessage({ color: Provider.of(Theme).primary, align: 'end', message },
            ActionBar({},
                  { icon: Icons.Copy, action: () => console.log('copy!') },
                  { icon: Icons.Retry, action: () => console.log('retry!') },
                  { icon: Icons.Edit, action: () => console.log('edit!') }
            )
      );
}

export function AgentMessage({ message }: { message: Message }) {
      return AbstractMessage({ color: Provider.of(Theme).background, align: 'start', message, bordered: false },
            ActionBar({}, 
                  { icon: Icons.Copy, action: () => console.log('copy!') }
            )
      )
}

export function AnyMessage({ message }: { message: Message }) {
      if (message.isUserGenerated()) {
            return HumanMessage({ message });
      }
      return AgentMessage({ message });
}