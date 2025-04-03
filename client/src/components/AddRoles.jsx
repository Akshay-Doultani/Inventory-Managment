import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const AddRole = () => {
    const [formData, setFormData] = useState({
        roleName: "",
        status: "Active", // Default status
    });

    const { id } = useParams(); // Get role ID from URL params
    const navigate = useNavigate();
    const isEdit = Boolean(id); // Check if in edit mode
    const { currentUser, loading } = useContext(UserContext);

    // Fetch role data if in edit mode
    useEffect(() => {
        if (isEdit) {
            const fetchRole = async () => {
                try {
                    const response = await axiosInstance.get(`/roles/${id}`);
                    const data = response.data;
                    setFormData({
                        roleName: data.roleName || "",
                        status: data.status || "Active",
                    });
                } catch (error) {
                    console.error("Error fetching role:", error);
                }
            };
            fetchRole();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/roles/${id}` : "/roles";
        const method = isEdit ? "put" : "post";

        try {
            if (currentUser && currentUser.token) {
                await axiosInstance[method](url, formData, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
                navigate("/roles");
            } else {
                console.error("No token found");
            }
        } catch (error) {
            console.error("Error saving role:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 mt-7">
                <h1 className="text-3xl font-bold">{isEdit ? "Edit Role" : "New Role"}</h1>
                <button
                    className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-4 py-2 rounded-lg"
                    onClick={() => navigate("/roles")}
                >
                    ← Back to roles
                </button>
            </div>

            <form
                className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto border border-gray-200"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label className="block font-medium mb-2">Role Name</label>
                    <input
                        type="text"
                        name="roleName"
                        value={formData.roleName}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                        placeholder="Enter role name"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-6 py-2 rounded-lg"
                    >
                        {isEdit ? "Update Role" : "Create Role"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRole;
