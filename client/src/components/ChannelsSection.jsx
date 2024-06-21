import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import ChannelList from "./ChannelList";
import IconFromName from "./IconFromName";

function ChannelsSection({ guildId, redirect}) {
    const [guildInfo, setGuildInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/guilds/${guildId}`, {
            headers: {
                authorization: localStorage.getItem("token"),
            }
        })
            .then(({ data }) => {
                setGuildInfo(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [guildId]);

    useEffect(() => {
        if (redirect && !loading && guildInfo && guildInfo.channels.length > 0) {
            console.log(`Redirecting to /channels/${guildId}/${guildInfo.channels[0].snowflake}`); // Debugging log
            navigate(`/channels/${guildId}/${guildInfo.channels[0].snowflake}`);
        }
    }, [guildInfo, loading, guildId, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

  return (
    <section className="flex flex-col bg-gray-700 text-white p-1 w-64">
        <Link to={`/guild/${guildId}`} className="flex items-center p-3 hover:bg-gray-600 rounded-lg cursor-pointer transition">
            {
                guildInfo.icon == null ? 
                <IconFromName name={guildInfo.name} /> :
                <img src={`${import.meta.env.VITE_CDN_URL}/icon/${guildInfo.icon}`} className="w-16 h-16 rounded-full" alt="guild icon" title={guildInfo.name} />
            }
            <h1 className="text-2xl font-bold ml-2">{guildInfo.name}</h1>
        </Link>
        <ChannelList channels={guildInfo.channels} />
    </section>
  );
}

export default ChannelsSection;