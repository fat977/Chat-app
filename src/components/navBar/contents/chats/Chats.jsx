import { Form, InputGroup } from "react-bootstrap";
import "./chats.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useOenChatContext } from "../../../../context/OpenChatContext";
import { useWindowSizeContext } from "../../../../context/WindowContext";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import { useChatStore } from "../../../../lib/chatStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import AddUser from "./addUser/AddUser";
import { useSearchContext } from "../../../../context/CloseSearch";
import TransformTime from "../../../../helpers/TransformTime";
export default function Chats() {
  const { isOpenChat,setIsOpenChat } = useOenChatContext();
  const { windowSize } = useWindowSizeContext();

  const handleOpenChat = () => {
    setIsOpenChat((prevState) => !prevState); // Correct way to toggle
  };

  const {addMode, setAddMode} = useSearchContext()
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  console.log(chats)
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userChats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );
  return (
    <div
      className="chats"
      style={{
        display: isOpenChat
          ? windowSize < "1200"
            ? "none"
            : "block"
          : "block",
      }}
    >
      <h3 className="p-3">Chats</h3>
      <div className="search mx-3 my-2">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search users"
            aria-describedby="basic-addon1"
            onChange={(e) => setInput(e.target.value)}
          />
          <InputGroup.Text id="basic-addon1">
            <FontAwesomeIcon
              icon={addMode ? faMinus : faPlus}
              cursor={"pointer"}
              onClick={()=>setAddMode(prev=>!prev)}
            />
          </InputGroup.Text>
        </InputGroup>
      </div>
      <div className="chat-users">
        <h5 className="p-3">Recent</h5>
        <div className="users custom-scrollbar px-2 my-2">
          {filteredChats?.map((chat) => (
            <div
              className="user-details border rounded px-3 py-2 mb-3"
              key={chat.chatId}
              onClick={() => {handleSelect(chat);handleOpenChat()}}
              style={{ backgroundColor: chat?.isSeen ? "transparent" : "#7435DD" }}

            >
              <div className="d-flex justify-content-between">
                <div className="d-flex  align-items-center gap-3">
                  <img
                    src={require(`../../../../assets/users/user.jpeg`)}
                    width={"50px"}
                    height={"50px"}
                    alt="user"
                  />
                  <div>
                    <h6>
                      {chat.user.blocked.includes(currentUser.id)
                        ? "User"
                        : chat.user.username}
                    </h6>
                    <p className="mb-0">{chat.lastMessage}</p>
                  </div>
                </div>
                <span>{TransformTime(chat.updatedAt.toDate().toLocaleString())}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {addMode && <AddUser />}
    </div>
  );
}
