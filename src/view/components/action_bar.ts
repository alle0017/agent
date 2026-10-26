import { Component, row } from '../lib/index.js';
import { icon, } from './icons.js';

const { div, button } = Component;

type ActionBarArgs = {
      size: number,
      style: string
}
export type Action = {
      icon: string,
      action: () => void
}
export function ActionBar({ size = 24, style = 'align-self: start;' }: Partial<ActionBarArgs>, ...actions: Action[]) {
      return div({ style: `${style}; ${row('5px')}` },
            ...actions
            .filter(act => act.action !== undefined)
            .map(act => 
                  button({ class: 'icon-btn-sm', click: () => act.action!() },
                        icon({ width: size, height: size }, 
                              act.icon
                        )
                  )
            )
      )
}