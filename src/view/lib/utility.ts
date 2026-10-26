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
export type BindElement<T extends HTMLElement> = {
    value: string;
    element(): undefined | T;
    binding: (el: HTMLElement) => HTMLElement;
}
export type BindArgs<T extends HTMLElement> = {
      event: 'change' | 'input',
      value: (el: T) => string
}
export const defaultValue = (el: HTMLElement) => el.innerText;
export function bind<T extends HTMLElement>({ event = 'change', value = defaultValue  }: Partial<BindArgs<T>>): BindElement<T> {
      let element: undefined | T = undefined;
      const obj =  {
            value: '',
            element: () => element,
            binding: (el: HTMLElement) => {
                  element = el as T;
                  el.addEventListener(event, (e: Event) => {
                        obj.value = value(element!);
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

export function If(condition: boolean, component: () => HTMLElement | string) {
      return condition ? component(): '';
}

type PendingArgs<T> = {
      resolve: (value: T) => HTMLElement
      reject: (value: Error) => HTMLElement
      pending: () => HTMLElement
}

export function Pending<T>(promise: Promise<T>, { resolve, reject, pending }: PendingArgs<T>) {
      const signal: Reactive<HTMLElement> = new Reactive(pending());

      promise.then((v) => signal.value = resolve(v)).catch((e) => signal.value = reject(e))
      return react([signal],
            () => signal.value
      )
}