import { bind, column, Component, Hook, ref, } from '../lib/index.js';
import { AnyMessage } from './message.js';
import { UserMessage, Chat as Model } from '../../lib/index.js';
import { ask } from '../../model/actors/oracle.js';
import { Input } from './input.js';
import { Loader } from './loader.js';

const { div, } = Component;


export function Chat({ chat }: { chat: Model }) {
      const message = bind({ event: 'input' });
      const container = ref<HTMLElement>();
      const loader = div({ style: 'align-self: start;' },
            Loader()
      );
      function mount(el: HTMLElement) {
            chat.on('append', e => {
                  if (loader.isConnected) {
                        loader.remove();
                  }
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
            container.value?.append(loader);
            await ask(chat);
      }
      document.addEventListener('keypress', e => {
            if (e.key.toLowerCase() == 'enter' && !e.shiftKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                  send().catch(console.error);
            }
      })
      return div({ style:  `width: 60vw; margin-top: 50px; ${column()}` },
            div({ style: `width: 60vw; height: 70vh; overflow-y: scroll;` },
                  Hook({ mount, ref: container },
                        div({ style: `width: 60vw; ${column()}` })
                  ),
            ),
            Input({ send, message })
      )
}