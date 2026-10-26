import { bind, column, Component, Hook, } from '../lib/index.js';
import { AnyMessage } from './message.js';
import { UserMessage, Chat as Model } from '../../lib/index.js';
import { ask } from '../actors.js';
import { Input } from './input.js';

const { div, } = Component;


export function Chat({ chat }: { chat: Model }) {
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
      return div({ style:  `width: 60vw; margin-top: 50px; ${column()}` },
            div({ style: `width: 60vw; height: 70vh; overflow-y: scroll;` },
                  Hook({ mount },
                        div({ style: `width: 60vw; ${column()}` })
                  ),
            ),
            Input({ send, message })
      )
}