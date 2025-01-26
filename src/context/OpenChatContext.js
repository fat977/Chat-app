
import { createContext, useContext, useState } from "react";

const Chat = createContext()
export const useOenChatContext = ()=> useContext(Chat)
export default function ChatContext({children}){
    const [isOpenChat,setIsOpenChat] = useState(false)
    return(
        <Chat.Provider value={{isOpenChat,setIsOpenChat}}>{children}</Chat.Provider>
    )
}