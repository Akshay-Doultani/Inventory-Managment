import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../../axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axiosInstance
                .get("/auth/current", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    // Assuming response contains the current user's data and permissions
                    setCurrentUser({ ...response.data, token });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error:", error.response?.data?.message || error.message);
                    setCurrentUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
