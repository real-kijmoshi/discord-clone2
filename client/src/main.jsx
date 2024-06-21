import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Home from './pages/Home';
import Layout from './components/Layout';
import Guild from './pages/Guild';

//socket
import io from 'socket.io-client';

console.log(import.meta.env.VITE_API_URL)
const socket = io(import.meta.env.VITE_GATEWAY_URL, {
  withCredentials: true,
  //auth
  auth: {
    token: localStorage.getItem("token")
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/channels/:guildID/:channelID",
    element: (
      <Layout />
    )
  },
  {
    path: "/channels/:guildID",
    element: (
      <Layout children={<Guild />} />
    )
  }
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
