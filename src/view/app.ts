import { Provider, Router, style, Theme } from "./lib/index.js";
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
      `)

      Provider.of(Router).mount();
}

App();