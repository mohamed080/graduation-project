import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import styles from './ProjectDetail.module.css';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import InvestingWork from './InvestingWork';
import { useAuth } from '../../context/AuthContext';
import useBusinesses from '../../hooks/useBusinesses';
import { teams } from '../../data/startups';
import FullPageLoader from '../common/FullPageLoader';
import { CiLocationOn } from 'react-icons/ci';
import { FaBuilding } from 'react-icons/fa';
import { AiOutlineTeam } from 'react-icons/ai';
import axiosInstance from '../../utils/axiosInstance';

const ProjectDetail = () => {
    const [expandedIds, setExpandedIds] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [showAllTeam, setShowAllTeam] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [text, setText] = useState('');
    const [meetingLoading, setMeetingLoading] = useState(false);
    const [meetingError, setMeetingError] = useState('');
    const navigate = useNavigate();
    const { currentUser, token } = useAuth();
    const [ownerAlert, setOwnerAlert] = useState(false);
    const { slug } = useParams();
    const overviewRef = useRef(null);
    const aboutRef = useRef(null);
    const termsRef = useRef(null);
    const investingRef = useRef(null);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [slug]);
    const { projects, loading, error } = useBusinesses();
    if (loading) return <FullPageLoader />;
    if (error) return <p className="text-danger text-center my-5 h-100">Failed to load project.</p>;

    const project = projects.find((p) => slugify(p.title) === slug);
    if (!project) return <h2 className="text-danger text-center my-5 h-100">Project not found.</h2>;

    const MAX_CHARS = 140;
    const MAX_BIO_CHARS = 320;

    // console.log(project);

    const shortText =
        project.desc && typeof project.desc === 'string' && project.desc.length > MAX_CHARS
            ? project.desc.slice(0, MAX_CHARS) + '…'
            : project.desc || '';

    const toggleMember = (id) =>
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setTimeout(() => {
            const map = {
                'overview': overviewRef,
                'about': aboutRef,
                'terms': termsRef,
                'investing': investingRef
            };
            map[tab].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

    const handleGetEquity = (e) => {
        e.preventDefault();
        if (!token) {
            navigate('/login');
            return;
        }
        const userIsOwner = currentUser?.type === 'owner';
        if (userIsOwner) {
            setOwnerAlert(true);
            return;
        }
        navigate(`/${slug}/equity`);
    };
    const handleBookMeeting = async (e) => {
        e.preventDefault();
        if (!token) {
            setMeetingError('Please log in to book a meeting.');
            return;
        }

        setMeetingLoading(true);
        setMeetingError('');

        try {
            const response = await axiosInstance.post('/zoom/meetings', {
                topic: `${project.title} Investment Discussion`,
                start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Schedule for tomorrow
                duration: 30,
                agenda: `Discuss investment opportunities for ${project.title}`,
            });

            const { data } = response.data;

            window.open(data.zoom_join_url, '_blank');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create Zoom meeting';
            setMeetingError(errorMessage);
        } finally {
            setMeetingLoading(false);
        }
    };

    const formattedValuation = project.valuation
        ? `$${parseFloat(project.valuation).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
        : "N/A";

    const getRiskColor = (rate) => {
        if (rate <= 30) return '#4CAF50'; // Green for low risk
        if (rate <= 70) return '#FFC107'; // Amber for medium risk
        return '#F44336'; // Red for high risk
    };
    return (
        <>
            <div ref={overviewRef} className={styles.projectDetail}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className={styles.projectLeft}>
                                {project.period > 0 && <p>{project.period} Days LEFT</p>}
                            </div>
                            <p className={styles.projectSubTitle}>Get A PIECE OF {project.title}</p>
                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            {/* Add Risk Indicator - NEW SECTION */}
                            <div className={styles.riskIndicator}>
                                <div className={styles.riskLabel}>
                                    Risk Level:
                                    <span style={{ color: getRiskColor(project.riskRate) }}>
                                        {project.riskRate}%
                                    </span>
                                </div>
                                <div className={styles.riskBar}>
                                    <div
                                        className={styles.riskFill}
                                        style={{
                                            width: `${project.riskRate}%`,
                                            backgroundColor: getRiskColor(project.riskRate)
                                        }}
                                    />
                                </div>
                            </div>
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
                            <Link role="button" to="" onClick={handleGetEquity} className={styles.projectBtn} aria-label="Negotiate equity for this project">
                                Get Equity
                            </Link>
                            {ownerAlert && (
                                <p className={styles.ownerAlert} role="alert">
                                    Founders can’t invest in other raises.&nbsp;
                                    <Link to="/register?as=investor">Create an investor account</Link>.
                                </p>
                            )}
                            {meetingError &&
                                <p className={styles.ownerAlert} role="alert">
                                    {meetingError}
                                </p>
                            }
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
                            <div className={styles.reasonsContent}>
                                {project.competitive_advantages && (
                                    <div className={styles.reasonItem}>
                                        <h6 className={`mb-3 ${styles.fullTime}`}>Competitive Advantages</h6>
                                        <p className={styles.valuation}>{project.competitive_advantages}</p>
                                    </div>
                                )}

                                {project.target_market && (
                                    <div className={styles.reasonItem}>
                                        <h6 className={`mb-3 ${styles.fullTime}`}>Target Market</h6>
                                        <p className={styles.valuation}>{project.target_market}</p>
                                    </div>
                                )}
                            </div>
                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>

                            <h4 className={`m-0 py-5 ${styles.reasonsTitle}`}>Team</h4>
                            <div className={styles.aboutContent}>
                                {project.founded_year && (
                                    <div className={styles.aboutItem}>
                                        <h6 className={`mb-3 ${styles.fullTime}`}>Founded</h6>
                                        <p className={styles.valuation}><FaBuilding size={20} className='me-2' />{project.founded_year}</p>
                                    </div>
                                )}
                                {project.employees_count && (
                                    <div className={styles.aboutItem}>
                                        <h6 className={`mb-3 ${styles.fullTime}`}>Team Size</h6>
                                        <p className={styles.valuation}><AiOutlineTeam size={20} className='me-2' />{project.employees_count} members</p>
                                    </div>
                                )}
                            </div>
                            <section className={styles.teamSection} aria-live="polite">
                                {teams && teams.length ? (
                                    teams.map((member, idx) => {
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
                            {teams.length > 3 && (
                                <button
                                    ref={aboutRef}
                                    className={styles.showMoreTeam}
                                    onClick={() => setShowAllTeam((prev) => !prev)}
                                >
                                    {showAllTeam ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                            <h4 className={styles.reasonsTitle}>ABOUT </h4>
                            <div className={styles.aboutContent}>
                                {project.location && (
                                    <div className={styles.aboutItem}>
                                        <h6 className={`mb-3 ${styles.fullTime}`}>Loction</h6>
                                        <p className={styles.valuation}><CiLocationOn size={20} className='me-2' />{project.location}</p>
                                    </div>
                                )}

                                {project.category && (
                                    <div className={styles.aboutItem}>
                                        <h6 className={`mb-3 ${styles.fullTime}`}>Category</h6>
                                        <p className={styles.valuation}>{project.category}</p>
                                    </div>
                                )}
                            </div>
                            <h6 ref={termsRef} className={styles.headquarters}>HEADQUARTERS</h6>
                            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                            <h4 className={`mb-4 ${styles.reasonsTitle}`}>TERMS</h4>
                            <div className={styles.termsContainer}>
                                <div className={styles.termsColumn}>
                                    <div className={styles.termsGroup}>
                                        <p className={styles.overview}>Overview</p>
                                        <div className={styles.termItem}>
                                            <span>Amount Requested</span>
                                            <strong>{project.amountRequested ? `$${project.amountRequested.toLocaleString()}` : 'N/A'}</strong>
                                        </div>
                                        <div className={styles.termItem}>
                                            <span>Equity Offered</span>
                                            <strong>{project.equityOffered ? `${project.equityOffered}%` : 'N/A'}</strong>
                                        </div>
                                        <div className={styles.termItem}>
                                            <span>Valuation</span>
                                            <strong>{project.valuation ? formattedValuation : 'N/A'}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.termsColumn}>
                                    <div className={styles.termsGroup}>
                                        <p className={styles.overview}>Investment Details</p>
                                        <div className={styles.termItem}>
                                            <span>Min Investment</span>
                                            <strong>{project.minInvestment || 'N/A'}</strong>
                                        </div>
                                        <div className={styles.termItem}>
                                            <span>Amount Raised</span>
                                            <strong>{project.raised || 'N/A'}</strong>
                                        </div>
                                        <div className={styles.termItem}>
                                            <span>Status</span>
                                            <strong className={project.status === 'active' ? styles.statusActive : styles.statusClosed}>
                                                {project.status || 'N/A'}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                            <InvestingWork ref={investingRef} />
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
                                            <Link role="button" className={styles.bookMeeting} onClick={handleBookMeeting} disabled={meetingLoading}>
                                                {meetingLoading ? 'Scheduling...' : 'Book a meeting here'}
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