import React, { useState, useContext } from "react";
import { FaTachometerAlt, FaUsers, FaBox, FaListAlt, FaUserCircle } from "react-icons/fa";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from '../context/UserContext';

const Sidebar = ({ isCompressed, setIsCompressed }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [masterDataOpen, setMasterDataOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // For hover effect
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const iconSize = "text-xl";

    const menuItems = [
        { icon: <FaTachometerAlt />, label: "Dashboard", link: "/" },
        { icon: <FaUsers />, label: "Users", link: "/users" },
        {
            icon: <FaBox />,
            label: "Master Data",
            dropdown: true,
            isOpen: masterDataOpen,
            toggleOpen: () => setMasterDataOpen(!masterDataOpen),
            children: [
                { label: "Role", link: "/roles" },
                { label: "Warehouse", link: "/warehouse" },
                { label: "Permission", link: "/permission" },
            ],
        },
        {
            icon: <FaBox />,
            label: "Inventory",
            dropdown: true,
            isOpen: inventoryOpen,
            toggleOpen: () => setInventoryOpen(!inventoryOpen),
            children: [
                { label: "Product", link: "/products" },
                { label: "Create Product", link: "/create-product" },
                { label: "Devices", link: "/devices" }, // Added Devices to Inventory
            ],
        },
        { icon: <FaListAlt />, label: "Activity Log", link: "#activity-log" },
    ];

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setCurrentUser(null);
        window.location.href = "/login";
    };

    return (
        <div>
            {/* Desktop Sidebar */}
            <div
                className={`hidden md:flex flex-col bg-gradient-to-b from-blue-500 to-red-400 text-white fixed top-0 left-0 z-20 overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isCompressed && !isHovered ? "w-20" : "w-64"} h-screen`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/20">
                    {!isCompressed || isHovered ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="h-8 w-8 rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(to bottom, red, skyblue)" }}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                    alt="Apple Logo"
                                    className="h-4"
                                />
                            </div>
                            <span className="font-bold text-lg">Apple Fix Pros</span>
                        </div>
                    ) : null}
                    <button
                        onClick={() => setIsCompressed(!isCompressed)}
                        className="p-2 rounded-md hover:bg-white/10"
                    >
                        <Menu className="text-white" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                            <Link
                                to={item.link || "#"}
                                className={`flex items-center gap-3 p-2 rounded-md hover:bg-white/10 
                                    ${isCompressed && !isHovered ? "justify-center" : ""}`}
                                onClick={item.dropdown ? item.toggleOpen : undefined}
                            >
                                <div className={iconSize}>{item.icon}</div>
                                {!isCompressed || isHovered ? (
                                    <>
                                        <span>{item.label}</span>
                                        {item.dropdown && (
                                            <div className="ml-auto">
                                                {item.isOpen ? <ChevronUp /> : <ChevronDown />}
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </Link>

                            {/* Dropdown Items */}
                            {(!isCompressed || isHovered) &&
                                item.dropdown &&
                                item.isOpen &&
                                item.children.map((child, i) => (
                                    <Link
                                        key={i}
                                        to={child.link}
                                        className="ml-8 flex items-center gap-3 p-2 rounded-md hover:bg-white/10"
                                    >
                                        <FaListAlt className="text-lg" />
                                        <span>{child.label}</span>
                                    </Link>
                                ))}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Mobile Sidebar (Topbar) */}
            <div
                className={`md:hidden fixed top-0 left-0 w-full bg-gradient-to-b from-blue-500 to-red-400 text-white z-10 transition-all duration-300 
                    ${isMobileOpen ? "h-auto" : "h-16"}`}
            >
                <div className="p-4 flex items-center justify-between">
                    <span className="font-bold">Apple Fix Pros</span>
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="p-2 rounded-md hover:bg-white/10"
                    >
                        <Menu className="text-white" />
                    </button>
                </div>

                {/* Mobile Menu Items */}
                {isMobileOpen && (
                    <div className="flex flex-wrap p-4 gap-2">
                        {menuItems.map((item, index) => (
                            <div key={index} className="flex flex-col items-center w-full">
                                <Link to={item.link || "#"} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 w-full" onClick={item.dropdown ? item.toggleOpen : undefined}>
                                    <div className="text-xl">{item.icon}</div>
                                    <span className="text-sm">{item.label}</span>
                                    {item.dropdown && (
                                        <div className="ml-auto">
                                            {item.isOpen ? <ChevronUp /> : <ChevronDown />}
                                        </div>
                                    )}
                                </Link>

                                {/* Dropdown Items */}
                                {item.dropdown && item.isOpen && item.children.map((child, i) => (
                                    <Link key={i} to={child.link} className="ml-4 text-sm text-center">
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        ))}

                        {/* Current User and Logout */}
                        {currentUser && (
                            <div className="flex flex-col items-center w-full">
                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 w-full">
                                    <FaUserCircle className="text-xl" />
                                    <div className="text-lg font-semibold leading-tight">
                                        <div>{currentUser.firstName}</div>
                                        <div className="text-sm">{currentUser.role}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
