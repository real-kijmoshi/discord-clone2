import { Link } from "react-router-dom";

function GuildItem({ guild }) {
  return (
    <Link to={`/channels/${guild.snowflake}`} className="guild-item flex items-center">
        <div className="guild-item flex items-center p-2 hover:bg-gray-700 rounded-lg">
          <img src={`http://localhost:3000/cdn/icon/${guild.icon}`} className="w-16 h-16 rounded-full" alt="guild icon" title={guild.name} />
        </div>
    </Link>
  );
}

export default GuildItem;