import { useState } from "react";
import axios from "../../utils/axios";


function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/register", {
                username,
                password,
                email,
            });
            console.log(response);
            window.location.href = "/auth/login";
        } catch (error) {

            console.log(error);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="bg-gray-800 h-screen flex flex-col justify-center items-center text-white space-y-4 p-4">
            <div className="absolute top-0 left-0 p-4 text-white cursor-pointer" onClick={() => window.history.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
            </div>
    

            <div className="rounded shadow-lg bg-gray-900 p-4 flex flex-col items-center space-y-4">
                <img src="/logo.svg" alt="logo" className="w-32 h-36" />
                <h1 className="text-4xl font-bold">Disocrd-clone</h1>
                <form
                    className="flex flex-col space-y-4 items-center mt-4 bg-gray p-12 pb-0"
                    onSubmit={handleSubmit}
                    action="/auth/register"
                    method="post"
                >
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                        type="username"
                        className="p-2 rounded bg-gray-700 w-64 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 rounded bg-gray-700 w-64 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 rounded bg-gray-700 w-64 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 px-4 py-2 text-white rounded"
                    >
                        Register
                    </button>

                    <br />
                    <br />
                    <p className="text-white mt-10">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-blue-500">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;