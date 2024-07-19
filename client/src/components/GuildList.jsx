import { useEffect, useState } from "react";
import useGuilds from "../hooks/useGuilds";
import GuildItem from "./GuildItem";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import logo from "../assets/logo.svg";
import PropTypes from "prop-types";

function GuildList({ selectedGuild }) {
    const { guilds, loading } = useGuilds(localStorage.getItem("token"));
    const [showModal, setShowModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const joinGuild = async (e) => {
        e.preventDefault();
        const invite = e.target[0].value;

        if (invite.length === 0) return;


        console.log(invite);
        try {
            const response = await axios.post(`/invites/${invite}`, { }, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            location.href = `/channels/${response.data.guild}`;
          } catch (error) {
            console.error(error);
          }
    };


    useEffect(() => {
      document.body.style.overflow = showModal || showJoinModal || showCreateModal ? "hidden" : "auto";
    }, [showModal, showJoinModal, showCreateModal]);

    useEffect(() => {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setShowModal(false);
          setShowJoinModal(false);
          setShowCreateModal(false);
        }
      })

      return () => {
        document.removeEventListener("keydown", () => {});
      }
    }, []);

    useEffect(() => {
        if (!loading) {
            console.log(guilds);
        }
    }, [guilds, loading]);
  return (
    <div className="flex flex-col p-2 w-fit bg-gray-800 text-white h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb:active:bg-gray-600 justify-between">
      <div>
        <Link to="/channels/@me" className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition">
          <img src={logo} className="w-16 h-16 rounded-full" alt="discord logo" title="Discord" />
        </Link>
        <hr className="my-2" />
        {
          guilds.map((guild) => (
            <GuildItem key={guild.snowflake} guild={guild} selected={guild.snowflake === selectedGuild} />
          ))
        }
      </div>

      <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition justify-center" onClick={() => setShowModal(true)}>
        +
      </div>

      {
        showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <button className="absolute top-2 right-2" onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M3.646 3.646a.5.5 0 0 1 .708 0L8 7.293l3.646-3.647a.5.5 0 0 1 .708.708L8.707 8l3.647 3.646a.5.5 0 0 1-.708.708L8 8.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 8 3.646 4.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>

              <button 
                className="w-full p-2 bg-gray-700 text-white rounded-lg my-2 cursor-pointer transition hover:bg-gray-600"
                onClick={() => {
                  setShowJoinModal(true);
                  setShowModal(false);
                }}>
                Join a server
              </button>

              <button
                className="w-full p-2 bg-gray-700 text-white rounded-lg my-2 cursor-pointer transition hover:bg-gray-600"
                onClick={() => {
                  setShowCreateModal(true);
                  setShowModal(false);
                }}>
                Create a server
              </button>
            </div>
          </div>
        )
      }

      {
        showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form className="bg-gray-800 p-4 rounded-lg" onSubmit={joinGuild}>
              <input type="text" placeholder="Invite link" className="w-full p-2 bg-gray-700 text-white rounded-lg my-2" />
              <button className="w-full p-2 bg-gray-700 text-white rounded-lg my-2 cursor-pointer transition hover:bg-gray-600">
                Join
              </button>
            </form>
          </div>
        )
      }

      {
        showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <button className="absolute top-2 right-2" onClick={() => setShowCreateModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M3.646 3.646a.5.5 0 0 1 .708 0L8 7.293l3.646-3.647a.5.5 0 0 1 .708.708L8.707 8l3.647 3.646a.5.5 0 0 1-.708.708L8 8.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 8 3.646 4.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>

              <input type="text" placeholder="Server name" className="w-full p-2 bg-gray-700 text-white rounded-lg my-2" />
              <button className="w-full p-2 bg-gray-700 text-white rounded-lg my-2 cursor-pointer transition hover:bg-gray-600">
                Create
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
}
GuildList.propTypes = {
    selectedGuild: PropTypes.string,
};

export default GuildList;