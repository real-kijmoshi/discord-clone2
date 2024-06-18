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
                console.log(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    return { user, loading };
}