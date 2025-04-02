import React, { useEffect, useState } from "react";
import axios from "axios";

const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("Id"); // ✅ Fetch userId from local storage

    useEffect(() => {
        const fetchAds = async () => {
            if (!userId) return; // ✅ Prevent API call if userId is null

            try {
                const response = await axios.get(`/ads/${userId}`); // ✅ Use fetched userId
                setAds(response.data);
            } catch (error) {
                console.error("Error fetching ads:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [userId]); // ✅ Depend on userId

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-3">Financial Insights</h2>
            {loading ? (
                <p>Loading ads...</p>
            ) : ads.length > 0 ? (
                <div className="row">
                    {ads.map((ad, index) => (
                        <div key={index} className="col-md-6 mb-3">
                            <div className="card shadow-sm p-3">
                                <h5 className="text-primary">{ad.title}</h5>
                                <p>{ad.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No financial insights available.</p>
            )}
        </div>
    );
};

export default AdList;