import { Link, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import GuildList from "./GuildList";


function Layout({ children }) {
    const { guildID, channelID } = useParams();
    const { user, loading } = useUser(localStorage.getItem("token"));

    if (loading) {
        return <div>Loading...</div>;
    } 

    if (!user) {
        return null;
    }

  
    return (
        <div className="flex flex-row h-screen w-screen">
            <div className="flex flex-col justify-between bg-gray-800 text-white p-1 justify-between w-fit">
                <GuildList selectedGuild={guildID} />
            </div>

            <div className="flex flex-col w-full">
                {children}
            </div>
        </div>
    )
}


export default Layout;