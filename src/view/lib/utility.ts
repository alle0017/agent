import { Reactive } from "./reactive.js";
import { Component } from "./component.js";
export function react(signals: Reactive<unknown>[], component: () => HTMLElement) {
      let el = component();
      function handler() {
            const replace = component();
            el.replaceWith(replace);
            el = replace;
      }

      for (const signal of signals) {
            signal.subscribe(handler);
      }
      return el;
}

export function style(css: string) {
      document.head.append(Component.style({}, css))
}
type BindElement = {
    value: string;
    element(): undefined | HTMLInputElement;
    binding: (el: HTMLElement) => HTMLElement;
}
export function bind(event: 'change' | 'input' = 'change'): BindElement {
      let element: undefined | HTMLInputElement = undefined;
      const obj =  {
            value: '',
            element: () => element,
            binding: (el: HTMLElement) => {
                  element = el as HTMLInputElement;
                  el.addEventListener(event, (e: Event) => {
                        obj.value = element!.value;
                  });
                  return el;
            }
      }
      return obj;
}
type Lifecycle = {
      mount?: (el: HTMLElement) => void;
}
export function Hook({ mount }: Lifecycle, child: HTMLElement) {
      mount?.(child)
      return child;
}