import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMenuContext } from "../../context/MenuContext";
import {
  faBan,
  faBellSlash,
  faBoxesPacking,
  faCircleDot,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./receiverInfo.scss";
import { useWindowSizeContext } from "../../context/WindowContext";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
export default function ReceiverInfo() {
  const { isOpen, setIsOpen } = useMenuContext();
  const { windowSize } = useWindowSizeContext();

  const {user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
  useChatStore();
const { currentUser } = useUserStore();

const handleBlock = async() => {
  if(!user) return;
  const userDocRef = doc(db,"users",currentUser.id)
  try{
    await updateDoc(userDocRef,{
      blocked : isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
    })
    changeBlock()
  }catch(err){
    console.log(err)
  }
};

  return (
    <>
      {isOpen && (
        <div
          className="receiver"
          style={{
            display: isOpen ? "block" : "none",
            flex: windowSize < "1200" ? "5" : "2",
          }}
        >
          <div className="receiver-header p-4">
            <div className="text-end">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setIsOpen(!isOpen)}
                cursor={'pointer'}
              />
            </div>
            <div className="user-profile d-flex flex-column position-absolute">
              <h6>{user.username}</h6>
              <span>
                <FontAwesomeIcon icon={faCircleDot} /> Online
              </span>
            </div>
          </div>
          <hr />
          <div className="status p-3">
            <p>Status:</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
              autem aut sunt as
            </p>
          </div>
          <hr />
          <div className="actions custom-scrollbar d-flex flex-column gap-3 justify-content-start p-3">
            <span>
              <FontAwesomeIcon icon={faBellSlash} /> Mute
            </span>
            <span>
              <FontAwesomeIcon icon={faBoxesPacking} /> Archive
            </span>
            <span>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </span>
            <span>
              <FontAwesomeIcon icon={faBan} onClick={handleBlock} /> {isCurrentUserBlocked ? 'You are blocked' : isReceiverBlocked ?'User blocked' : 'Block User'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
