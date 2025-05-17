import React, { useEffect, useState } from 'react'
import styles from './Hero.module.css'
import { Link, useSearchParams } from 'react-router-dom'
import ProjectSlider from './ProjectSlider';
import { projects } from '../../data/startups';


const Hero = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [searchParams] = useSearchParams();
    const showAllStartups = searchParams.get('startups') === 'all';
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [showAllStartups]);
    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance' },
        { value: 'education', label: 'Education' },
    ];

    const statuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' },
        { value: 'pending', label: 'Pending' },
    ];

    const filteredProjects = projects.filter((project) => {
        return (
            (category === 'all' || project.category === category) &&
            (status === 'all' || project.status === status)
        );
    });
    return (
        <div className={styles.hero}>
            <div className="container">
                {showAllStartups ? (
                    <div className="row mb-5" id='top'>
                        <h3 className={styles.heroTitle}>{projects.length} Currently Raising</h3>
                        {projects.map((project) => (
                            <div className="col-12 col-sm-6 col-md-4 mb-5" key={project.id}>
                                <div className={styles.projectCard}>
                                    <div className="img-container">
                                        <img
                                            src={project.img}
                                            alt="Thumbnail"
                                            className={styles.projectImg}
                                        />
                                    </div>
                                    <h3>{project.title}</h3>
                                    <div className={styles.projectDetails}>
                                        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                        <div className='d-flex justify-content-between mt-3'>
                                            <div className='d-flex flex-column gap-0'>
                                                <h4>{project.raised}</h4>
                                                <p>Raised</p>
                                            </div>
                                            <div className='d-flex flex-column'>
                                                <h4>{project.minInvestment}</h4>
                                                <p>Min Investment</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <>
                    <div className={styles.heroText}>
                        <h1>RAISE YOUR ROUND WITH THE BEST</h1>
                        <h5>Join 1,000 founders who've successfully raised capital on FundX.</h5>
                        <Link to='#'>
                            <button className={styles.heroBtn}>Apply Now</button>
                        </Link>
                    </div>
                    <div className={styles.heroBtns}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                            onClick={() => handleTabClick('overview')}
                        >
                            OVERVIEW
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'news' ? styles.active : ''}`}
                            onClick={() => handleTabClick('news')}
                        >
                            NEWS
                        </button>
                    </div>
                    <div className={styles.tabContent}>
                        {activeTab === 'overview' && (
                            <div className={styles.overviewContent}>
                                <div className={styles.dropdowns}>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className={styles.dropdown}
                                        aria-label="Select Category"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className={styles.dropdown}
                                        aria-label="Sort by Status"
                                    >
                                        {statuses.map((stat) => (
                                            <option key={stat.value} value={stat.value}>
                                                {stat.label}
                                            </option>
                                        ))}
                                    </select>

                                    {(category !== 'all' || status !== 'all') && (
                                        <button
                                            className={styles.resetButton}
                                            onClick={() => {
                                                setCategory('all');
                                                setStatus('all');
                                            }}
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                {/* Conditionally render either the slider or the filtered grid */}
                                {category === 'all' && status === 'all' ? (
                                    <ProjectSlider />
                                ) : (
                                    <div className="row mt-4">
                                        {filteredProjects.length > 0 && <h3 className={` my-5 ${styles.heroTitle}`}>{filteredProjects.length} Currently Raising</h3>}
                                        {filteredProjects.length > 0 ? (
                                            filteredProjects.map((project) => (
                                                <div className="col-12 col-sm-6 col-md-4 mb-5" key={project.id}>
                                                    <div className={styles.projectCard}>
                                                        <div className="img-container">
                                                            <img
                                                                src={project.img}
                                                                alt="Thumbnail"
                                                                className={styles.projectImg}
                                                            />
                                                        </div>
                                                        <h3>{project.title}</h3>
                                                        <div className={styles.projectDetails}>
                                                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8" />
                                                            </svg>
                                                            <div className='d-flex justify-content-between mt-3'>
                                                                <div className='d-flex flex-column gap-0'>
                                                                    <h4>{project.raised}</h4>
                                                                    <p>Raised</p>
                                                                </div>
                                                                <div className='d-flex flex-column'>
                                                                    <h4>{project.minInvestment}</h4>
                                                                    <p>Min Investment</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <h3 className={`${styles.heroTitle} my-5`}>No projects match your filters.</h3>
                                        )}
                                    </div>
                                )}

                                <Link to='/explore?startups=all' className='d-flex'>
                                    <button className={styles.moreProjectsBtn} >Show All Startups</button>
                                </Link>
                            </div>
                        )}
                        {activeTab === 'news' && (
                            <div className={styles.content}>
                                <h3>Latest News</h3>
                                <p>
                                    Stay updated with the latest achievements and announcements from FundX and our
                                    community of founders.
                                </p>
                                <ul>
                                    <li>FundX raises $10M in Series A funding - TechCrunch, Oct 2024</li>
                                    <li>New partnership with Startup Accelerator - Forbes, Sep 2024</li>
                                    <li>Founder Spotlight: Jane Doe secures $5M - FundX Blog, Aug 2024</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </>}
            </div>
        </div>
    )
}

export default Hero
