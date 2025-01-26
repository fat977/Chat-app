
import { createContext, useContext, useState } from "react";

const Menu = createContext()
export const useMenuContext = ()=> useContext(Menu)
export default function MenuContext({children}){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <Menu.Provider value={{isOpen,setIsOpen}}>{children}</Menu.Provider>
    )
}