import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const newSocket = io(import.meta.env.VITE_GATEWAY_URL, {
        withCredentials: true,
        auth: {
          token: localStorage.getItem("token")
        }
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
