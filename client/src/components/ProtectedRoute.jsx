import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>; // Optionally, add a loader here
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
