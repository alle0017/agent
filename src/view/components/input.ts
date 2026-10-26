import { Component, row, BindElement, column } from '../lib/index.js';
import { icon, Icons } from './icons.js';

const { div, input, button } = Component;


export function Input({ send, message }: { send: () => void, message: BindElement }) {
      return div({ style: `align-items: center; ${column()}` },
            message.binding(
                  input({ placeholder: 'insert a question here...' })
            ),
            div({ style: row() },
                  button({ class: 'icon-btn', click: send },
                        icon({ width: 32, height: 32 }, 
                              Icons.Clipboard
                        )
                  ),
                  button({ class: 'icon-btn', click: send },
                        icon({ width: 32, height: 32 }, 
                              Icons.Send
                        )
                  )
            )
      )
}