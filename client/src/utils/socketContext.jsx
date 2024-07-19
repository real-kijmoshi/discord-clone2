import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

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
      
      newSocket.once("connect", () => {
        console.log("Connected to gateway");
      });

      newSocket.on("error", (error) => {
        console.error("Connection error:", error);
      })

      return () => newSocket.close();

    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};
