import { Chat } from "./components/chat.js";
import { Provider, Router, style, Theme } from "./lib/index.js";
//import { GoogleAgent } from "../model/google/agent.js";
import { TestAgent, Chat as Model } from "../lib/index.js";


export function App() {
      const chat = new Model;
      const agent = new TestAgent
      Provider.set(Theme, new Theme);
      Provider.set(Router, new Router({
            '/': () => Chat({ chat, agent })
      }, '/'))

      style(/*css*/`
            body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: ${Provider.of(Theme).background};
            }
            * {
                  background-color: #0000;
                  color: ${Provider.of(Theme).text};
            }
            input:focus, input:active {
                  outline: none;
            }
            input {
                  width: calc(100% - 64px - 10px);
                  height: 64px;
                  border: none;
                  padding: 0px;
                  padding-left: 15px;
                  border-radius: 32px;
                  font-size: 18px;
                  background-color: ${Provider.of(Theme).primary};
            }
            .icon-btn {
                  width: 64px;
                  height: 64px;
            }
            .icon-btn, .icon-btn-sm {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 7px;
                  border: none;
            }
            .icon-btn:hover {
                  background-color: ${Provider.of(Theme).primary};
            }
            .icon-btn-sm:hover {
                  color: ${Provider.of(Theme).accentPrimary};
            }
      `)

      Provider.of(Router).mount();
}

App();