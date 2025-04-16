"use client";

import React, { createContext, useEffect, useState } from "react";

const JsonContext = createContext();

const JsonContextProvider = ({ children }) => {
  const [silverMode, setSilverMode] = useState(false);
  const [currency, setCurrency ] = useState('amd');
  const [activeLg, setActiveLg] = useState("en-Us"); 
  const [activeFix, setActiveFix] = useState(false); 
  const [totalPrice, settotalPrice] = useState(false); 

  useEffect(() => {
    
    if (silverMode) {
      document.body.classList.add("silverMode");
    } else {
      document.body.classList.remove("silverMode");
    }

    return () => {
      document.body.classList.remove("silverMode");
    };
  }, [silverMode , activeLg]);

  return (
    <JsonContext.Provider
      value={{
        silverMode, setSilverMode,
        activeFix,setActiveFix,
        currency, setCurrency,
        totalPrice,settotalPrice,
        activeLg , setActiveLg
      }}
    >
      {children}
    </JsonContext.Provider>
  );
};

export { JsonContext, JsonContextProvider };
