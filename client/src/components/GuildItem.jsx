import { Link } from "react-router-dom";
import IconFromName from "./IconFromName";


function GuildItem({ guild, selected }) {
  console.log(selected)
  return (
    <Link to={`/channels/${guild.snowflake}`} className="guild-item flex items-center">
          <div className={
            selected ? 
              "flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition border-l-4 border-blue-500" :
              "flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition"
          }>
          {
            guild.icon == null ? 
              <IconFromName name={guild.name} /> :
              <img src={`${import.meta.env.VITE_CDN_URL}/icon/${guild.icon}`} className="w-16 h-16 rounded-full" alt="guild icon" title={guild.name} />
          }
        </div>
    </Link>
  );
}

export default GuildItem;