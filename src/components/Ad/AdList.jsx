import { useEffect, useState } from "react";
import axios from "axios";

export const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("id"); // 🔹 Fetch user ID from local storage

    useEffect(() => {
        console.log("Fetched User ID:", userId); // Debugging line

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

    if (loading) return <p>Loading ads...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {ads.map((ad, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-bold">{ad.title}</h2>
                    <p className="text-gray-600">{ad.message}</p>
                </div>
            ))}
        </div>
    );
};

export default AdList;
