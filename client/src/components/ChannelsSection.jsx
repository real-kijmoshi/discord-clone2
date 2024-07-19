import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import ChannelList from "./ChannelList";
import IconFromName from "./IconFromName";
import PropTypes from "prop-types";

function ChannelsSection({ guildId, redirect }) {
    const [guildInfo, setGuildInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Using useCallback to memoize reloadGuildInfo and prevent infinite loops
    const reloadGuildInfo = useCallback(() => {
        setLoading(true);
        axios.get(`/guilds/${guildId}`, {
            headers: {
                authorization: localStorage.getItem("token"),
            }
        })
        .then(({ data }) => {
            setGuildInfo(data);
        })
        .catch(() => {
            setGuildInfo(null);
            console.error("Failed to load guild info");
        })
        .finally(() => setLoading(false));
    }, [guildId]); // Dependency on guildId ensures reloadGuildInfo is updated when guildId changes

    // Effect to load guild info on mount and when guildId changes
    useEffect(() => {
        reloadGuildInfo();
    }, []); // Dependency on the memoized reloadGuildInfo function

    // Effect for retry logic
    useEffect(() => {
        let timer = null;
        if (!loading && !guildInfo) {
            console.log("Guild info not loaded, retrying in 5 seconds");
            timer = setTimeout(reloadGuildInfo, 5000);
        }

        return () => clearTimeout(timer);
    }, [guildInfo, loading, reloadGuildInfo]); // Dependencies ensure effect is correctly triggered

    // Effect for handling redirection
    useEffect(() => {
        if (redirect && !loading && guildInfo && guildInfo.channels.length > 0) {
            console.log(`Redirecting to /channels/${guildId}/${guildInfo.channels[0].snowflake}`);
            navigate(`/channels/${guildId}/${guildInfo.channels[0].snowflake}`);
        }
    }, [guildInfo, loading, guildId, navigate, redirect]); // Dependencies ensure effect is correctly triggered


  return (
    <section className="flex flex-col bg-gray-700 text-white p-1 w-64 h-full">
        <Link to={`/guild/${guildId}`} className="flex items-center p-3 hover:bg-gray-600 rounded-lg cursor-pointer transition">
            {guildInfo && (<>
                {
                
                    guildInfo?.icon == null ? 
                    <IconFromName name={guildInfo.name} /> :
                    <img src={`${import.meta.env.VITE_CDN_URL}/icon/${guildInfo.icon}`} className="w-16 h-16 rounded-full animate-pulse" alt="guild icon" title={guildInfo.name} />
                    
                }
    
                <h1 className="text-2xl font-bold ml-2">{guildInfo.name}</h1>
            </>)}

            {
                !guildInfo &&  (
                 //loading animation
                 <div className="animate-pulse bg-gray-800 w-16 h-16 rounded-full ml-2">
                    <div className="flex flex-col ml-2">
                        <div>
                            <span className="font-bold bg-gray-800 w-24 h-4 rounded-lg"></span>
                            <span className="text-gray-400 ml-2 bg-gray-800 w-16 h-4 rounded-lg mt-2"></span>
                        </div>
                        <span className="bg-gray-800 w-24 h-4 rounded-lg mt-2 ml-16"></span>
                    </div>
                </div>
                )
            }
        </Link>

        
        <ChannelList channels={guildInfo?.channels ?? []} />
    </section>
  );
}
ChannelsSection.propTypes = {
    guildId: PropTypes.string.isRequired,
    redirect: PropTypes.bool,
};

export default ChannelsSection;