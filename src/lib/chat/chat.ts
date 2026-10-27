import { Event, EventDispatcher } from "../event.js";
import { Class } from "../workflow.js";
import { Optional } from "../workflow/list.js";
import { Message, } from "./message.js";

type ChatEventTypes = 'append' | 'beforeappend';
export type ChatArgs = {
      temperature: number,
      agent: string,
      environment?: 'remote',
      maxSteps?: number
}

export class ChatEvent extends Event {
      constructor(public readonly message: Message, public readonly chat: Chat) {
            super();
      }
}

export class Chat {
      private readonly dispatcher: EventDispatcher<ChatEvent, ChatEventTypes> = new EventDispatcher();
      public readonly messages: Message[] = [];

      constructor(
            public readonly id: string = crypto.randomUUID(),
            public readonly config: Partial<ChatArgs> = {}
      ) { 
      }

      public firstOf<T extends Message>(type: Class<T>): Optional<T> {
            for (const message of this.messages) {
                  if (Object.getPrototypeOf(message).constructor == type) {
                        return Optional.of(message as T);
                  }
            }
            return Optional.none();
      }
      public latest() {
            return this.messages.at(-1);
      }

      public append(message: Message) {
            this.dispatcher.dispatch('beforeappend', new ChatEvent(message, this));
            this.messages.push(message);
            this.dispatcher.dispatch('append', new ChatEvent(message, this));
            return this;
      }

      public fork(to: Message) {
            const chat = new Chat(this.id, this.config);

            for (const message of this.messages) {
                  chat.append(message);
                  if (message == to) {
                        return chat;
                  }
            }
            return chat;
      }

      public on(event: ChatEventTypes, listener: (e: ChatEvent) => void) {
            this.dispatcher.on(event, listener);
            return this;
      }
}