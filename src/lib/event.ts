export class Event {
      private active = true;
      public preventDefault() {
            this.active = false;
      }
      public isActive() {
            return this.active;
      }
}

export class EventDispatcher<T extends Event = Event, K extends string = string> {

      private readonly listeners: Map<K, Set<(e: T) => void>> = new Map;
      private readonly defaults: Map<K, (e: T) => void> = new Map;

      public default(key: K, listener: (e: T) => void) {
            this.defaults.set(key, listener);
            return this;
      }
      public on(key: K, listener: (e: T) => void) {
            if (!this.listeners.has(key)) {
                  this.listeners.set(key, new Set);
            }
            this.listeners.get(key)?.add(listener);
            return this;
      }
      public dispatch(key: K, event: T) {
            if (this.listeners.has(key)) {
                  for (const listener of this.listeners.get(key)!) {
                        listener(event);
                  }
            }
            if (event.isActive()) {
                  this.defaults.get(key)?.(event);
            }
            return this;
      }
}