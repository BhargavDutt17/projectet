import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const userId = localStorage.getItem("id");

    useEffect(() => {
        if (!userId) {
            setError("User ID not found in local storage");
            setLoading(false);
            return;
        }

        const fetchAds = async () => {
            try {
                const incomeResponse = await axios.get(`/ads/income/${userId}`);
                const expenseResponse = await axios.get(`/ads/expense/${userId}`);

                if (incomeResponse.status !== 200 || expenseResponse.status !== 200) {
                    throw new Error("Failed to fetch ads");
                }

                setAds([...incomeResponse.data, ...expenseResponse.data]);
            } catch (err) {
                console.error("Error fetching ads:", err);
                setError("Failed to load ads. Check console for details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [userId]);

    if (loading) return <p className="text-center text-lg">Loading ads...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-950 rounded-lg shadow-lg">
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-800 hover:to-purple-900 
          text-violet-200 font-bold p-3 rounded-lg shadow-md"
            >
                <span className="text-lg font-semibold">Finacial Tips</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Ad List */}
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full">
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
