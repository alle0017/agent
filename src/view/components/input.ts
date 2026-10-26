import { Component, BindElement, row, border, Provider, Theme, style } from '../lib/index.js';
import { ActionBar } from './action_bar.js';
import { icon, Icons } from './icons.js';

const { div, button } = Component;


export function Input({ send, message }: { send: () => void, message: BindElement<HTMLElement> }) {
      style(/*css*/`
            .input:focus, .input:active {
                  outline: none;
            }
            .input {
                  width: 100%; 
                  min-height: 32px; 
                  max-height: 200px;
                  padding: 15px;  
                  overflow-y: scroll;
                  padding-top: 5px;
            }      
      `);
      return div({ style: `width: calc(100% - 64px - 10px); ${border(Provider.of(Theme).secondary)}; padding: 15px; border-radius: 14px; background-color: ${Provider.of(Theme).primary}; align-items: end; ${row()}` },
            button({ class: 'icon-btn-sm' },
                  icon({ width: 32, height: 32 },
                        Icons.Clip
                  )
            ),
            message.binding(
                  div({ class: 'input', contenteditable: 'plaintext-only' })
            ),
            ActionBar({ size: 32, style: '' },
                  { action: send, icon: Icons.Brain },
                  { action: send, icon: Icons.Send },
            )
      )
}