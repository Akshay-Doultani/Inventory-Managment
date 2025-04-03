import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axios';
import { ChevronDownIcon } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { UserContext } from '../context/UserContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const { serialNumber } = useParams();
    const { currentUser } = useContext(UserContext); // Get the current user from UserContext
    const [openSections, setOpenSections] = useState(new Set());
    const [devices, setDevices] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewImages, setPreviewImages] = useState([]); // State for preview images
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        serialNumber: "",
        year: "",
        deviceSize: "",
        deviceType: "",
        emcNumber: "",
        cpu: "",
        gpu: "",
        modelNumber: "",
        identifier: "",
        memory: "",
        storageType: "",
        batteryCapacity: "",
        batteryCycles: "",
        storageSize: "",
        source: "",
        warehouse: "",
        marketplace: "",
        status: "",
        imageUrl: [],
        cloudinaryId: [],
        fullUnitGrade: "",
        topCaseGrade: "",
        lcdGrade: "",
        notes: "",
        technicalNotes: "",
        technicalCheck: {
            trackPad: false,
            keyboard: false,
            lcdGhostPeel: false,
            soundHeadphoneJack: false,
            microphone: false,
            usbPorts: false,
            bluetoothWifi: false,
            cameraFaceTime: false,
            findMyMac: "",
            mdm: "",
            appleCare: ""
        },
        createdBy: currentUser ? currentUser.username : "" // Include the current username
    });

    const checkInPermission = currentUser?.permissions?.[0]?.permissions?.checkIn || {};

    useEffect(() => {
        if (serialNumber) {
            const fetchProductDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/products/${serialNumber}`);
                    const productData = response.data;
                    setFormData(productData);
                    setPreviewImages(productData.imageUrl);
                } catch (error) {
                    console.error("Error fetching product details:", error);
                }
            };

            fetchProductDetails();
        }
    }, [serialNumber]);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axiosInstance.get("/warehouses");
                if (Array.isArray(response.data)) {
                    setWarehouses(response.data);
                } else {
                    console.log("Unexpected response format:", response.data);
                    setWarehouses([]);
                }
            } catch (error) {
                console.error("Error fetching warehouses:", error);
                setWarehouses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouses();
    }, []);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axiosInstance.get("/devices");
                if (Array.isArray(response.data)) {
                    setDevices(response.data);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setDevices([]);
                }
            } catch (error) {
                console.error("Error fetching devices:", error);
                setDevices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    const toggleSection = (section) => {
        setOpenSections((prevOpenSections) => {
            const newOpenSections = new Set(prevOpenSections);
            if (newOpenSections.has(section)) {
                newOpenSections.delete(section);
            } else {
                newOpenSections.add(section);
            }
            return newOpenSections;
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name in formData.technicalCheck) {
            setFormData({
                ...formData,
                technicalCheck: {
                    ...formData.technicalCheck,
                    [name]: type === "checkbox" ? checked : value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const imageUpload = async (e) => {
        const files = Array.from(e.target.files);

        const uploadedImages = [];
        const uploadedPreviews = [];

        for (const file of files) {
            try {
                const formDataImage = new FormData();
                formDataImage.append("file", file);
                formDataImage.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                formDataImage.append("folder", "userdetails");

                const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
                    method: "POST",
                    body: formDataImage,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(`Cloudinary error: ${data.error.message}`);
                }

                uploadedImages.push({ url: data.secure_url, cloudinaryId: data.public_id });
                uploadedPreviews.push(data.secure_url);
            } catch (error) {
                console.error("Image upload failed:", error);
            }
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrl: [...prevFormData.imageUrl, ...uploadedImages.map(image => image.url)],
            cloudinaryId: [...prevFormData.cloudinaryId, ...uploadedImages.map(image => image.cloudinaryId)],
        }));

        setPreviewImages((prevPreviewImages) => [...prevPreviewImages, ...uploadedPreviews]);
    };

    const removeImage = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrl: prevFormData.imageUrl.filter((_, i) => i !== index),
            cloudinaryId: prevFormData.cloudinaryId.filter((_, i) => i !== index),
        }));
        setPreviewImages((prevPreviewImages) => prevPreviewImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting the following form data:", formData);

        try {
            if (serialNumber) {
                // Update the existing product
                const response = await axiosInstance.put(`/products?serialNumber=${serialNumber}`, formData);
                console.log("Product updated:", response.data);
                alert("Product updated successfully!");
            } else {
                // Create a new product
                const response = await axiosInstance.post("/products", formData);
                console.log("Product added:", response.data);
                alert("Product added successfully!");
            }

            setFormData({
                serialNumber: "",
                year: "",
                deviceSize: "",
                deviceType: "",
                emcNumber: "",
                cpu: "",
                gpu: "",
                modelNumber: "",
                identifier: "",
                memory: "",
                storageType: "",
                batteryCapacity: "",
                batteryCycles: "",
                storageSize: "",
                source: "",
                warehouse: "",
                marketplace: "",
                status: "",
                imageUrl: [],
                cloudinaryId: [],
                fullUnitGrade: "",
                topCaseGrade: "",
                lcdGrade: "",
                notes: "",
                technicalNotes: "",
                technicalCheck: {
                    trackPad: false,
                    keyboard: false,
                    lcdGhostPeel: false,
                    soundHeadphoneJack: false,
                    microphone: false,
                    usbPorts: false,
                    bluetoothWifi: false,
                    cameraFaceTime: false,
                    findMyMac: "",
                    mdm: "",
                    appleCare: "",
                },
                createdBy: currentUser ? currentUser.username : "" // Include the current username
            });

            setPreviewImages([]); // Reset the preview images
            navigate('/products');
        } catch (error) {
            console.error("Error submitting product:", error);
            alert(`Error ${serialNumber ? "updating" : "adding"} product. Please try again.`);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{serialNumber ? "Edit Product" : "Add Product"}</h2>

            {/* Product Information */}
            <div className="mb-3 border rounded-lg overflow-hidden">
                <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-gray-100"
                    onClick={() => toggleSection("productInfo")}
                >
                    <span className="flex items-center gap-2">ℹ️ Product Information</span>
                    <ChevronDownIcon
                        className={`w-5 h-5 transition-transform ${openSections.has("productInfo") ? "rotate-180" : ""}`}
                    />
                </button>
                {openSections.has("productInfo") && (
                    <div className="p-4 border-t bg-white grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="serialNumber"
                            placeholder="Serial Number"
                            value={formData.serialNumber}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="year"
                            placeholder="Year"
                            value={formData.year}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <select
                            name="deviceSize"
                            value={formData.deviceSize}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Device Size</option>
                            <option value="N/A">N/A</option>
                            <option value="11 inch">11 inch</option>
                            <option value="12 inch">12 inch</option>
                            <option value="13 inch">13 inch</option>
                            <option value="14 inch">14 inch</option>
                            <option value="15 inch">15 inch</option>
                            <option value="16 inch">16 inch</option>
                            <option value="17 inch">17 inch</option>
                            <option value="18 inch">18 inch</option>
                            <option value="19 inch">19 inch</option>
                            <option value="20 inch">20 inch</option>
                            <option value="21 inch">21 inch</option>
                            <option value="22 inch">22 inch</option>
                            <option value="23 inch">23 inch</option>
                            <option value="24 inch">24 inch</option>
                            <option value="25 inch">25 inch</option>
                            <option value="26 inch">26 inch</option>
                            <option value="27 inch">27 inch</option>
                        </select>
                        <select
                            name="deviceType"
                            value={formData.deviceType}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Type</option>
                            {loading ? (
                                <option>Loading...</option>
                            ) : (
                                devices.map((device) => (
                                    <option key={device._id} value={device.name}>
                                        {device.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <input
                            type="text"
                            name="emcNumber"
                            placeholder="EMC Number"
                            value={formData.emcNumber}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="cpu"
                            placeholder="CPU (Processor)"
                            value={formData.cpu}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="gpu"
                            placeholder="Graphics (GPU)"
                            value={formData.gpu}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="modelNumber"
                            placeholder="Model Number"
                            value={formData.modelNumber}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="identifier"
                            placeholder="Identifier/Family"
                            value={formData.identifier}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="memory"
                            placeholder="Memory (GB)"
                            value={formData.memory}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <div>
                            <label className="block mb-1">Storage Type</label>
                            <div className="flex gap-2">
                                <label><input type="radio" name="storageType" value="HDD" checked={formData.storageType === "HDD"} onChange={handleChange} /> HDD</label>
                                <label><input type="radio" name="storageType" value="SSD" checked={formData.storageType === "SSD"} onChange={handleChange} /> SSD</label>
                                <label><input type="radio" name="storageType" value="Fusion" checked={formData.storageType === "Fusion"} onChange={handleChange} /> Fusion</label>
                                <label><input type="radio" name="storageType" value="No-Drive" checked={formData.storageType === "No-Drive"} onChange={handleChange} /> No-Drive</label>
                            </div>
                        </div>
                        <input
                            type="text"
                            name="batteryCapacity"
                            placeholder="Battery Capacity (%)"
                            value={formData.batteryCapacity}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="batteryCycles"
                            placeholder="Battery Cycles"
                            value={formData.batteryCycles}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <select
                            name="storageSize"
                            value={formData.storageSize}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Storage Size</option>
                            <option value="N/A">N/A</option>
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                            <option value="1TB">1TB</option>
                            <option value="2TB">2TB</option>
                            <option value="4TB">4TB</option>
                        </select>
                        <select
                            name="warehouse"
                            value={formData.warehouse}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Warehouse</option>
                            {loading ? (
                                <option>Loading...</option>
                            ) : (
                                warehouses.map((warehouse) => (
                                    <option key={warehouse._id} value={warehouse.name}>
                                        {warehouse.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <input
                            type="text"
                            name="marketplace"
                            placeholder="Marketplace"
                            value={formData.marketplace}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="source"
                            placeholder="Source"
                            value={formData.source}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Status</option>
                            <option value="N/A">N/A</option>
                            <option value="checkin">Checked-in</option>
                            <option value="checkedout">Checked-out</option>
                        </select>
                        <div className="col-span-3 border-dashed border-2 p-6 text-center relative w-full">
                            <input type="file" onChange={imageUpload} className="hidden" id="imageUpload" multiple />
                            <label htmlFor="imageUpload" className="text-blue-500 cursor-pointer block">
                                Drag & drop your images here or Click
                            </label>
                            <div className="mt-4 w-full overflow-auto">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {previewImages.map((previewImage, index) => (
                                        <div key={index} className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 border rounded-lg shadow-md overflow-hidden flex items-center justify-center bg-gray-100">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Notes */}
            <div className="mb-3 border rounded-lg overflow-hidden">
                <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-gray-100"
                    onClick={() => toggleSection("notes")}
                >
                    <span className="flex items-center gap-2">📄 Notes</span>
                    <ChevronDownIcon
                        className={`w-5 h-5 transition-transform ${openSections.has("notes") ? "rotate-180" : ""}`}
                    />
                </button>
                {openSections.has("notes") && (
                    <div className="p-4 border-t bg-white">
                        <div className="mb-4">
                            <label className="block mb-2">Full Unit Grade</label>
                            <div className="space-x-2">
                                <label><input type="radio" name="fullUnitGrade" value="A" checked={formData.fullUnitGrade === "A"} onChange={handleChange} /> A</label>
                                <label><input type="radio" name="fullUnitGrade" value="B" checked={formData.fullUnitGrade === "B"} onChange={handleChange} /> B</label>
                                <label><input type="radio" name="fullUnitGrade" value="C" checked={formData.fullUnitGrade === "C"} onChange={handleChange} /> C</label>
                                <label><input type="radio" name="fullUnitGrade" value="F" checked={formData.fullUnitGrade === "F"} onChange={handleChange} /> F</label>
                            </div>
                        </div>
                        {/* Top Case Grade */}
                        <div className="mb-4">
                            <label className="block mb-2">Top Case Grade</label>
                            <div className="space-x-2">
                                <label><input type="radio" name="topCaseGrade" value="A" checked={formData.topCaseGrade === "A"} onChange={handleChange} /> A</label>
                                <label><input type="radio" name="topCaseGrade" value="B" checked={formData.topCaseGrade === "B"} onChange={handleChange} /> B</label>
                                <label><input type="radio" name="topCaseGrade" value="C" checked={formData.topCaseGrade === "C"} onChange={handleChange} /> C</label>
                                <label><input type="radio" name="topCaseGrade" value="F" checked={formData.topCaseGrade === "F"} onChange={handleChange} /> F</label>
                            </div>
                        </div>
                        {/* LCD Grade */}
                        <div className="mb-4">
                            <label className="block mb-2">LCD Grade</label>
                            <div className="space-x-2">
                                <label><input type="radio" name="lcdGrade" value="A" checked={formData.lcdGrade === "A"} onChange={handleChange} /> A</label>
                                <label><input type="radio" name="lcdGrade" value="B" checked={formData.lcdGrade === "B"} onChange={handleChange} /> B</label>
                                <label><input type="radio" name="lcdGrade" value="C" checked={formData.lcdGrade === "C"} onChange={handleChange} /> C</label>
                                <label><input type="radio" name="lcdGrade" value="F" checked={formData.lcdGrade === "F"} onChange={handleChange} /> F</label>
                            </div>
                        </div>
                        {/* Notes */}
                        <div className="mb-4">
                            <label htmlFor="notes" className="block mb-2">Notes</label>
                            <textarea id="notes" name="notes" className="w-full h-24 p-2 border" value={formData.notes} onChange={handleChange}></textarea>
                        </div>
                        {/* Technical Notes */}
                        <div className="mb-4">
                            <label htmlFor="technicalNotes" className="block mb-2">Technical Notes</label>
                            <textarea id="technicalNotes" name="technicalNotes" className="w-full h-24 p-2 border" value={formData.technicalNotes} onChange={handleChange}></textarea>
                        </div>
                    </div>
                )}
            </div>

            {/* Technical Check */}
            <div className="mb-3 border rounded-lg overflow-hidden">
                <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-gray-100"
                    onClick={() => toggleSection("technicalCheck")}
                >
                    <span className="flex items-center gap-2">⚙️ Technical Check</span>
                    <ChevronDownIcon
                        className={`w-5 h-5 transition-transform ${openSections.has("technicalCheck") ? "rotate-180" : ""}`}
                    />
                </button>
                {openSections.has("technicalCheck") && (
                    <div className="p-4 border-t bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "trackPad", label: "Track Pad" },
                                { name: "keyboard", label: "Keyboard" },
                                { name: "lcdGhostPeel", label: "LCD/Ghost/Peel" },
                                { name: "soundHeadphoneJack", label: "Sound/Headphone Jack" },
                                { name: "microphone", label: "Microphone" },
                                { name: "usbPorts", label: "USB Ports" },
                                { name: "bluetoothWifi", label: "Bluetooth/Wi-Fi" },
                                { name: "cameraFaceTime", label: "Camera/FaceTime" },
                            ].map(({ name, label }) => (
                                <div key={name}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={formData.technicalCheck?.[name] || false}
                                            onChange={handleChange}
                                        />
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {[
                            { name: "findMyMac", label: "Find My Mac", options: ["ON", "OFF"] },
                            { name: "mdm", label: "MDM", options: ["YES", "NO"] },
                            { name: "appleCare", label: "Apple Care", options: ["YES", "NO"] },
                        ].map(({ name, label, options }) => (
                            <div className="mt-4" key={name}>
                                <label className="block">{label}</label>
                                <div className="flex items-center gap-4">
                                    {options.map((option) => (
                                        <label key={option}>
                                            <input
                                                type="radio"
                                                name={name}
                                                value={option}
                                                checked={formData?.technicalCheck?.[name] === option}
                                                onChange={handleChange}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {checkInPermission.checkin && (
                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-400 to-red-400 text-white rounded-md">
                        {serialNumber ? "Update Product" : "Add Product"}
                    </button>
                </div>
            )}
        </form>
    );
};

export default CreateProduct;
