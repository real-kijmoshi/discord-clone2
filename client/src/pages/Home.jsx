import { useEffect } from "react";
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


    return (
        <>
            <nav className="flex justify-end bg-gray-700 p-4 text-white space-x-4 items-center">
                <a href="/auth/login" className="bg-blue-500 px-4 py-2 text-white rounded">Login</a>
                <a href="/auth/register" className="bg-blue-500 px-4 py-2 text-white rounded">Register</a>

            </nav>
            <div className="bg-gray-800 h-screen flex flex-col justify-center items-center text-white">
                <img src="/logo.svg" alt="logo" className="w-32 h-36" />
                <h1 className="text-4xl font-bold">
                    Disocrd-clone
                </h1>

                hi there traveler,
                if you are new here, you can sign up or login to continue
            </div>
        </>
    );
};

export default Home;
