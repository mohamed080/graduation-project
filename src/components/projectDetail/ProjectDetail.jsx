import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../../data/startups';
import { slugify } from '../../utils/slugify';
import styles from './ProjectDetail.module.css';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import InvestingWork from './InvestingWork';

const ProjectDetail = () => {
    const [expandedIds, setExpandedIds] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [showAllTeam, setShowAllTeam] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [text, setText] = useState('');
    const { slug } = useParams();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [slug]);

    const project = projects.find((p) => slugify(p.title) === slug);
    if (!project) return <h2>Project not found</h2>;

    const MAX_CHARS = 140;
    const MAX_BIO_CHARS = 320;

    const shortText =
        project.desc && typeof project.desc === 'string' && project.desc.length > MAX_CHARS
            ? project.desc.slice(0, MAX_CHARS) + '…'
            : project.desc || '';

    const toggleMember = (id) =>
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className={styles.projectDetail}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className={styles.projectLeft}>
                                {project.period > 0 && <p>{project.period} Days LEFT</p>}
                            </div>
                            <p className={styles.projectSubTitle}>Get A PIECE OF {project.title}</p>
                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            <div className={styles.projectDesc}>
                                <p>{expanded ? project.desc || '' : shortText}</p>
                            </div>
                            {project.desc && project.desc.length > MAX_CHARS && (
                                <p
                                    className={styles.showMore}
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    {expanded ? 'Show less' : 'Show more'}
                                </p>
                            )}
                            <Link role="button" className={styles.projectBtn}>
                                Get Equity
                            </Link>
                        </div>
                        <div className="col-12 col-md-6 order-first order-md-last mb-5 mb-md-0">
                            <div className={styles.logoContainer}>
                                <img src={project.img} alt={project.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        <div className={styles.projectTabs}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-7">
                            <div className={styles.heroBtns}>
                                <button
                                    className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                                    onClick={() => handleTabClick('overview')}
                                >
                                    OVERVIEW
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${activeTab === 'about' ? styles.active : ''}`}
                                    onClick={() => handleTabClick('about')}
                                >
                                    ABOUT
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${activeTab === 'terms' ? styles.active : ''}`}
                                    onClick={() => handleTabClick('terms')}
                                >
                                    TERMS
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${activeTab === 'investing' ? styles.active : ''}`}
                                    onClick={() => handleTabClick('investing')}
                                >
                                    INVESTING FAQS
                                </button>
                            </div>
                            <h4 className={styles.reasonsTitle}>Reasons to Invest</h4>
                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>

                            <h4 className={`m-0 py-5 ${styles.reasonsTitle}`}>Team</h4>
                            <section className={styles.teamSection} aria-live="polite">
                                {project.team && project.team.length ? (
                                    project.team.map((member, idx) => {
                                        const isLong = member.bio && typeof member.bio === 'string' && member.bio.length > MAX_BIO_CHARS;
                                        const expanded = !!expandedIds[member.id];
                                        const bioText =
                                            expanded || !isLong
                                                ? member.bio || ''
                                                : member.bio.slice(0, MAX_BIO_CHARS) + '…';

                                        return (
                                            <article
                                                key={member.id}
                                                className={`${styles.team} ${idx >= 3 && !showAllTeam ? styles.hidden : ''}`}
                                            >
                                                <div className={styles.imgContain}>
                                                    <img
                                                        src={member.img}
                                                        alt={member.name ?? `Team member ${member.id}`}
                                                        className={styles.teamImg}
                                                    />
                                                </div>
                                                <div className={styles.teamInfo}>
                                                    <p className={styles.teamName}>
                                                        {member.name} · {member.role}
                                                    </p>
                                                    <p className={`${styles.teamDesc} ${expanded ? styles.expanded : ''}`} id={`bio-${member.id}`}>
                                                        {bioText}
                                                    </p>
                                                    {isLong && (
                                                        <p
                                                            className={styles.showMore}
                                                            onClick={() => toggleMember(member.id)}
                                                            aria-expanded={expanded}
                                                            aria-controls={`bio-${member.id}`}
                                                        >
                                                            {expanded ? 'Show less' : 'Show more'}
                                                        </p>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })
                                ) : (
                                    <p className={styles.valuation}>No team members available</p>
                                )}
                            </section>
                            {project.team && project.team.length > 3 && (
                                <button
                                    className={styles.showMoreTeam}
                                    onClick={() => setShowAllTeam((prev) => !prev)}
                                >
                                    {showAllTeam ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                            <h4 className={styles.reasonsTitle}>ABOUT
                                <h6>HEADQUARTERS</h6>
                            </h4>
                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                            <h4 className={`mb-4 ${styles.reasonsTitle}`}>TERMS</h4>
                            <p className={styles.overview}>Overview</p>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h6 className={styles.valuation}>PRICE PER SHARE</h6>
                                <h6 className={styles.valuation}>VALUATION</h6>
                            </div>
                            <h6 className={`mb-0 ${styles.valuation}`}>DEADLINE</h6>
                            <h6 className={styles.fullTime}>Jun. 30, 2025 at 6:53 PM GMT+3</h6>
                            <p className={styles.overview}>Breakdown</p>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h6 className={styles.valuation}>MIN INVESTMENT</h6>
                                <h6 className={styles.valuation}>OFFERING TYPE</h6>
                            </div>
                            <h6 className={`mb-5 ${styles.valuation}`}>MAX INVESTMENT</h6>
                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                            {/* start discussion */}
                            <h4 className={styles.reasonsTitle}>JOIN THE DISCUSSION</h4>
                            <div className={styles.disccussionContainer}>
                                <div className={styles.avatar}>
                                    ma
                                </div>
                                <div className={styles.disccussion}>
                                    <textarea name="comments" id="comment" value={text} onChange={(e) => setText(e.target.value)} maxLength={2500} cols="30" rows="10" placeholder='what&#39;s on your mind' aria-label='Enter your comment'></textarea>
                                </div>
                                <div className='d-flex justify-content-end w-100'>
                                    <p className={styles.counter} aria-live='polite'>{text.length}/2500</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-end w-100'>
                                <button className={styles.postBtn} disabled={text.trim().length === 0}>Post</button>
                            </div>
                            <button className={`w-100 mb-5 ${styles.postBtn}`}>Show More Comments</button>
                            {/* end discussion */}

                            <InvestingWork />
                        </div>
                        <div className="col-12 col-md-4 offset-md-1 text-md-end order-first order-md-last">
                            <div className={styles.boxContainer}>
                                <div className={styles.boxMeeting}>
                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                        <span className={styles.iconContainer}>
                                            <TfiHeadphoneAlt className={styles.icon} />
                                        </span>
                                        <div className={styles.textContainer}>
                                            <p className={styles.title}>FUNDX Private Questions?</p>
                                            <Link role="button" className={styles.bookMeeting}>
                                                Book a meeting here
                                            </Link>
                                            <p className={styles.time}>9AM - 5PM PST • Mon - Fri</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetail;