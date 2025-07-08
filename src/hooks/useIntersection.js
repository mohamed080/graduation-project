import { useEffect, useRef, useState } from 'react';

export default function useIntersection(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin: '200px', threshold: 0, ...options }
        );
        io.observe(ref.current);

        return () => io.disconnect();
    }, [options]);

    return { ref, inView };
}
