"use client";

import React, { createContext, useState } from "react";

const FixContext = createContext();

const FixContextProvider = ({ children }) => {
  const [activeFix, setActiveFix] = useState(false); 
  const [totalPrice, settotalPrice] = useState(false); 
  const [rememberLocation, setRememberLocation] = useState(false);

  return (
    <FixContext.Provider
      value={{
        activeFix,setActiveFix,
        rememberLocation,setRememberLocation,
        totalPrice,settotalPrice,
      }}
    >
      {children}
    </FixContext.Provider>
  );
};

export { FixContext, FixContextProvider };
