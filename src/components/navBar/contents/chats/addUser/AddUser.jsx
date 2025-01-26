

import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../../../../lib/userStore";
import "./addUser.scss";
import { useState } from "react";
import { db } from "../../../../../lib/firebase";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSearchContext } from "../../../../../context/CloseSearch";
const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  const {setAddMode} = useSearchContext()
  
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userChats");
  
    try {
      setAddMode(false)
      // Helper function to check if a chat exists
      const chatExists = async (userId, receiverId) => {
        const userChatDoc = await getDoc(doc(userChatRef, userId));
        if (userChatDoc.exists()) {
          const userChats = userChatDoc.data().chats || [];
          return userChats.some((chat) => chat.receiverId === receiverId);
        }
        return false;
      };
  
      // Check if chat already exists for both users
      const existsForUser = await chatExists(user.id, currentUser.id);
      const existsForCurrentUser = await chatExists(currentUser.id, user.id);
  
      if (existsForUser || existsForCurrentUser) {
        toast.warn("Chat already exists.");
        return; // Exit if chat exists
      }
  
      // Create a new chat
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      const chatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        updatedAt: new Date(),
      };
  
      // Helper function to update userChats
      const updateUserChats = async (userId, receiverId) => {
        await updateDoc(doc(userChatRef, userId), {
          chats: arrayUnion({ ...chatData, receiverId }),
        });
      };
  
      // Update both users' chat references
      await Promise.all([
        updateUserChats(user.id, currentUser.id),
        updateUserChats(currentUser.id, user.id),
      ]);
    } catch (err) {
      console.error("Error adding chat:", err);
    }
   
  };
  
  return (
    <div className="addUser">
      <Form action="" onSubmit={handleSearch}>
        <Form.Control type="text" name="username" placeholder="Username" />
        <Button type="submit">Search</Button>
      </Form>
      {user && (
        <div className="user d-flex justify-content-between align-items-center">
          <div className="detail d-flex align-items-center gap-2">
            <img src={require(`../../../../../assets/users/user.jpeg`)} alt="" />
            <span>{user.username}</span>
          </div>
          <Button variant="primary" onClick={handleAdd}>Add User</Button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
