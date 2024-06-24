import { useEffect, useState } from "react";
import axios from "../utils/axios";

function Message({ message, onRightClick, currentUser }) {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    axios.get(`/users/${message.author}`, {
      headers: {
        authorization: localStorage.getItem("token"),
      }
    })
      .then(({ data }) => {
        setAuthor(data);
      });
  }, [message.author]);

  if (!author) {
    return null;
  }

  return (
    <div
      className="flex flex-row w-full items-center p-2 bg-gray-800 rounded-lg mb-2 cursor-pointer transition hover:bg-gray-700 m-2"
      onContextMenu={(e) => onRightClick(e, author.id === currentUser)}
    >
      <img
        src={`${import.meta.env.VITE_CDN_URL}/icon/${author.avatar}`}
        className="w-12 h-12 rounded-full"
        alt="author avatar"
        title={author.username}
      />
      <div className="flex flex-col ml-2">
        <span className="font-bold">{author.username}</span>
        <span>{message.content}</span>
      </div>
    </div>
  );
}

export default Message;
