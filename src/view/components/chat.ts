import { bind, column, Component, Hook, row, } from '../lib/index.js';
import { AnyMessage } from './message.js';
import { icon, Icons } from './icons.js';
import { Agent, UserMessage, Chat as Model } from '../../lib/index.js';
import { ask } from '../actors.js';

const { div, input, button } = Component;


export function Chat({ chat, agent }: { chat: Model, agent: Agent }) {
      const message = bind('input');
      function mount(el: HTMLElement) {
            chat.on('append', e => {
                  el.append(AnyMessage({ message: e.message }));
            })
      }
      async function send() {
            if (!message.value) {
                  return;
            }
            chat.append(new UserMessage(message.value));
            await ask(chat);
            message.element()!.value = '';
            message.value = '';
      }
      document.addEventListener('keypress', e => {
            if (e.key.toLowerCase() == 'enter') {
                  send().catch(console.error);
            }
      })
      return div({ style:  `width: 800px; ${column()}` },
            Hook({ mount },
                  div({ style: `width: 800px; height: 600px; overflow-y: scroll; ${column()}` },)
            ),
            div({ style: `align-items: center; ${row()}` },
                  message.binding(
                        input({ placeholder: 'insert a question here...' })
                  ),
                  button({ class: 'icon-btn', click: send },
                        icon({ width: 64, height: 64 }, 
                              Icons.Clipboard
                        )
                  ),
                  button({ class: 'icon-btn', click: send },
                        icon({ width: 64, height: 64 }, 
                              Icons.Send
                        )
                  )
            )
      )
}