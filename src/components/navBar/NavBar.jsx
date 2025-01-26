import "./navBar.scss";
import { useEffect, useState } from "react";
import Chats from "./contents/chats/Chats";
import Profile from "./contents/profile/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import {
  faGear,
  faMoon,
  faRightFromBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import Settings from "./contents/settings/Settings";
import { useWindowSizeContext } from "../../context/WindowContext";
import { useOenChatContext } from "../../context/OpenChatContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { useMenuContext } from "../../context/MenuContext";
import { auth } from "../../lib/firebase";
export default function NavBar() {
  const [currentPage, setCurrentPage] = useState("chats");
  const renderPage = () => {
    switch (currentPage) {
      case "chats":
        return <Chats />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Chats />;
    }
  };
  const { windowSize } = useWindowSizeContext();
  const { isOpenChat,setIsOpenChat } = useOenChatContext();
  const {  setIsOpen } = useMenuContext();

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div
      className='navbar d-flex justify-content-start align-items-start py-0'
      style={{
        flex: windowSize < "1200" ? (isOpenChat ? "" : "1") : "2",
      }}
      
    >
      <div className="navbar-links d-flex gap-3 gap-sm-1 gap-lg-5 flex-column p-4 ">
        <img
          src={require(`../../assets/logo/chat.png`)}
          width={"30px"}
          height={"30px"}
          alt="logo"
        />
        <FontAwesomeIcon
          icon={faUser}
          size="lg"
          cursor={"pointer"}
          className={`icon ${currentPage === "profile" ? "active" : ""}`}
          onClick={() => {setCurrentPage("profile");setIsOpen(false);setIsOpenChat(false)}}
        />

        <FontAwesomeIcon
          icon={faRocketchat}
          size="lg"
          cursor={"pointer"}
          className={`icon ${currentPage === "chats" ? "active" : ""}`}
          onClick={() => setCurrentPage("chats")}
        />

        <FontAwesomeIcon
          icon={faGear}
          size="lg"
          cursor={"pointer"}
          className={`icon ${currentPage === "settings" ? "active" : ""}`}
          onClick={() => {setCurrentPage("settings");setIsOpen(false);setIsOpenChat(false)}}
        />
        <FontAwesomeIcon
         onClick={toggleDarkMode}
         icon={isDarkMode ? faSun : faMoon}
          size="lg"
          cursor={"pointer"}
        />
        <FontAwesomeIcon
          onClick={() => auth.signOut()}
          icon={faRightFromBracket}
          size="lg"
          cursor={"pointer"}
        />
      </div>
      <div className="navbar-content">{renderPage()}</div>
    </div>
  );
}
