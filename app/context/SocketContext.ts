import React, { createContext, useContext } from 'react';

// Create Socket Context and Provider component.

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
   // Socket state and methods here.

   return (
       <SocketContext.Provider value={{ /* socket state and methods */ }}>
           {children}
       </SocketContext.Provider>
   );
};

export const useSocket = () => useContext(SocketContext);
