import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Home from './pages/Home';
import Layout from './components/Layout';
import Guild from './pages/Guild';
import Channel from './pages/Channel';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { SocketProvider } from './utils/socketContext'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/channels/:guildID/:channelID",
    element: (
      <Layout>
        <Channel />
      </Layout>
    )
  },
  {
    path: "/channels/:guildID",
    element: (
      <Layout>
        <Guild />
      </Layout>
    )
  },
  {
    path: "/auth",
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>,
);
