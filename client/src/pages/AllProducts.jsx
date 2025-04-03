import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import { FaSearch, FaEdit, FaEye, FaHistory, FaTrash } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Map());
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    const productPermissions = currentUser?.permissions?.[0]?.permissions?.product || {};
    const checkoutPermission = currentUser?.permissions?.[0]?.permissions?.checkOut || {};

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/products');
                const productData = Array.isArray(response.data) ? response.data : [];
                setProducts(productData);
                setFilteredProducts(productData);
            } catch (error) {
                console.error("Error fetching products", error);
                setProducts([]);
                setFilteredProducts([]);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, fromDate, toDate]);

    const handleSearch = () => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

        const filtered = products.filter((product) => {
            const productDate = new Date(product.createdAt).setHours(0, 0, 0, 0);
            const isWithinDateRange = (!from || productDate >= from) && (!to || productDate <= to);
            const matchesQuery = product.serialNumber.toLowerCase().includes(lowercasedQuery);
            return isWithinDateRange && matchesQuery;
        });
        setFilteredProducts(filtered);
    };

    const handleSelectProduct = (serialNumber) => {
        setSelectedProducts((prevSelected) => {
            const newSelected = new Map(prevSelected);
            if (newSelected.has(serialNumber)) {
                newSelected.delete(serialNumber);
            } else {
                newSelected.set(serialNumber, true);
            }
            return newSelected;
        });
    };

    const handleCheckOut = async () => {
        const selectedProductSerialNumbers = Array.from(selectedProducts.keys());

        try {
            await Promise.all(selectedProductSerialNumbers.map(async (serialNumber) => {
                await axiosInstance.patch(`/products/${serialNumber}`, { status: 'checkedout' });
                setProducts((prevProducts) => prevProducts.map(product =>
                    product.serialNumber === serialNumber ? { ...product, status: 'checkedout' } : product
                ));
                setFilteredProducts((prevFiltered) => prevFiltered.map(product =>
                    product.serialNumber === serialNumber ? { ...product, status: 'checkedout' } : product
                ));
            }));
            setSelectedProducts(new Map()); // Clear selected products after checkout
            console.log("Check-out initiated for products:", selectedProductSerialNumbers);
        } catch (error) {
            console.error("Error checking out products:", error);
        }
    };

    const handleDeleteProduct = async (serialNumber) => {
        try {
            await axiosInstance.delete(`/products/${serialNumber}`);
            setProducts((prevProducts) => prevProducts.filter(product => product.serialNumber !== serialNumber));
            setFilteredProducts((prevFiltered) => prevFiltered.filter(product => product.serialNumber !== serialNumber));
            setSelectedProducts((prevSelected) => {
                const newSelected = new Map(prevSelected);
                newSelected.delete(serialNumber);
                return newSelected;
            });
            console.log(`Product with serial number ${serialNumber} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting product with serial number ${serialNumber}`, error);
        }
    };

    const handleViewProduct = (serialNumber) => {
        navigate(`/products/${serialNumber}`);
    };

    const handleEditProduct = (serialNumber) => {
        navigate(`/edit-product/${serialNumber}`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Products</h1>
                <div className="flex space-x-4">
                    {checkoutPermission.checkout && (
                        <button
                            onClick={handleCheckOut}
                            disabled={selectedProducts.size === 0}
                            className={`px-4 py-2 rounded ${selectedProducts.size === 0
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-500 text-white'
                                }`}
                        >
                            Check-Out
                        </button>
                    )}
                    {productPermissions?.create && (
                        <button
                            onClick={() => navigate('/create-product')}
                            className="px-4 py-2 bg-green-500 text-white rounded">
                            + Create Product
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search by Serial Number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-l"
                    />
                </div>
                <div className="flex space-x-4 items-center">
                    <label htmlFor="from" className="text-gray-700 font-medium">From:</label>
                    <input
                        id="from"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded"
                    />
                    <label htmlFor="to" className="text-gray-700 font-medium">To:</label>
                    <input
                        id="to"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded"
                    />
                </div>
            </div>

            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Select</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Product & Serial Number</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Device Type</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Created By</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Created At</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Marketplace</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <tr key={product.serialNumber} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                    <input
                                        key={`checkbox-${product.serialNumber}`}
                                        type="checkbox"
                                        checked={selectedProducts.has(product.serialNumber)}
                                        onChange={() => handleSelectProduct(product.serialNumber)}
                                    />
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{product.serialNumber}</td>
                                <td className="border border-gray-200 px-4 py-2">{product.deviceType}</td>
                                <td className="border border-gray-200 px-4 py-2">{product.createdBy}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    {new Date(product.createdAt).toLocaleDateString('en-GB')}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{product.status}</td>
                                <td className="border border-gray-200 px-4 py-2">{product.marketplace}</td>
                                <td className="border border-gray-200 px-4 py-2 flex space-x-2 justify-center">
                                    {productPermissions?.edit && (
                                        <FaEdit
                                            title="Edit"
                                            className="cursor-pointer text-blue-500 text-lg"
                                            onClick={() => handleEditProduct(product.serialNumber)}
                                        />
                                    )}
                                    <FaEye
                                        title="View"
                                        className="cursor-pointer text-green-500 text-lg"
                                        onClick={() => handleViewProduct(product.serialNumber)}
                                    />
                                    <FaHistory title="History" className="cursor-pointer text-purple-500 text-lg" />
                                    {productPermissions?.delete && (
                                        <FaTrash
                                            title="Delete"
                                            className="cursor-pointer text-red-500 text-lg"
                                            onClick={() => handleDeleteProduct(product.serialNumber)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                No products match the search criteria
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllProduct;
