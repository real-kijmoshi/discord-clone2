import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const Home = () => {
    const { user, loading } = useUser(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user) {
                navigate("/channels/@me");
            }
        }
    }, [loading, user, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // While the redirection happens, we can return null or a loading indicator
        return null;
    }

    return (
        <div>
            <h1>
                Disocrd-clone
            </h1>

            hi there traveler,
            if you are new here, you can sign up or login to continue
        </div>
    );
};

export default Home;
