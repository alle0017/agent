import { Chat } from "../../lib/index.js";
import { key, table, Entity, schema, Datasource, Repository } from "../../store/index.js";

@key('name')
@table('chats')
export class ChatModel extends Entity {
      constructor(
            public name: string = '',
            public chat: Chat,
      ) {
            super()
      }
}


@schema('agent', 1, { ChatModel })
class Database extends Datasource {}

export class ChatRepository extends Repository<ChatModel> {
      constructor() {
            super(new Database, ChatModel)
      }
}
