import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

export default function useCategories() {
    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axiosInstance.get('/categories');     // <-- correct path
            return res.data;
        },
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 60 * 24,
        retry: 1,
    });

    return {
        categories: data,
        loading: isLoading,
        error: isError ? (error?.message ?? 'Failed to load categories') : null,
    };
}
