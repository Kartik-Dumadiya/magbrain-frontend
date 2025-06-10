import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:3000/auth/me", { withCredentials: true });
            setUser(res.data.user);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setUser(null); // Not logged in
            } else {
                // Optionally log or handle other errors
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};