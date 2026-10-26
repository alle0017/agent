import { Component, Provider, style, Theme } from '../lib/index.js';

const { span } = Component;


export function Loader() {
      style(/*css*/`
            .loader {
                  --color-1: ${Provider.of(Theme).accentPrimary};
                  --color-2: ${Provider.of(Theme).accentSecondary};
                  --size: 0.3px;

                  width: calc(48 * var(--size));
                  height: calc(48 * var(--size));
                  display: block;
                  margin: calc(15 * var(--size)) auto;
                  position: relative;
                  color: var(--color-1);
                  box-sizing: border-box;
                  animation: rotation 1s linear infinite;
            }
            .loader::after,
            .loader::before {
                  content: '';
                  box-sizing: border-box;
                  position: absolute;
                  width: calc(24 * var(--size));
                  height: calc(24 * var(--size));
                  top: 0;
                  background-color: var(--color-1);
                  border-radius: 50%;
                  animation: scale50 1s infinite ease-in-out;
            }
            .loader::before {
                  top: auto;
                  bottom: 0;
                  background-color: var(--color-2);
                  animation-delay: 0.5s;
            }

            @keyframes rotation {
                  0% {
                        transform: rotate(0deg);
                  }
                  100% {
                        transform: rotate(360deg);
                  }
            }
            @keyframes scale50 {
                  0%,
                  100% {
                        transform: scale(0);
                  }
                  50% {
                        transform: scale(1);
                  }
            }

    
      `);
      return span({ class: 'loader' });
}