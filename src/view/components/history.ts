import { ChatRepository } from '../../model/state/persitence.js';
import { border, column, Theme, Provider, Component, Pending } from '../lib/index.js';

const { div } = Component;

export function History() {

      return div({ style: `align-self: start; width: 400px; height: 80vh;padding: 5px; background-color: ${Provider.of(Theme).primary}; border-radius: 7px; ${border(Provider.of(Theme).secondary)}; ${column()}` },
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