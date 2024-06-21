import { useParams } from "react-router-dom";
import ChannelsSection from "../components/ChannelsSection";

function AtMe() {
    return (
        <div>
            <h1>Guild at me</h1>
        </div>
    );
}

function NormalGuild({ guildId }) {
    return (
        <div className="flex flex-row h-full w-full">
            <ChannelsSection guildId={guildId} redirect={true} />
            <section className="flex flex-col w-full">
                <h1 className="text-4xl font-bold text-center">
                    No text channels found 😥
                </h1>
            </section>
        </div>
    );
}

function Guild() {
    const { guildID } = useParams();
    
    if (guildID === "@me") {
        return <AtMe />;
    }

    return <NormalGuild guildId={guildID} />;
}

export default Guild;
