import { ChatModel, ChatRepository, fromChatModel } from '../../model/state/persitence.js';
import { column, Theme, Provider, Component, Pending, style } from '../lib/index.js';
import { ActionBar } from './action_bar.js';
import { Icons } from './icons.js';
import { Chat } from '../../lib/index.js';
const { div } = Component;

export function History({ open }: { open: (chat: Chat) => void }) {
      style(/*css*/`
            .chat-history-item {
                  width: 80%;
                  height: 24px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  padding: 5px;
                  border-radius: 7px;
            }
            .chat-history-item:hover {
                  background-color: ${Provider.of(Theme).secondary};
            }
      `);
      function click(model: ChatModel) {
            open(fromChatModel(model))
      }

      return div({ style: `align-self: start; width: 400px; height: 100vh; padding: 5px; padding-top: 30px; border-radius: 7px; border-right: 1px solid ${Provider.of(Theme).secondary}; ${column()}` },
            ActionBar({ size: 32 },
                  { icon: Icons.OpenLeftPanel, action: () => console.log('open!') },
                  { icon: Icons.Search, action: () => console.log('search!') },
                  { icon: Icons.Add, action: () => open(new Chat) },
            ),
            Pending(new ChatRepository().getAll(),
                  {
                        pending: () => div({}),
                        resolve: (keys) =>
                              div({ style: column() },
                                    ...keys.toSorted((a, b) => b.date - a.date).map(v => 
                                          div({ class: 'chat-history-item', click: () => click(v) },
                                                v.name
                                          ),
                                    )
                              ),
                        reject: (error) => div({}, error.message)
                  }
            )
      )
}