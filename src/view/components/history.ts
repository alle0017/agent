import { ChatRepository } from '../../model/state/persitence.js';
import { column, Theme, Provider, Component, Pending, row } from '../lib/index.js';
import { icon, Icons } from './icons.js';

const { div, button } = Component;

export function History() {

      return div({ style: `align-self: start; width: 400px; height: 100vh; padding: 5px; padding-top: 30px; border-radius: 7px; border-right: 1px solid ${Provider.of(Theme).secondary}; ${column()}` },
            div({ style: row() },
                  button({ class: 'icon-btn' },
                        icon({ width: 32, height: 32 }, 
                              Icons.OpenLeftPanel
                        )
                  ),
                  button({ class: 'icon-btn' },
                        icon({ width: 32, height: 32 }, 
                              Icons.Add
                        )
                  ),
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