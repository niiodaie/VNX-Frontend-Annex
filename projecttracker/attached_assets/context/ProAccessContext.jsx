import React, { createContext, useContext } from 'react';

export const ProAccessContext = createContext({ isPro: true });

export const ProAccessProvider = ({ children }) => {
  const userHasPro = true; // Replace with real auth logic
  return (
    <ProAccessContext.Provider value={{ isPro: userHasPro }}>
      {children}
    </ProAccessContext.Provider>
  );
};
