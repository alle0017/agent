import { Component, BindElement, column } from '../lib/index.js';
import { ActionBar } from './action_bar.js';
import { Icons } from './icons.js';

const { div, input, button, textarea } = Component;


export function Input({ send, message }: { send: () => void, message: BindElement<HTMLElement> }) {
      return div({ style: `align-items: center; ${column()}` },
            message.binding(
                  div({ class: 'input', placeholder: 'insert a question here...', contenteditable: 'plaintext-only' })
            ),
            ActionBar({ size: 32 },
                  { action: send, icon: Icons.Clipboard },
                  { action: send, icon: Icons.Send }
            )
      )
}