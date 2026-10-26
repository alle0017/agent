import { border, Provider, Router, style, Theme } from "./lib/index.js";
//import { GoogleAgent } from "../model/google/agent.js";
import { Chat } from "../lib/index.js";
import { HomePage } from "./pages/home.js";


export function App() {
      const chat = new Chat;
      Provider.set(Theme, new Theme);
      Provider.set(Router, new Router({
            '/': () => HomePage({ chat })
      }, '/'))

      style(/*css*/`
            body {
                  padding: 0px;
                  margin: 0px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: ${Provider.of(Theme).background};
                  overflow: hidden;
            }
            * {
                  font-size: 22px;
                  font-family: "Gill Sans", sans-serif;
                  background-color: #0000;
                  color: ${Provider.of(Theme).text};
            }
            .input:focus, .input:active {
                  outline: none;
            }
            .input {
                  width: calc(100% - 64px - 10px);
                  min-height: 64px;
                  max-height: 200px;
                  ${border(Provider.of(Theme).secondary)};
                  padding: 15px;
                  border-radius: 14px;
                  font-size: 18px;
                  background-color: ${Provider.of(Theme).primary};
                  overflow-y: scroll;
            }
            .icon-btn {
                  width: 32px;
                  height: 32px;
            }
            .icon-btn, .icon-btn-sm {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 7px;
                  border: none;
            }
            .icon-btn:hover, .icon-btn-sm:hover  {
                  background-color: ${Provider.of(Theme).primary};
            }
            .chat-history-item {
                  width: 80%;
                  height: 24px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  padding: 5px;
                  border-radius: 7px;
            }
            .chat-history-item:hover {
                  background-color: ${Provider.of(Theme).secondary};
            }
      `)

      Provider.of(Router).mount();
}

App();