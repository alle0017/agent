import { Component, react, Reactive, row } from '../lib/index.js';
import { History } from '../components/history.js';
import { Chat } from '../components/chat.js';
const { div } = Component;
import { Chat as Model } from '../../lib/index.js';

export function HomePage() {
      const signal: Reactive<Model> = new Reactive(new Model);
      return div({ style: `width: 100vw; ${row('10%')}` },
            History({ open: chat => signal.value = chat }),
            react([signal], () => 
                  Chat({ chat: signal.value })
            )
      )
}