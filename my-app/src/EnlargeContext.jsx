import React, { createContext, useContext, useState } from 'react';

// keeps track of whether the user wants the application enlarged

export const EnlargeContext = createContext();

export const EnlargeProvider = ({ children }) => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  return (
    <EnlargeContext.Provider value={{ isEnlarged, setIsEnlarged }}>
      {children}
    </EnlargeContext.Provider>
  );
};

export const useEnlarge = () => useContext(EnlargeContext);
