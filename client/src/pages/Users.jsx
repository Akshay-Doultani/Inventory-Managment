import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    // ✅ Extract permissions properly from the first element in the array
    const permissions = currentUser?.permissions?.[0]?.permissions?.user || {};

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/users");
                if (response.data && Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.log("No users found");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Log permissions to console for debugging
    // useEffect(() => {
    //     console.log("Current User:", currentUser);
    //     console.log("User Permissions:", permissions);
    // }, [currentUser]);

    const handleAddUser = () => navigate("/users/add");
    const handleEditUser = (userId) => navigate(`/users/edit/${userId}`);
    const handleDeleteUser = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/users/delete/${userId}`);
            if (response.status === 200) {
                setUsers(users.filter((user) => user._id !== userId));
            } else {
                console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-7">
                <h1 className="text-2xl font-bold">Users</h1>

                {/* ✅ Fix permission check */}
                {permissions.create && (
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        <FaUserPlus />
                        Add User
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">S. No.</th>
                            <th className="py-2 px-4 border-b text-center">Icon</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Contact</th>
                            <th className="py-2 px-4 border-b text-left">Role</th>
                            <th className="py-2 px-4 border-b text-left">Employee ID</th>
                            <th className="py-2 px-4 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr key={user._id} className="text-sm">
                                    <td className="py-2 px-4 border-b text-left">{indexOfFirstUser + index + 1}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <img src={user.image} alt="User Icon" className="h-8 w-8 rounded-full mx-auto" />
                                    </td>
                                    <td className="py-2 px-4 border-b text-left">{user.firstName} {user.lastName}</td>
                                    <td className="py-2 px-4 border-b text-left">{user.contact}</td>
                                    <td className="py-2 px-4 border-b text-left">{user.role}</td>
                                    <td className="py-2 px-4 border-b text-left">{user.employeeId}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className="flex justify-center items-center min-h-[24px] gap-3">
                                            {/* ✅ Fix permission check */}
                                            {permissions.edit && (
                                                <button onClick={() => handleEditUser(user._id)} className="text-blue-500">
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {permissions.delete && (
                                                <button onClick={() => handleDeleteUser(user._id)} className="text-red-500">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-2 px-4 border-b text-center">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    &lt; Prev
                </button>
                <p className="text-gray-700">Page {currentPage}</p>
                <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={indexOfLastUser >= users.length} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Next &gt;
                </button>
            </div>
        </div>
    );
};

export default Users;
