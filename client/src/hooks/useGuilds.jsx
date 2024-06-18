import { useEffect, useState } from 'react';
import axios from '../utils/axios';

export default function useGuilds(token) {
    const [guilds, setGuilds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted

        const fetchGuilds = async () => {
            try {
                const response = await axios.get('/guilds', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (isMounted) {
                    setGuilds(response.data);
                    console.log(`Got guilds: ${JSON.stringify(response.data)}`); // Debugging log
                }
            } catch (error) {
                if (isMounted) {
                    setGuilds([]);
                    console.error('Error fetching guilds:', error); // Error logging
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (token) {
            fetchGuilds();
        } else {
            setGuilds([]);
            setLoading(false);
        }

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false
        };
    }, [token]);

    return { guilds, loading };
}
