import { Component } from '../lib/component.js';
import { Provider } from '../lib/provider.js';
import { column, Theme } from '../lib/theme.js';
import { Message } from '../../lib/index.js';
import { icon, Icons } from './icons.js';
import { MessageTemplate } from './message_template.js';

const { div, button } = Component;

export function AbstractMessage({ message, color, align, copy = true }: { message: Message, color: string, align: 'start' | 'end', copy?: boolean }) {
      return div({ style: `align-self: ${align}; width: 70%; padding: 5px; min-height: 100px; background-color: ${color}; border-radius: 7px; ${column()}` },
            div({ style: `align-self: end;`},
                  copy ? 
                  button({ class: 'icon-btn-sm' },
                        icon({  }, 
                              Icons.Copy
                        )
                  ): ''
            ),
            div({ style: 'text-transform: capitalize; padding: 2%;'},
                  MessageTemplate({ message })
            )
      )
}
export function HumanMessage({ message }: { message: Message }) {
      return AbstractMessage({ color: Provider.of(Theme).primary, align: 'end', message })
}

export function AgentMessage({ message }: { message: Message }) {
      return AbstractMessage({ color: Provider.of(Theme).background, align: 'start', message })
}

export function AnyMessage({ message }: { message: Message }) {
      if (message.isUserGenerated()) {
            return HumanMessage({ message });
      }
      return AgentMessage({ message });
}