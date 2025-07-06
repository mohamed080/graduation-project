// hooks/useBusinesses.js
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { slugify } from "../utils/slugify";
import img from '../assets/bg.jpg'

export default function useBusinesses(page = 1, perPage = 12) {
    const [projects, setProjects] = useState([]); // mapped objects
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState({}); // pagination info
const baseURL = import.meta.env.VITE_API_IMAGE;

    useEffect(() => {
        let mounted = true;

        async function fetchPage() {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get("/businesses", {
                    params: { page, per_page: perPage },
                });

                if (!mounted) return;

                /* ------------  map API shape → UI shape  ------------ */
                const mapped = data.data.map((b) => ({
                    id: b.id,
                    title: b.business_name,
                    slug: slugify(b.business_name),
                    img: b.business_photo
                        ? `${baseURL}storage/${b.business_photo}`   // real file
                        : img,
                    raised: `$${Number(b.money_needed).toLocaleString()}`,
                    minInvestment: `$${Number(b.money_needed * 0.9).toLocaleString()}`,
                    category: b.category?.slug ?? "misc",
                    status: b.status,
                    desc: b.description,
                    period: 0,
                    equityOffered: Number(b.percentage_offered),
                    amountRequested: Number(b.money_needed),
                    ownerID: b.user_id,
                }));

                setProjects(mapped);
                setMeta({
                    current: data.current_page,
                    last: data.last_page,
                });
            } catch (err) {
                if (mounted) setError("Could not load businesses");
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchPage();
        return () => {
            mounted = false;
        };
    }, [page, perPage]);

    return { projects, loading, error, meta };
}
