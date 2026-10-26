import { bind, column, Component, Hook, } from '../lib/index.js';
import { AnyMessage } from './message.js';
import { UserMessage, Chat as Model } from '../../lib/index.js';
import { ask } from '../../model/actors/oracle.js';
import { Input } from './input.js';

const { div, } = Component;


export function Chat({ chat }: { chat: Model }) {
      const message = bind({ event: 'input' });
      function mount(el: HTMLElement) {
            chat.on('append', e => {
                  const message = AnyMessage({ message: e.message });
                  el.append(message);
                  message.scrollIntoView({ block: 'end' });
            })
      }
      async function send() {
            if (!message.value.match(/\w/ig)) {
                  return;
            }
            chat.append(new UserMessage(message.value));
            message.element()!.innerText = '';
            message.value = '';
            await ask(chat);
      }
      document.addEventListener('keypress', e => {
            if (e.key.toLowerCase() == 'enter' && !e.shiftKey && !e.metaKey && !e.altKey && document.activeElement != message.element()) {
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