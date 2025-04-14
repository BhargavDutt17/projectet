import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { showToast } from "../Custom/ToastUtil";
import CustomLoader from "../Custom/CustomLoader";

export const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const userId = localStorage.getItem("id");

    // Use useRef to track whether a toast has been shown
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!userId) {
            if (!toastShownRef.current) {
                showToast("User ID not found in local storage", "error");
                toastShownRef.current = true; // Set toastShownRef to true after showing the toast
            }
            setLoading(false);
            return;
        }

        const fetchAds = async () => {
            setLoading(true);
            try {
                const incomeResponse = await axios.get(`/ads/income/${userId}`);
                const expenseResponse = await axios.get(`/ads/expense/${userId}`);

                const combinedAds = [
                    ...(incomeResponse.data || []),
                    ...(expenseResponse.data || [])
                ];

                if (combinedAds.length === 0) {
                    if (!toastShownRef.current) {
                        showToast("No financial tips available because there are no transactions.", "info");
                        toastShownRef.current = true; // Set toastShownRef to true after showing the toast
                    }
                } else {
                    setAds(combinedAds);
                }
            } catch (err) {
                console.error("Error fetching ads:", err);

                const errorMessage =
                    err.response?.data?.message ||
                    "Failed to load financial tips";

                // Only show the toast if one hasn't been shown yet
                if (!toastShownRef.current) {
                    showToast(errorMessage, "error");
                    toastShownRef.current = true; // Set toastShownRef to true after showing the toast
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [userId]); // Ensure this effect only depends on userId

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-950 rounded-lg shadow-lg">
            {loading && <CustomLoader />}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 hover:to-purple-900 
                text-violet-200 font-bold p-3 rounded-lg shadow-md"
            >
                <span className="text-lg font-semibold">Financial Tips</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full">
                   {!ads.length && !loading && (
    <div className="flex justify-center items-center w-full col-span-2 h-60"> 
        {/* col-span-2: spans the full width across both grid columns */}
        <p className="text-center text-gray-500 mb-4">No financial tips available at the moment.</p>
    </div>
)}


                    {ads.map((ad, index) => (
                        <a
                            key={index}
                            href={`https://www.google.com/search?q=${ad.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="p-6 bg-white dark:bg-slate-700 rounded-xl shadow-lg w-full h-60 transition-transform transform hover:scale-105">
                                {ad.image_url ? (
                                    <img
                                        src={ad.image_url}
                                        alt={ad.title}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                ) : (
                                    <p className="text-center text-gray-500">No image available</p>
                                )}
                                <h2 className="text-xl font-semibold mt-3">{ad.title}</h2>
                                <p className="text-gray-700 text-sm mt-1">{ad.message}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdList;
