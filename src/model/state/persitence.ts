import { deserialize, GoogleAiMessage, GoogleSerializable } from "../../lib/google/messages.js";
import { Chat, ChatArgs } from "../../lib/index.js";
import { key, table, Entity, schema, Datasource, Repository } from "../../store/index.js";

@key('name')
@table('chats')
export class ChatModel extends Entity {
      public readonly messages: GoogleSerializable[];
      public readonly config: Partial<ChatArgs>
      public readonly id: string;
      public readonly date = new Date().toTemporalInstant().epochMilliseconds
      
      constructor(
            public name: string = '',
            chat: Chat,
      ) {
            super()
            this.id = chat.id;
            this.config = chat.config;
            this.messages = chat.messages.map(message => GoogleAiMessage.fromMessage(message).toJSON())
      }
}

export function fromChatModel(model: ChatModel) {
      const chat = new Chat(model.id, model.config)
      chat.messages.push(...model.messages.map(deserialize))
      return chat;
}

@schema('agent', 1, { ChatModel })
class Database extends Datasource {}

export class ChatRepository extends Repository<ChatModel> {
      constructor() {
            super(new Database, ChatModel)
      }
}
