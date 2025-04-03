import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const AddWarehouse = () => {
    const [warehouse, setWarehouse] = useState({ name: "", address: "" });
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);  // Check if it's edit mode based on URL param
    const { currentUser, loading } = useContext(UserContext);

    useEffect(() => {
        if (isEdit) {
            const fetchWarehouse = async () => {
                try {
                    const response = await axiosInstance.get(`/warehouses/${id}`);
                    const data = response.data;
                    setWarehouse({
                        name: data.name || "",
                        address: data.address || ""
                    });
                } catch (error) {
                    console.error("Error fetching warehouse:", error);
                }
            };
            fetchWarehouse();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWarehouse({ ...warehouse, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/warehouses/${id}` : "/warehouses";
        const method = isEdit ? "put" : "post";

        try {
            if (currentUser && currentUser.token) {
                await axiosInstance[method](url, warehouse, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
                navigate("/warehouse");
            } else {
                console.error("No token found");
            }
        } catch (error) {
            console.error("Error sending data to backend:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 mt-7">
                <h1 className="text-3xl font-bold">{isEdit ? "Edit Warehouse" : "New Warehouse"}</h1>
                <button
                    className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-4 py-2 rounded-lg"
                    onClick={() => navigate("/warehouses")}
                >
                    ← Back to warehouses
                </button>
            </div>

            <form
                className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto border border-gray-200"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FaInfoCircle className="w-4 h-4 text-blue-400 mr-2" />
                        <h2 className="text-lg font-semibold">{isEdit ? "Edit Warehouse" : "Add Warehouse"}</h2>
                    </div>
                </div>
                <hr className="mb-6 border-gray-200" />

                {/* Warehouse Name Input */}
                <div className="mb-4">
                    <label className="block font-medium mb-2">Warehouse Name</label>
                    <input
                        type="text"
                        name="name"
                        value={warehouse.name}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                        placeholder="Warehouse name"
                    />
                </div>

                {/* Warehouse Address Input */}
                <div className="mb-6">
                    <label className="block font-medium mb-2">Warehouse Address</label>
                    <input
                        type="text"
                        name="address"
                        value={warehouse.address}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                        placeholder="Warehouse address"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-6 py-2 rounded-lg"
                    >
                        {isEdit ? "Update Warehouse" : "Create Warehouse"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddWarehouse;
