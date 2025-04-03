import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from "../../axios";

const AddUser = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        image: "",
        cloudinaryId: "", // Add this to store the Cloudinary ID
        role: "",
        username: "",
        contact: "",
        employeeId: "",
        password: "",
        confirmPassword: "",
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    useEffect(() => {
        if (isEdit) {
            // Fetch user details if editing
            const fetchUser = async () => {
                const response = await axiosInstance.get(`/users/${id}`);
                const data = response.data;
                console.log("Fetched User Data:", data);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    image: data.image || "",
                    cloudinaryId: data.cloudinaryId || "",
                    role: data.role || "",
                    username: data.username || "",
                    contact: data.contact || "",
                    employeeId: data.employeeId || "",
                    password: "",
                    confirmPassword: "",
                });
            };
            fetchUser();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const imageUpload = async (e) => {
        const file = e.target.files[0];

        if (file) {
            try {
                const uploadData = new FormData();
                uploadData.append("file", file);
                uploadData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                uploadData.append("folder", "userdetails");

                const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
                    method: "POST",
                    body: uploadData,
                });

                const data = await response.json();
                if (!response.ok) throw new Error(`Cloudinary error: ${data.error.message}`);

                // ✅ Fix: Use the previous state properly to avoid overwriting values
                setFormData(prevData => ({
                    ...prevData,
                    image: data.secure_url,
                    cloudinaryId: data.public_id
                }));

                console.log("Updated formData after image upload:", formData); // Debugging log

            } catch (error) {
                console.error("Image upload failed:", error);
            }
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔹 Check if password and confirmPassword match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;  // ⛔ Stop form submission if passwords don't match
        }

        console.log("Form Data before submission:", formData); // ✅ Debug log

        const url = isEdit ? `/users/edit/${id}` : "/users/add";
        const method = isEdit ? "put" : "post";

        try {
            const response = await axiosInstance[method](url, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Server Response:", response.data); // ✅ Debug server response
            navigate("/users");
        } catch (error) {
            console.error("Error sending data to backend:", error.response ? error.response.data : error.message);
        }
    };




    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 mt-7">
                <h1 className="text-3xl font-bold">{isEdit ? "Edit User" : "New User"}</h1>
                <div>
                    <button
                        className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-4 py-2 rounded-lg"
                        onClick={() => navigate("/users")}
                    >
                        ← Back to users
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <form
                className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto border border-gray-200"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        {/* Blue User Icon */}
                        <div className=" text-lg rounded-full ">
                            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-blue-400 " />
                        </div>

                        <h2 className="text-lg font-semibold">Add Users</h2>
                    </div>
                </div>
                <hr className="mb-6 border-gray-200" />

                {/* First Row: First Name, Last Name, and Image */}
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block font-medium mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="First Name"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Last Name"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Image</label>
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="User Profile"
                                className="w-24 h-24 rounded-lg mb-2 object-cover"
                            />
                        )}
                        <input
                            type="file"
                            name="image"
                            onChange={imageUpload}  // Update to use imageUpload function
                            className="w-full border px-4 py-2 rounded-lg"
                        />
                    </div>
                </div>

                {/* Second Row: Role, Username, Contact Number */}
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div>
                        <label className="block font-medium mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                        >
                            <option value="">Select a role</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Shipping Dept">Shipping Dept</option>
                            <option value="Testing">Testing</option>
                            <option value="Technician">Technician</option>
                            <option value="SupplyChainManager">Supply Chain Manager</option>
                        </select>

                    </div>
                    <div>
                        <label className="block font-medium mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Contact No</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Contact No"
                        />
                    </div>
                </div>

                {/* Third Row: Employee ID, Password, Confirm Password */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                    <div>
                        <label className="block font-medium mb-2">Employee Id</label>
                        <input
                            type="text"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Employee Id"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-6 py-2 rounded-lg"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
