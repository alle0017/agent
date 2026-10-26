import { Component, row, BindElement } from '../lib/index.js';
import { icon, Icons } from './icons.js';

const { div, input, button } = Component;


export function Input({ send, message }: { send: () => void, message: BindElement }) {
      return div({ style: `align-items: center; ${row()}` },
            message.binding(
                  input({ placeholder: 'insert a question here...' })
            ),
            button({ class: 'icon-btn', click: send },
                  icon({ width: 64, height: 64 }, 
                        Icons.Clipboard
                  )
            ),
            button({ class: 'icon-btn', click: send },
                  icon({ width: 64, height: 64 }, 
                        Icons.Send
                  )
            )
      )
}