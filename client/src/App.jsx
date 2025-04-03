import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import AddUser from "./components/Add-User";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { UserContext } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Roles from "./pages/Roles";
import AddRoles from "./components/AddRoles";
import PermissionsPage from "./pages/Permission";
import Warehouse from "./pages/Warehouse";
import AddWarehouse from "./components/AddWarehouse";
import Devices from "./pages/Devices";
import AddDevices from "./components/AddDevices";
import CreateProduct from "./pages/CreateProduct";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./components/ProductDetails";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { currentUser } = useContext(UserContext);
  const [isCompressed, setIsCompressed] = useState(true); // Sidebar toggle state

  return (
    <Router>
      <ToastContainer // Ensure the ToastContainer is at the root level
        position="top-right"
        autoClose={3000} // 10 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex h-screen">
        {currentUser ? (
          <>
            {/* Sidebar with controlled width */}
            <Sidebar isCompressed={isCompressed} setIsCompressed={setIsCompressed} />

            {/* Main content */}
            <div
              className={`flex flex-col flex-grow transition-all duration-300`}
              style={{ marginLeft: isCompressed ? "80px" : "256px" }} // Adjust width dynamically
            >
              <Topbar />
              <div className="p-4 flex-grow overflow-auto">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                  <Route path="/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                  <Route path="/users/edit/:id" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                  <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
                  <Route path="/roles/add" element={<ProtectedRoute><AddRoles /></ProtectedRoute>} />
                  <Route path="/roles/edit/:id" element={<ProtectedRoute><AddRoles /></ProtectedRoute>} />
                  <Route path="/permission" element={<ProtectedRoute><PermissionsPage /></ProtectedRoute>} />
                  <Route path="/warehouse" element={<ProtectedRoute><Warehouse /></ProtectedRoute>} />
                  <Route path="/addwarehouse" element={<ProtectedRoute><AddWarehouse /></ProtectedRoute>} />
                  <Route path="/warehouse/edit/:id" element={<ProtectedRoute><AddWarehouse /></ProtectedRoute>} />
                  <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
                  <Route path="/adddevices" element={<ProtectedRoute><AddDevices /></ProtectedRoute>} />
                  <Route path="/devices/edit/:id" element={<ProtectedRoute><AddDevices /></ProtectedRoute>} />
                  <Route path="/create-product" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                  <Route path="/products" element={<ProtectedRoute><AllProducts /></ProtectedRoute>} />
                  <Route path="/products/:serialNumber" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                  <Route path="/edit-product/:serialNumber" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
