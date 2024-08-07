import { useParams } from "react-router-dom";
import ChannelsSection from "../components/ChannelsSection";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "../utils/axios";
import Message from "../components/Message";
import { useSocket } from "../utils/socketContext";
import PropTypes from "prop-types";

function AtMeChannel() {
  return (
    <div>
      <h1>At Me Channel</h1>
    </div>
  );
}

function NormalChannel({ guildId, channelId }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const bottomRef = useRef(null);
  const socket = useSocket()
  const loading = useRef(false);

  const handleScroll = useCallback(() => {
    if (bottomRef.current.getBoundingClientRect().top < window.innerHeight) {
      setShowScrollToBottom(false);
    } else {
      setShowScrollToBottom(true);
    }
  }, []);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      const message = e.target[0].value;

      if (message.length === 0) return setError("Message cannot be empty");

      axios
        .post(
          `/channels/${channelId}/messages`,
          { content: message },
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        )
        .then(({ data }) => {
          setMessages((prevMessages) => [...prevMessages, data]);
          e.target[0].value = "";
          setError(null); // Clear any previous errors
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Error sending message");
        });
    },
    [channelId]
  );

  const fetchMessages = useCallback(async () => {
    let timer = null;
    try {
      loading.current = true;
      const response = await axios.get(`/channels/${channelId}/messages`, {
        headers: { authorization: localStorage.getItem("token") },
        params: {
          limit: 15,
          lastSnowflake: messages.length > 0 ? messages[0].snowflake : null,
        },
      });

      setMessages((prevMessages) => {
        const newMessages = response.data.reverse();
        const messageSet = new Set(prevMessages.map((m) => m.snowflake));
        const filteredMessages = newMessages.filter(
          (m) => !messageSet.has(m.snowflake)
        );
        return [...filteredMessages, ...prevMessages];
      });
      loading.current = false;
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error while fetching messages");
      loading.current = false;
      timer = setTimeout(fetchMessages, 1000);
      console.log("Retrying to fetch messages in 1 second");
    }

    return () => clearTimeout(timer);
  }, [channelId, messages]);

  useEffect(() => {
    fetchMessages();

    const handleMessage = (message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((m) => m.snowflake === message.snowflake)) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    };

    if(socket !== null) {      
      socket.emit("/listen", channelId);
      socket.on("message", handleMessage);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      if(socket !== null) {
        socket.off("message", handleMessage);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [channelId, fetchMessages, handleScroll, socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, [messages]);

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  return (
    <div className="flex flex-row h-full w-full">
      <ChannelsSection guildId={guildId} redirect={false} />
      <section className="flex flex-col w-full text-white justify-between">
        <div
          className="flex flex-col w-full h-full bg-gray-600 p-2 overflow-y-auto"
          onScroll={handleScroll}
          onClick={handleCloseContextMenu}
        >
          {messages.map((message) => (
            <div key={message.snowflake} className="flex flex-row w-full">
              <Message message={message} onRightClick={handleRightClick} />
            </div>
          ))}

          {messages.length === 0 && (
            Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="flex flex-row w-full">
                <div className="flex flex-row w-full items-center p-2 bg-gray-800 rounded-lg mb-2 m-2">
                  <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                  <div className="flex flex-col ml-2">
                    <div>
                      <span className="font-bold bg-gray-700 w-24 h-4 rounded-lg"></span>
                      <span className="text-gray-400 ml-2 bg-gray-700 w-16 h-4 rounded-lg mt-2"></span>
                    </div>
                    <span className="bg-gray-700 w-64 h-4 rounded-lg mt-2"></span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={sendMessage}
          className="flex flex-col w-full bg-gray-800 p-2 rounded-lg mt-2"
        >
          {error && (
            <span className="bg-red-500 p-0 rounded-t-lg text-center w-auto mr-20 ml-20">
              {error}
            </span>
          )}
          <div className="flex flex-row w-full justify-between items-center">
            <input
              type="text"
              className="w-full p-2 bg-gray-700 text-white"
              placeholder="Type a message..."
            />
            <button className="bg-blue-500 p-2 rounded-lg">Send</button>
          </div>
        </form>
      </section>
      {showScrollToBottom && (
        <button
          onClick={() =>
            bottomRef.current.scrollIntoView({ behavior: "smooth" })
          }
          className="fixed bottom-20 m-y-auto right-2 bg-blue-800 bg-opacity-80 p-2 rounded-lg"
        >
          <img
            src="https://icongr.am/feather/arrow-down.svg?size=24&color=ffffff"
            alt="scroll to bottom"
          />
        </button>
      )}

      {showContextMenu && (
        <div
          className="fixed bg-gray-800 p-2 rounded-lg"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          onClick={handleCloseContextMenu}
        >
          <button className="block text-white w-full text-left p-1">Copy</button>
          <button className="block text-white w-full text-left p-1">Report</button>
        </div>
      )}
    </div>
  );
}
NormalChannel.propTypes = {
  guildId: PropTypes.string.isRequired,
  channelId: PropTypes.string.isRequired,
};

function Channel() {
  const { guildID, channelID } = useParams();

  if (guildID === "@me") {
    return <AtMeChannel />;
  }

  return <NormalChannel guildId={guildID} channelId={channelID} />;
}

export default Channel;
