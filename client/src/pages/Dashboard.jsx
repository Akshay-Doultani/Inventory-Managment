import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { FaUsers, FaBox, FaCheck, FaShoppingCart } from "react-icons/fa";

const Dashboard = () => {
    const [data, setData] = useState({
        users: 0,
        products: 0,
        checkIns: 0,
        checkOuts: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axiosInstance.get("/users");
                const productsResponse = await axiosInstance.get("/products");

                const totalCheckIns = productsResponse.data.filter(p => p.status === 'checkin').length;
                const totalCheckOuts = productsResponse.data.filter(p => p.status === 'checkedout').length;

                setData({
                    users: usersResponse.data.length,
                    products: productsResponse.data.length,
                    checkIns: totalCheckIns,
                    checkOuts: totalCheckOuts,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 mt-11 lg:mt-1">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-red-500 p-4 rounded-lg flex items-center h-40">
                    <FaUsers className="text-white text-4xl mr-4" />
                    <div>
                        <h2 className="text-white text-lg">Total Users</h2>
                        <p className="text-white text-2xl font-bold">{data.users}</p>
                    </div>
                </div>
                <div className="bg-orange-500 p-4 rounded-lg flex items-center h-40">
                    <FaBox className="text-white text-4xl mr-4" />
                    <div>
                        <h2 className="text-white text-lg">Total Products</h2>
                        <p className="text-white text-2xl font-bold">{data.products}</p>
                    </div>
                </div>
                <div className="bg-blue-500 p-4 rounded-lg flex items-center h-40">
                    <FaCheck className="text-white text-4xl mr-4" />
                    <div>
                        <h2 className="text-white text-lg">Total Check In</h2>
                        <p className="text-white text-2xl font-bold">{data.checkIns}</p>
                    </div>
                </div>
                <div className="bg-green-500 p-4 rounded-lg flex items-center h-40">
                    <FaShoppingCart className="text-white text-4xl mr-4" />
                    <div>
                        <h2 className="text-white text-lg">Total Check Out</h2>
                        <p className="text-white text-2xl font-bold">{data.checkOuts}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
