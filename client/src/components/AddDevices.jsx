import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const AddDevice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const isEdit = Boolean(id); // Check if it's edit mode
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Available"); // Default to 'Available'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirect if the user is not an Admin
    useEffect(() => {
        if (currentUser?.role !== "Admin") {
            navigate("/devices"); // Redirect to Devices page if not Admin
        }

        // Fetch device data if it's in edit mode
        if (isEdit) {
            axiosInstance.get(`/devices/${id}`)
                .then(response => {
                    setName(response.data.name);
                    setStatus(response.data.status);
                })
                .catch(err => {
                    setError("Failed to fetch device data.");
                });
        }
    }, [id, currentUser, navigate, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const deviceData = { name, status };
            const method = isEdit ? "put" : "post"; // Choose method based on edit or add
            const url = isEdit ? `/devices/${id}` : "/devices"; // Use different URL for edit

            const response = await axiosInstance[method](url, deviceData);

            if (response.status === 200 || response.status === 201) {
                navigate("/devices"); // Redirect to devices page after successful submission
            }
        } catch (error) {
            setError("Failed to add/update device.");
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{isEdit ? "Edit Device" : "Add Device"}</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-lg">Device Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="status" className="block text-lg">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="Available">Available</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isEdit ? "Update Device" : "Add Device"}
                </button>
            </form>
        </div>
    );
};

export default AddDevice;
