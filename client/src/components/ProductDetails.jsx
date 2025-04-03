import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import axiosInstance from '../../axios';
import { Navigation } from 'swiper/modules';

const ProductDetails = () => {
    const { serialNumber } = useParams();
    const [product, setProduct] = useState(null);
    const swiperRef = useRef(null); // ✅ Swiper reference

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/products/${serialNumber}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details", error);
            }
        };
        if (serialNumber) {
            fetchProduct();
        }
    }, [serialNumber]);

    // ✅ Function to go to Next Slide
    const goToNextSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    // ✅ Function to go to Previous Slide
    const goToPrevSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="border rounded-lg p-4 bg-white shadow-md relative">
                <div className="absolute top-0 right-0 mt-14 mr-4 w-full lg:w-1/3 flex flex-col items-center">
                    {product.imageUrl && product.imageUrl.length > 0 ? (
                        <div className="w-full flex flex-col items-center">
                            {/* ✅ Swiper with ref */}
                            <Swiper
                                spaceBetween={10}
                                slidesPerView={1}
                                modules={[Navigation]}
                                onSwiper={(swiper) => (swiperRef.current = swiper)} // ✅ Store swiper instance
                                className="w-full"
                            >
                                {product.imageUrl.map((url, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={url} alt={`Product ${index + 1}`} className="max-w-full h-48 w-64 object-cover border rounded-lg shadow-lg m-1 ml-20" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* ✅ Custom Next & Previous Buttons */}
                            <div className="flex justify-between w-64 mt-2">
                                <button onClick={goToPrevSlide} className="bg-gray-800 text-white px-4 py-2 rounded-lg ml-2">{'<'}</button>
                                <button onClick={goToNextSlide} className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-1">{'>'}</button>
                            </div>
                        </div>
                    ) : (
                        <p>No images available</p>
                    )}
                </div>

                <div className="w-full lg:w-2/3 pr-4">
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Products details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><strong>Serial Number:</strong> {product.serialNumber}</div>
                        <div><strong>Device Size:</strong> {product.deviceSize}</div>
                        <div><strong>Model Number:</strong> {product.modelNumber}</div>
                        <div><strong>Graphics (GPU):</strong> {product.gpu}</div>
                        <div><strong>Identifier/Family:</strong> {product.identifierFamily}</div>
                        <div><strong>Storage Type:</strong> {product.storageType}</div>
                        <div><strong>Battery Capacity:</strong> {product.batteryCapacity}</div>
                        <div><strong>Find My Mac:</strong> {product.findMyMac}</div>
                        <div><strong>Top Case Grade:</strong> {product.topCaseGrade}</div>
                        <div><strong>Apple Care:</strong> {product.appleCare}</div>
                        <div><strong>MDM:</strong> {product.mdm}</div>
                        <div><strong>Marketplace:</strong> {product.marketplace}</div>
                        <div><strong>Year:</strong> {product.year}</div>
                        <div><strong>Device Type:</strong> {product.deviceType}</div>
                        <div><strong>EMC Number:</strong> {product.emcNumber}</div>
                        <div><strong>CPU (Processor):</strong> {product.cpu}</div>
                        <div><strong>Memory:</strong> {product.memory}</div>
                        <div><strong>Storage Size:</strong> {product.storageSize}</div>
                        <div><strong>Battery Cycles:</strong> {product.batteryCycles}</div>
                        <div><strong>Full Unit Grade:</strong> {product.fullUnitGrade}</div>
                        <div><strong>LCD Grade:</strong> {product.lcdGrade}</div>
                        <div><strong>Apple Care Years:</strong> {product.appleCareYears}</div>
                        <div><strong>Created by:</strong> {product.createdBy}</div>
                        <div><strong>Source:</strong> {product.source}</div>
                    </div>
                    <hr className="my-6 border-t-2 border-gray-300" />
                    <h3 className="text-xl font-semibold mb-2 border-b pb-2">Technical Check</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><strong>Track Pad:</strong> {product.techCheck?.trackPad ?? 'N/A'}</div>
                        <div><strong>Keyboards:</strong> {product.techCheck?.keyboards ?? 'N/A'}</div>
                        <div><strong>LCD/Ghost/Peel:</strong> {product.techCheck?.lcdGhostPeel ?? 'N/A'}</div>
                        <div><strong>Sound/Headphone Jack:</strong> {product.techCheck?.soundHeadphoneJack ?? 'N/A'}</div>
                        <div><strong>Microphone:</strong> {product.techCheck?.microphone ?? 'N/A'}</div>
                        <div><strong>USB Ports:</strong> {product.techCheck?.usbPorts ?? 'N/A'}</div>
                        <div><strong>Bluetooth/Wi-Fi:</strong> {product.techCheck?.bluetoothWifi ?? 'N/A'}</div>
                        <div><strong>Camera/FaceTime:</strong> {product.techCheck?.cameraFacetime ?? 'N/A'}</div>
                    </div>
                    <hr className="my-6 border-t-2 border-gray-300" />
                    <h3 className="text-xl font-semibold mt-6 mb-2 border-b pb-2">Notes</h3>
                    <p>{product.notes ?? 'N/A'}</p>
                    <h3 className="text-xl font-semibold mt-6 mb-2 border-b pb-2">Technical Notes</h3>
                    <p>{product.technicalNotes ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
