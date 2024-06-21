import { Link } from "react-router-dom";

const ChannelItem = ({ channel }) => {

    return (
        <Link className="cursor-pointer transition hover:bg-gray-600 p-0" to={`/channels/${channel.guild}/${channel.snowflake}`}>
            <hr className="mb-2" />
            <h1 className="text-2xl font-bold flex items-center">
                {
                    channel.channelType === "text" ? "📝" : "🔈"
                }
                {channel.name}
            </h1>
            <hr className="mt-2" />
        </Link>
    );
}


function ChannelList({ channels }) {
    return (
        <div className="flex flex-col mt-2">
            {
                channels.map((channel) => (
                    <ChannelItem key={channel.snowflake} channel={channel} />
                ))
            }
        </div>
    );
}

export default ChannelList;