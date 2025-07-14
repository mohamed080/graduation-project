import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/startups';
import { slugify } from '../../utils/slugify';
import styles from './Watchlist.module.css';
import { AiOutlineDelete } from 'react-icons/ai';

const Watchlist = () => {
    const [editMode, setEditMode] = useState(false);
    const [watchList, setWatchList] = useState([]);
    const [watchListedProjects, setWatchListedProjects] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadWatchList(); // Call this to load data on mount
    }, []);

    const loadWatchList = () => {
        const list = JSON.parse(localStorage.getItem('watchList') || '[]');
        setWatchList(list);
        // Filter projects that are in watchlist
        const watchedProjects = projects.filter(project =>
            list.includes(slugify(project.title))
        );
        setWatchListedProjects(watchedProjects);
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const removeFromWatchlist = (slug) => {
        const updatedList = watchList.filter(item => item !== slug);
        localStorage.setItem('watchList', JSON.stringify(updatedList));
        loadWatchList(); // Reload after removal

        // If last item was removed, exit edit mode
        if (updatedList.length === 0) {
            setEditMode(false);
        }
    };
    


    return (
        <div className={styles.watchlist}>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className={styles.title}>Your Watchlist</h1>

                    {watchListedProjects.length > 0 && (
                        <button
                            onClick={toggleEditMode}
                            className={`${styles.editBtn} ${editMode ? styles.editModeActive : ''}`}
                        >
                            {editMode ? 'Done' : 'Edit'}
                        </button>
                    )}
                </div>

                {watchListedProjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>You haven't added any projects to your watchlist yet.</p>
                        <Link to="/explore" className={styles.exploreBtn}>
                            Browse Projects
                        </Link>
                    </div>
                ) : (
                    <div className={styles.projectsGrid}>
                        {watchListedProjects.map(project => {
                            const slug = slugify(project.title);
                            return (
                                <div key={project.id} className={styles.projectCard}>
                                    {editMode && (
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => removeFromWatchlist(slug)}
                                            aria-label={`Remove ${project.title} from watchlist`}
                                        >
                                            <AiOutlineDelete size={20} />
                                        </button>
                                    )}

                                    <Link to={`/offering/${slug}`} className={styles.cardLink}>
                                        <div className={styles.cardImage}>
                                            <img src={project.img} alt={project.title} />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.projectTitle}>{project.title}</h3>
                                            <p className={styles.projectDesc}>
                                                {project.desc?.substring(0, 100)}...
                                            </p>
                                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
                                            </svg>
                                            <div className='d-flex justify-content-between mt-3'>
                                                <div className='d-flex flex-column gap-0'>
                                                    <h4>{project.raised}</h4>
                                                    <p className={styles.raised}>Raised</p>
                                                </div>
                                                <div className='d-flex flex-column'>
                                                    <h4>{project.minInvestment}</h4>
                                                    <p className={styles.raised}>Min Investment</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Watchlist;