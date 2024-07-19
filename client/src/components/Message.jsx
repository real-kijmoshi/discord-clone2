import { useEffect, useState } from "react";
import axios from "../utils/axios";
import parse from "../utils/snowflake";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";

dayjs.extend(relativeTime);

function Message({ message, onRightClick, currentUser }) {
  const [author, setAuthor] = useState(null);
  const [messageInfo, setMassageInfo] = useState(null);
  const [date, setDate] = useState(" ");

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

  useEffect(() => {
    setMassageInfo(parse(message.snowflake));
  }, [message.snowflake]);

  useEffect(() => {
    if(messageInfo?.timestamp != null) {
      setDate(dayjs.default(messageInfo.timestamp).fromNow(true));
    }
  }, [messageInfo]);

  if (!author) {
    return null;
  }

  return (
    <div
      className="flex flex-row w-full items-center p-2 bg-gray-800 rounded-lg mb-2 m-2"
      onContextMenu={(e) => onRightClick(e, author.id === currentUser)}
    >
      <img
        src={`${import.meta.env.VITE_CDN_URL}/icon/${author.avatar}`}
        className="w-12 h-12 rounded-full"
        alt="author avatar"
        title={author.username}
      />
      <div className="flex flex-col ml-2">
        <div>
          <span className="font-bold">{author.username}</span>
          <span className="text-gray-400 ml-2">{date}</span>
        </div>
        <span>{message.content}</span>
      </div>
    </div>
  );
}
Message.propTypes = {
  message: PropTypes.object.isRequired,
  onRightClick: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Message;
