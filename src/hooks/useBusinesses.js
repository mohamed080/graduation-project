// hooks/useBusinesses.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { slugify } from "../utils/slugify";
import img from '../assets/bg.jpg';

const baseURL = import.meta.env.VITE_API_IMAGE;

export default function useBusinesses(page = 1, perPage = 12) {
    const queryKey = ['businesses', page, perPage];

    const queryFn = async () => {
        const { data } = await axiosInstance.get("/businesses", {
            params: { page, per_page: perPage },
        });

        const getStableRiskRate = (id) => {
            const key = `riskRate-${id}`;
            const stored = localStorage.getItem(key);
            if (stored) return Number(stored);
            const rate = Math.floor(Math.random() * 71) + 20; // 20–90 range
            localStorage.setItem(key, rate);
            return rate;
        };

        const projects = data.data.map((b) => ({
            id: b.id,
            title: b.business_name,
            slug: slugify(b.business_name),
            img: b.business_photo
                ? `${baseURL}storage/${b.business_photo}`
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
            location: b.location,
            valuation: b.valuation,
            founded_year: b.founded_year,
            target_market: b.target_market,
            employees_count: b.employees_count,
            competitive_advantages: b.competitive_advantages,
            riskRate: getStableRiskRate(b.id),
        }));

        return {
            projects,
            meta: {
                current: data.current_page,
                last: data.last_page,
            }
        };
    };

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey,
        queryFn,
        keepPreviousData: true, // Smooth pagination UX
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        retry: 2, // Retry twice on failure
    });

    return {
        projects: data?.projects || [],
        loading: isLoading,
        error: isError ? "Could not load businesses" : null,
        meta: data?.meta || { current: 0, last: 0 },
        refetch,
    };
}