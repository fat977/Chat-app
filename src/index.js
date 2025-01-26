import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WindowContext from "./context/WindowContext";
import MenuContext from "./context/MenuContext";
import ChatContext from "./context/OpenChatContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import SearchContext from "./context/CloseSearch";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SearchContext>
      <DarkModeProvider>
        <WindowContext>
          <ChatContext>
            <MenuContext>
              <App />
            </MenuContext>
          </ChatContext>
        </WindowContext>
      </DarkModeProvider>
    </SearchContext>
  </React.StrictMode>
);
