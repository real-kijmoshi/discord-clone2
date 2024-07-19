import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useState } from "react";

function GuildInfo() {
  const { guildID } = useParams();
  const [code, setCode] = useState(null);
  const token = localStorage.getItem("token");

  const handleCreateInvie = async () => {
    try {
        const response = await axios.post(`/guilds/${guildID}/invites`, {}, {
            headers: {
                Authorization: `${token}`,
            },
        });

        setCode(response.data.code);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
        <button className="bg-blue-500 p-4 rounded-lg text-white font-bold text-xl" onClick={handleCreateInvie}>
            Create Invie 
        </button>

        {
            code && (
                <div className="bg-gray-800 p-4 rounded-lg text-white mt-4">
                    <h1 className="text-2xl font-bold">Invie Code</h1>
                    <p className="text-3xl font-bold">{code}</p>
                </div>
            )
        }
    </div>
  );
}

export default GuildInfo;