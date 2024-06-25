import { useState, useEffect } from "react";
import axios from "../utils/axios";

axios.defaults.baseURL = "http://localhost:3000/api/v1";

export default function useUser(token) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);

            
            if(/channels/.test(window.location.pathname)) {
                window.location.href = "/";
            }
            
            return;
        }
        
        (async () => {
            try {
                const response = await axios.get("/whoami", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                setUser(null);
                console.log(error)
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    return { user, loading };
}