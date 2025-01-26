import { createContext, useContext, useEffect, useState } from "react";

 const WindowSize = createContext(null)

 export const useWindowSizeContext = () => useContext(WindowSize)

export default function WindowContext({ children }) {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(()=>{
    function widthSize(){
        setWindowSize(window.innerWidth)
    }
    window.addEventListener('resize',widthSize)

    return ()=>{window.removeEventListener('resize',widthSize)}
  },[])
  return (
    <WindowSize.Provider value={{ windowSize, setWindowSize }}>
      {children}
    </WindowSize.Provider>
  );
}
