import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMenuContext } from "../context/MenuContext";
import "./chat.scss";
import {
  faCamera,
  faCircleInfo,
  faCopy,
  faEllipsisVertical,
  faFaceSmile,
  faImage,
  faMicrophone,
  faPaperPlane,
  faPhone,
  faShare,
  faTrash,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Form } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useOenChatContext } from "../context/OpenChatContext";
import { useWindowSizeContext } from "../context/WindowContext";
import { useDarkMode } from "../context/DarkModeContext";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import TransformTime from "../helpers/TransformTime";

export default function Chat() {
  const { isOpen, setIsOpen } = useMenuContext();
  const { isDarkMode } = useDarkMode();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const { isOpenChat } = useOenChatContext();
  const { windowSize } = useWindowSizeContext();

  const [chat, setChat] = useState();

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = new Date();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: !isDarkMode && "var(--primary-color)",
        display:
          windowSize < 1200
            ? isOpenChat && !isOpen
              ? "block "
              : "none"
            : "block",
        flex: windowSize < "1200" ? (isOpen ? "0" : "1") : "3",
      }}
      className="chat"
    >
      <div className="chat-header px-4 d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-3">
          <img
            src={require(`../assets/users/profile-user.jpg`)}
            width={"40px"}
            height={"40px"}
            alt="profile-user"
          />
          <div>
            <h5 className="mb-0">{user.username}</h5>
            <span className="fs-6">Active now</span>
          </div>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <FontAwesomeIcon icon={faPhone} cursor={"pointer"} />
          <FontAwesomeIcon icon={faVideo} cursor={"pointer"} />
          <FontAwesomeIcon
            icon={faCircleInfo}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            cursor={"pointer"}
          />
        </div>
      </div>
      <hr />
      <div className="messages mb-5 custom-scrollbar">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id
                ? "my-message d-flex flex-row-reverse p-3"
                : "user-message d-flex p-3"
            }
            key={message?.createdAt}
          >
            {message.senderId !== currentUser?.id && (
              <img
                src={require(`../assets/users/profile-user.jpg`)}
                alt="profile-user"
                width={"30px"}
                height={"30px"}
              />
            )}
            <div className="message mx-2">
              <p className="mb-0 border p-2 rounded">{message.text}</p>
              <span>
                {TransformTime(message.createdAt.toDate().toLocaleString())}
              </span>
            </div>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  href="#/action-1"
                  className="d-flex justify-content-between align-items-center"
                >
                  Copy <FontAwesomeIcon icon={faCopy} />
                </Dropdown.Item>
                <Dropdown.Item
                  href="#/action-2"
                  className="d-flex justify-content-between align-items-center"
                >
                  Forward <FontAwesomeIcon icon={faShare} />
                </Dropdown.Item>
                <Dropdown.Item
                  href="#/action-3"
                  className="d-flex justify-content-between align-items-center"
                >
                  Delete <FontAwesomeIcon icon={faTrash} />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>
      <div
        style={{ backgroundColor: !isDarkMode && "var(--primary-color)" }}
        className="send-message d-flex justify-content-around align-items-center border-top p-3 gap-3"
      >
        <div className="icons d-flex gap-3">
          <FontAwesomeIcon icon={faImage} />
          <FontAwesomeIcon icon={faCamera} />
          <FontAwesomeIcon icon={faMicrophone} />
        </div>
        <Form.Control
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isReceiverBlocked || isCurrentUserBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        />
        <div className="emoji">
          <FontAwesomeIcon
            icon={faFaceSmile}
            onClick={() => setOpen((prev) => !prev)}
            cursor={"pointer"}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="btn" onClick={handleSend}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
