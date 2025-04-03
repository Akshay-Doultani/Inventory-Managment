import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const warehousesPerPage = 10;
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    // Correctly extract warehouse permissions based on currentUser's role
    const warehousePermissions = currentUser?.permissions?.[0]?.permissions?.warehouse || {};

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axiosInstance.get("/warehouses");
                if (response.data && Array.isArray(response.data)) {
                    setWarehouses(response.data);
                } else {
                    console.log("No warehouses found");
                }
            } catch (error) {
                console.error("Error fetching warehouses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouses();
    }, []);

    const handleAddWarehouse = () => {
        navigate("/addwarehouse"); // Navigate to AddWarehouse page
    };

    const handleEditWarehouse = (warehouseId) => {
        navigate(`/warehouse/edit/${warehouseId}`);
    };

    const handleDeleteWarehouse = async (warehouseId) => {
        try {
            const response = await axiosInstance.delete(`/warehouses/${warehouseId}`);
            if (response.status === 200) {
                setWarehouses(warehouses.filter((warehouse) => warehouse._id !== warehouseId));
            } else {
                console.error("Failed to delete warehouse");
            }
        } catch (error) {
            console.error("Error deleting warehouse:", error);
        }
    };

    const indexOfLastWarehouse = currentPage * warehousesPerPage;
    const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
    const currentWarehouses = warehouses.slice(indexOfFirstWarehouse, indexOfLastWarehouse);

    const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
    const prevPage = () => setCurrentPage((prevPage) => prevPage - 1);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-11 lg:mt-1">
            <div className="flex justify-between items-center mb-4 mt-7">
                <h1 className="text-2xl font-bold">All Warehouses</h1>

                {/* Show Add Warehouse button if user has "create" permission */}
                {warehousePermissions.create && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={handleAddWarehouse}
                    >
                        Add Warehouse
                    </button>
                )}
            </div>



            <div className="overflow-x-auto">
                <table className="min-w-full bg-white table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">S. No.</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Address</th>
                            <th className="py-2 px-4 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWarehouses.length > 0 ? (
                            currentWarehouses.map((warehouse, index) => (
                                <tr key={warehouse._id} className="text-sm">
                                    <td className="py-2 px-4 border-b text-left">{indexOfFirstWarehouse + index + 1}</td>
                                    <td className="py-2 px-4 border-b text-left">{warehouse.name}</td>
                                    <td className="py-2 px-4 border-b text-left">{warehouse.address}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className="flex justify-center items-center min-h-[24px] gap-3">
                                            {warehousePermissions.edit && (
                                                <button onClick={() => handleEditWarehouse(warehouse._id)} className="text-blue-500">
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {warehousePermissions.delete && (
                                                <button onClick={() => handleDeleteWarehouse(warehouse._id)} className="text-red-500">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border-b text-center">No warehouses found.</td>
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
                <button onClick={nextPage} disabled={indexOfLastWarehouse >= warehouses.length} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Next &gt;
                </button>
            </div>
        </div>
    );
};

export default Warehouse;
