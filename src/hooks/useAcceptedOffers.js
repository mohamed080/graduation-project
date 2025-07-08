import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";



export default function useAcceptedOffers({ currentUserId }) {
    const [investments, setInvestments] = useState ([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState (null);

    useEffect(() => {
        if (!currentUserId) return;                 // guard for first render

        (async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get("/my-offers");

                const accepted = (Array.isArray(data) ? data : []).filter(
                    (o) => o.status === "accepted" && o.investor_id === currentUserId
                );

                setInvestments(
                    accepted.map((o) => ({
                        id: o.id,
                        projectId: o.business_id,
                        amount: Number(o.offered_amount),
                        equity: Number(o.requested_percentage),
                        date: o.created_at,
                    }))
                );
            } catch (err) {
                setError(err.response?.data?.message ?? "Failed to load offers");
            } finally {
                setLoading(false);
            }
        })();
    }, [currentUserId]);

    return { investments, loading, error };
}
