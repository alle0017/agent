import { ChatRepository } from '../../model/state/persitence.js';
import { column, Theme, Provider, Component, Pending, row } from '../lib/index.js';
import { ActionBar } from './action_bar.js';
import { icon, Icons } from './icons.js';

const { div, button } = Component;

export function History() {

      return div({ style: `align-self: start; width: 400px; height: 100vh; padding: 5px; padding-top: 30px; border-radius: 7px; border-right: 1px solid ${Provider.of(Theme).secondary}; ${column()}` },
            ActionBar({ size: 32 },
                  { icon: Icons.OpenLeftPanel, action: () => console.log('open!') },
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