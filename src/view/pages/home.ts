import { Component, row } from '../lib/index.js';
import { History } from '../components/history.js';
import { Chat } from '../components/chat.js';
const { div } = Component;
import { Chat as Model } from '../../lib/index.js';

export function HomePage({ chat }: { chat: Model }) {
      return div({ style: `width: 100vw; ${row('10%')}` },
            History(),
            Chat({ chat })
      )
}