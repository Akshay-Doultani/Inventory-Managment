import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    // Check if the user is an admin
    const isAdmin = currentUser?.role === 'Admin';

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axiosInstance.get("/devices");
                if (response.data && Array.isArray(response.data)) {
                    setDevices(response.data);
                }
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    const handleAddDevice = () => {
        navigate("/adddevices"); // Navigate to AddDevice page
    };

    const handleEditDevice = (deviceId) => {
        navigate(`/devices/edit/${deviceId}`);
    };

    const handleDeleteDevice = async (deviceId) => {
        try {
            const response = await axiosInstance.delete(`/devices/${deviceId}`);
            if (response.status === 200) {
                setDevices(devices.filter((device) => device._id !== deviceId));
            } else {
                console.error("Failed to delete device");
            }
        } catch (error) {
            console.error("Error deleting device:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-11 lg:mt-1">
            <div className="flex justify-between items-center mb-4 mt-7">
                <h1 className="text-2xl font-bold">All Devices</h1>

                {/* Show Add Device button if user is an admin */}
                {isAdmin && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={handleAddDevice}
                    >
                        Add Device
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">S. No.</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Status</th>
                            <th className="py-2 px-4 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.length > 0 ? (
                            devices.map((device, index) => (
                                <tr key={device._id} className="text-sm">
                                    <td className="py-2 px-4 border-b text-left">{index + 1}</td>
                                    <td className="py-2 px-4 border-b text-left">{device.name}</td>
                                    <td className="py-2 px-4 border-b text-left">{device.status}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className="flex justify-center items-center min-h-[24px] gap-3">
                                            {isAdmin && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditDevice(device._id)}
                                                        className="text-blue-500"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteDevice(device._id)}
                                                        className="text-red-500"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border-b text-center">No devices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Devices;
