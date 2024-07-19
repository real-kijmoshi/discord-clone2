import { useEffect, useState } from "react";
import PropTypes from "prop-types";


function IconFromName({ name }) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (name) {
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;
            canvas.style.display = "none";
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#7289da";
            ctx.fillRect(0, 0, 128, 128);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 64px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const initials = name
                .split(" ")
                .map((part) => part[0].toUpperCase())
                .join("");
            ctx.fillText(initials, 64, 64);

            setUrl(canvas.toDataURL());

            // destroy the canvas
            return () => {
                canvas.remove();
            };
        }
    }, [name]);

    return (
        <img src={url} className="w-16 h-16 rounded-full" alt="guild icon" title={name} />
    );
}
IconFromName.propTypes = {
    name: PropTypes.string.isRequired,
};

export default IconFromName;