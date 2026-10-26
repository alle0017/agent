import { ChatRepository } from '../../model/state/persitence.js';
import { column, Theme, Provider, Component, Pending, style } from '../lib/index.js';
import { ActionBar } from './action_bar.js';
import { Icons } from './icons.js';

const { div, button } = Component;

export function History() {
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

      return div({ style: `align-self: start; width: 400px; height: 100vh; padding: 5px; padding-top: 30px; border-radius: 7px; border-right: 1px solid ${Provider.of(Theme).secondary}; ${column()}` },
            ActionBar({ size: 32 },
                  { icon: Icons.OpenLeftPanel, action: () => console.log('open!') },
                  { icon: Icons.Search, action: () => console.log('search!') },
                  { icon: Icons.Add, action: () => console.log('new!') },
            ),
            Pending(new ChatRepository().keys(),
                  {
                        pending: () => div({}),
                        resolve: (keys) =>
                              div({ class: 'chat-history-item' },
                                    ...keys.map(v => v.toString())
                              ),
                        reject: (error) => div({}, error.message)
                  }
            )
      )
}