import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { slugify } from '../utils/slugify';
import fallbackImg from '../assets/bg.jpg';

const baseURL = import.meta.env.VITE_API_IMAGE;

// helper that converts API → UI shape
const mapBusiness = b => ({
    id: b.id,
    title: b.business_name,
    slug: slugify(b.business_name),
    img: b.business_photo ? `${baseURL}storage/${b.business_photo}` : fallbackImg,
    category: b.category?.slug ?? 'misc',
    status: b.status,
    desc: b.description,
    raised: `$${(+b.money_needed).toLocaleString()}`,
    minInvestment: `$${(+b.money_needed * 0.9).toLocaleString()}`,
    equityOffered: +b.percentage_offered,
    amountRequested: +b.money_needed,
    ownerID: b.user_id,
});

export default function useBusinessesInfinite(perPage = 12) {
    return useInfiniteQuery({
        queryKey: ['businessesInfinite', perPage],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await axiosInstance.get('/businesses', {
                params: { page: pageParam, per_page: perPage },
            });

            return {
                projects: data.data.map(mapBusiness),
                nextPage: data.next_page_url ? pageParam + 1 : undefined,
                total: data.total,
            };
        },
        getNextPageParam: lastPage => lastPage.nextPage,
        staleTime: 5 * 60_000,         
        keepPreviousData: true,
    });
}
