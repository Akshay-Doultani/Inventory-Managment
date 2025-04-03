import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rolesPerPage = 10;
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    console.log("Current User:", currentUser); // Debugging

    // Extract role permissions correctly
    const rolePermissions = currentUser?.permissions?.[0]?.permissions?.role || {};

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get("/roles");
                if (response.data && Array.isArray(response.data)) {
                    setRoles(response.data);
                } else {
                    console.log("No roles found");
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const handleEditRole = (roleId) => {
        navigate(`/roles/edit/${roleId}`);
    };

    const handleDeleteRole = async (roleId) => {
        try {
            const response = await axiosInstance.delete(`/roles/${roleId}`);
            if (response.status === 200) {
                setRoles(roles.filter((role) => role._id !== roleId));
            } else {
                console.error("Failed to delete role");
            }
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    const indexOfLastRole = currentPage * rolesPerPage;
    const indexOfFirstRole = indexOfLastRole - rolesPerPage;
    const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

    const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
    const prevPage = () => setCurrentPage((prevPage) => prevPage - 1);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-11 lg:mt-1">
            <div className="flex justify-between items-center mb-4 mt-7">
                <h1 className="text-2xl font-bold">All Roles</h1>

                {/* Show Add Role button if user has "create" permission */}
                {rolePermissions.create && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => navigate("/roles/add")}
                    >
                        Add Role
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">S. No.</th>
                            <th className="py-2 px-4 border-b text-left">Role Name</th>
                            <th className="py-2 px-4 border-b text-left">Status</th>
                            <th className="py-2 px-4 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRoles.length > 0 ? (
                            currentRoles.map((role, index) => (
                                <tr key={role._id} className="text-sm">
                                    <td className="py-2 px-4 border-b text-left">{indexOfFirstRole + index + 1}</td>
                                    <td className="py-2 px-4 border-b text-left">{role.roleName}</td>
                                    <td className="py-2 px-4 border-b text-left">{role.status}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className="flex justify-center items-center min-h-[24px] gap-3">
                                            {rolePermissions.edit && (
                                                <button onClick={() => handleEditRole(role._id)} className="text-blue-500">
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {rolePermissions.delete && (
                                                <button onClick={() => handleDeleteRole(role._id)} className="text-red-500">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border-b text-center">No roles found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    &lt; Prev
                </button>
                <p className="text-gray-700">Page {currentPage}</p>
                <button onClick={nextPage} disabled={indexOfLastRole >= roles.length} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Next &gt;
                </button>
            </div>
        </div>
    );
};

export default Roles;
