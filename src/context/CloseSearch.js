import { createContext, useContext, useState } from "react";

const Search = createContext()
export const useSearchContext = ()=> useContext(Search)
export default function SearchContext({children}){
    const [addMode, setAddMode] = useState(false);

    return(
        <Search.Provider value={{addMode,setAddMode}}>{children}</Search.Provider>
    )
}