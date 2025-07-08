import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const baseURL = import.meta.env.VITE_API_IMAGE;

/**
 * Fetches settled deals (accepted offers) for the *owner* side.
 * Call with enabled=false to skip the request.
 */
export default function useDeals(enabled = true) {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('/deals');

                if (cancelled) return;

                const mapped = (Array.isArray(data) ? data : []).map((d) => ({
                    id: d.id,
                    projectId: d.business_id,
                    amount: Number(d.final_amount),
                    equity: Number(d.final_percentage),
                    date: d.deal_date,
                    status: d.status,                       // active / closed / …
                    project: {
                        id: d.business.id,
                        title: d.business.business_name,
                        img: d.business.business_photo
                            ? `${baseURL}storage/${d.business.business_photo}`
                            : null,
                        category: d.business.category?.slug ?? 'misc',
                    },
                }));

                setDeals(mapped);
            } catch (err) {
                if (!cancelled) {
                    setError(err.response?.data?.message ?? 'Could not load deals');
                    console.error(err);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [enabled]);

    return { deals, loading, error };
}
