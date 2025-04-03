import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { FaUserCircle } from 'react-icons/fa'; // Import user icon from react-icons

export default function Topbar() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Logout function
    const logout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        setCurrentUser(null); // Clear current user from context
        window.location.href = "/login"; // Redirect to login page
    };

    return (
        <div className="topbar p-4 bg-gray-800 text-white flex justify-between items-center lg:flex hidden  ">
            {/* Left side content can go here if needed */}

            {/* Right side content */}
            <div className="ml-auto flex items-center space-x-4 relative">
                {currentUser ? (
                    <>
                        <FaUserCircle className="text-2xl" />
                        <div className="text-lg font-semibold leading-tight">
                            <div>{currentUser.firstName}</div>
                            <div className="text-sm">{currentUser.role}</div>
                        </div>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition relative"
                        >
                            ▼
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 w-48 bg-white text-black rounded shadow-lg z-10 mt-28">
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <span className="text-lg font-semibold">Guest</span>
                )}
            </div>
        </div>
    );
}
