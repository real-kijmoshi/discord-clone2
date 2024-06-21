import { useEffect } from "react";
import useGuilds from "../hooks/useGuilds";
import GuildItem from "./GuildItem";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

function GuildList({ selectedGuild }) {
    const { guilds, loading } = useGuilds(localStorage.getItem("token"));
    useEffect(() => {
        if (!loading) {
            console.log(guilds);
        }
    }, [guilds, loading]);
  return (
    <div className="flex flex-col p-2 w-fit">
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
  );
}

export default GuildList;