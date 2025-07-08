import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import useBusinessesInfinite from '../../hooks/useBusinessesInfinite';
import styles from './Hero.module.css';   // reuse
import useIntersection from '../../hooks/useIntersection';
import { useEffect } from 'react';

export default function AllStartups({ searchParams }) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        error,
    } = useBusinessesInfinite();

    const projects = data ? data.pages.flatMap(p => p.projects) : [];
    const { ref: sentinelRef, inView } = useIntersection();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (error) return <p className="text-danger">Failed to load startups.</p>;

    return (
        <div className="row mb-5" id="top">
            <h3 className={styles.heroTitle}>
                {projects.length} Currently Raising
            </h3>

            {projects.map(p => (
                <div className="col-12 col-sm-6 col-md-4 mb-5" key={p.id}>
                    <Link
                        to={{
                            pathname: `/offering/${slugify(p.title)}`,
                            search: searchParams.toString(),       // keep ?startups=all
                        }}
                        className={styles.projectCard}
                    >
                        <div className="img-container">
                            <img src={p.img} alt="" className={styles.projectImg} />
                        </div>

                        <h3>{p.title}</h3>
                        <p className={styles.desc}>{p.desc.split(' ').slice(0, 9).join(' ')}…</p>

                        <div className={styles.projectDetails}>
                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="d-flex flex-column gap-0">
                                    <h4>{p.raised}</h4><p>Raised</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <h4>{p.minInvestment}</h4><p>Min Investment</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {/* ------------------------------------------------------------------ */}
            {hasNextPage && (
                <div className="text-center">
                    <div ref={sentinelRef} style={{ height: 1 }} />

                    <button
                        className={styles.moreProjectsBtn}
                        disabled={isFetchingNextPage}
                        onClick={fetchNextPage}
                        style={{ visibility: isFetchingNextPage ? 'hidden' : 'visible' }}
                    >
                        {isFetchingNextPage ? 'Loading…' : 'Show More'}
                    </button>
                </div>
            )
            }

            {isFetching && !projects.length && <p>Loading…</p>}
        </div >
    );
}
