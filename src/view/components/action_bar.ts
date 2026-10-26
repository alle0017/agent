import { Component, row } from '../lib/index.js';
import { icon, } from './icons.js';

const { div, button } = Component;

type ActionBarArgs = {
      copy: () => void,
      retry: () => void,
}
export type Action = {
      icon: string,
      action: () => void
}
export function ActionBar(...actions: Action[]) {
      return div({ style: `align-self: start; ${row('5px')}` },
            ...actions
            .filter(act => act.action !== undefined)
            .map(act => 
                  button({ class: 'icon-btn-sm', click: () => act.action!() },
                        icon({ width: 24, height: 24 }, 
                              act.icon
                        )
                  )
            )
      )
}