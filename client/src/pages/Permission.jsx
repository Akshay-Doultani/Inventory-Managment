import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../axios";
import { UserContext } from "../context/UserContext";

const PermissionsPage = () => {
  const { currentUser } = useContext(UserContext);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch all roles
  useEffect(() => {
    const fetchRoles = async () => {
      if (!currentUser?.token) return console.error("No token found");

      setLoading(true);
      try {
        const res = await axiosInstance.get("/roles", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        setRoles(res.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [currentUser]);

  // Fetch role permissions when a role is selected
  useEffect(() => {
    if (!selectedRole) return;
    setLoading(true);

    axiosInstance
      .get(`/permissions/${selectedRole}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then((res) => {
        if (res.status === 404) {
          // If permissions not found, show message instead of error
          setPermissions(null);
        } else {
          setPermissions(res.data.permissions || {});
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching permissions:", err);
        setLoading(false);
      });
  }, [selectedRole, currentUser.token]);

  // Allow multiple selections within a category
  const handleCheckboxChange = (category, permission) => {
    if (currentUser.role !== "Admin") return;

    setPermissions((prev) => {
      const updatedPermissions = { ...prev };

      if (!updatedPermissions[category]) {
        updatedPermissions[category] = {};
      }

      updatedPermissions[category] = {
        ...updatedPermissions[category],
        [permission]: !prev[category]?.[permission],
      };

      return updatedPermissions;
    });
  };

  // Handle "All" checkbox change
  const handleAllCheckboxChange = (checked) => {
    if (currentUser.role !== "Admin") return;

    setSelectAll(checked);

    setPermissions((prev) => {
      const updatedPermissions = { ...prev };

      ["warehouse", "role", "user", "product", "checkIn", "checkOut"].forEach((category) => {
        if (!updatedPermissions[category]) {
          updatedPermissions[category] = {};
        }

        if (category === "checkIn") {
          updatedPermissions[category]["checkin"] = checked;
        } else if (category === "checkOut") {
          updatedPermissions[category]["checkout"] = checked;
        } else {
          ["list", "create", "edit", "delete"].forEach((perm) => {
            updatedPermissions[category][perm] = checked;
          });
        }
      });

      if (!updatedPermissions["activityLog"]) {
        updatedPermissions["activityLog"] = {};
      }

      updatedPermissions["activityLog"]["assign"] = checked;

      return updatedPermissions;
    });
  };

  // Handle submit to save permissions
  const handleSubmit = async () => {
    if (currentUser.role !== "Admin") return;

    try {
      console.log("Submitting permissions:", JSON.stringify(permissions, null, 2));

      const updatedPermissions = {
        roleId: selectedRole?.toString(),
        permissions,
      };

      await axiosInstance.post("/permissions/assign", updatedPermissions, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      alert("Permissions updated successfully");

      // Refresh permissions
      const res = await axiosInstance.get(`/permissions/${selectedRole}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setPermissions(res.data.permissions || {});
    } catch (err) {
      console.error("Error updating permissions:", err);
      alert("Error updating permissions");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Permissions</h2>

      <div className="flex">
        {/* Role Selection */}
        <div className="w-1/3 bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-3">Roles</h3>
          {loading ? (
            <p>Loading roles...</p>
          ) : (
            roles.length > 0 ? (
              roles.map((role) => (
                <div
                  key={role._id}
                  onClick={() => {
                    if (currentUser.role === "Admin" || currentUser._id === role._id) {
                      setSelectedRole(role._id);
                    }
                  }}
                  className={`cursor-pointer p-2 border ${selectedRole === role._id ? "bg-blue-200" : "bg-gray-100"} rounded mb-2`}
                >
                  <span className="font-bold">{role.roleName?.charAt(0)}</span> {role.roleName}
                </div>
              ))
            ) : (
              <p>No roles available</p>
            )
          )}
        </div>

        {/* Permissions List */}
        <div className="w-2/3 bg-white p-4 shadow rounded ml-4">
          {selectedRole ? (
            <>
              <h3 className="text-lg font-semibold mb-3">
                {roles.find((role) => role._id === selectedRole)?.roleName}
              </h3>
              <label className="mr-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleAllCheckboxChange(e.target.checked)}
                />
                All
              </label>
              <div>
                {permissions === null ? (
                  <p>Assign permission for the role</p> // Message when no permissions found
                ) : (
                  ["warehouse", "role", "user", "product", "checkIn", "checkOut"].map((category) => (
                    <div key={category} className="mb-4">
                      <h4 className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                      {category === "checkIn" || category === "checkOut" ? (
                        <label className="mr-4">
                          <input
                            type="checkbox"
                            checked={permissions[category]?.[category === "checkIn" ? "checkin" : "checkout"] || false}
                            onChange={() => handleCheckboxChange(category, category === "checkIn" ? "checkin" : "checkout")}
                          />

                        </label>
                      ) : (
                        ["list", "create", "edit", "delete"].map((perm) => (
                          <label key={perm} className="mr-4">
                            <input
                              type="checkbox"
                              checked={permissions[category]?.[perm] || false}
                              onChange={() => handleCheckboxChange(category, perm)}
                            />
                            {perm.charAt(0).toUpperCase() + perm.slice(1)}
                          </label>
                        ))
                      )}
                    </div>
                  ))
                )}
                {permissions !== null && (
                  <div className="mb-4">
                    <h4 className="font-semibold">Activity Log</h4>
                    <label className="mr-4">
                      <input
                        type="checkbox"
                        checked={permissions["activityLog"]?.["assign"] || false}
                        onChange={() => handleCheckboxChange("activityLog", "assign")}
                      />
                      Assign
                    </label>
                  </div>
                )}
                {permissions !== null && (
                  <button
                    onClick={handleSubmit}
                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Select a role to view or edit permissions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
