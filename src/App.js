import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import Chat from "./chat/Chat";
import ReceiverInfo from "./chat/receiverInfo/ReceiverInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "./styles/dark-mode.scss";
import Auth from "./auth/Auth";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import Notifications from "./components/notifications/Notifications";
function App() {
  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  const{chatId} =useChatStore()
  useEffect(()=>{
    const unSub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid)
    })
    return ()=> {
      unSub()
    }
  },[fetchUserInfo])

  if(isLoading) return <div className="loading">Loading...</div>
  return (
    <>
      {currentUser ? (
        <div className="d-flex">
        <Router>
          {/* <MyNavbar /> */}
          <NavBar />
          {chatId && <Chat />}
          {chatId && <ReceiverInfo />}
        </Router>
        </div>
      ) : (
        <Auth />
      )}
      <Notifications />
    </>
  );
}

export default App;
