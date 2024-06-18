import { useEffect } from "react";
import useGuilds from "../hooks/useGuilds";
import GuildItem from "./GuildItem";

function GuildList() {
    const { guilds, loading } = useGuilds(localStorage.getItem("token"));
    useEffect(() => {
        if (!loading) {
            console.log(guilds);
        }
    }, [guilds, loading]);
  return (
    //make it sidepanel
    <section className="h-full bg-gray-800 text-white p-1">
      {
        guilds.map((guild) => (
          <GuildItem key={guild.snowflake} guild={guild} />
        ))
      }
    </section>
  );
}

export default GuildList;