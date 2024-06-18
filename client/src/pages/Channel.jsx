import { useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import GuildList from "../components/GuildList";



function ChannelRouter() {
    const { guildId, channelId } = useParams();
    const { user, loading } = useUser(localStorage.getItem("token"));

    if (loading) {
        return <div>Loading...</div>;
    } 

    if (!user) {
        return null;
    }
  
    return (
        <div className="flex h-screen w-screen bg-gray-900 text-white">
            <GuildList user={user} />
            <div>
                {guildId} {channelId}
            </div>
        </div>
    )
}


export default ChannelRouter;