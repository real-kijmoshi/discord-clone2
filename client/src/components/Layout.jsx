import { useParams } from "react-router-dom";
import GuildList from "./GuildList";
import { useEffect } from "react";
import PropTypes from "prop-types";


function Layout({ children }) {
    const { guildID } = useParams();

    useEffect(() => {
        if(!localStorage.getItem("token")) {
            window.location.href = "/login";
        }
    });

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
Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;