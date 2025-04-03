import React, { useState, useContext } from "react";
import axiosInstance from "../../axios"; // Import the axios instance
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setCurrentUser } = useContext(UserContext); // Access the UserContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/auth/login", { username, password });
            const { user, token } = response.data;

            // Save the token in localStorage
            localStorage.setItem("token", token);

            // Update the current user in context
            setCurrentUser(user);

            // Show toast notification
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 3000, // 10 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Delay navigation to the dashboard

            navigate("/");

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center relative">
            <img
                src="/login_bg.jpg"
                alt="Login Background"
                className="absolute top-0 left-0 h-full w-full object-cover"
            />
            <div className="absolute top-0 left-0 h-full w-full bg-black bg-opacity-50"></div>
            <div className="relative bg-white bg-opacity-90 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    alt="Apple Logo"
                    className="w-12 mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold mb-2">R2 Database</h1>
                <h2 className="text-lg font-semibold mb-4">LOGIN</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Sign in by entering the information below
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
