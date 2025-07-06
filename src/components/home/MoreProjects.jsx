import React, { useEffect, useState } from 'react'
import styles from './MoreProject.module.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { projects } from '../../data/startups';
import { slugify } from '../../utils/slugify';
import  useBusinesses  from '../../hooks/useBusinesses';

const MoreProjects = () => {
    const [swiper, setSwiper] = useState(null);
    const [isFirstSlide, setIsFirstSlide] = useState(true);
    const [isLastSlide, setIsLastSlide] = useState(false);

    const { projects, loading, error } = useBusinesses();

    const navigate = useNavigate();
    const { search } = useLocation();
    useEffect(() => {
        if (swiper) {
            // Ensure Swiper detects the correct navigation buttons
            swiper.params.navigation.prevEl = ".nav-prev";
            swiper.params.navigation.nextEl = ".nav-next";
            swiper.navigation.init();
            swiper.navigation.update();

            // Set initial slide states
            setIsFirstSlide(swiper.isBeginning);
            setIsLastSlide(swiper.isEnd);

            // Listen for slide changes
            swiper.on("slideChange", () => {
                setIsFirstSlide(swiper.isBeginning);
                setIsLastSlide(swiper.isEnd);
            });
        }
    }, [swiper]);

     if (loading) return <p className="text-center">Loading…</p>;
  if (error)   return <p className="text-danger">{error}</p>;
  if (!projects.length) return null; 

  console.log(projects)

    return (
        <div className={styles.moreProjects}>
            <div className={`container ${styles.moreProjectsContainer}`}>
                <div className="row">
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className={styles.moreProjectsTitle}>
                            <h2>EXCLUSIVE PRIVATE</h2>
                            <p>Gain exposure to venture-backed businesses - accredited investors only</p>
                        </div>
                        <div className={`d-flex align-items-center gap-2 gap-md-4 ${styles.navButtonsContainer}`}>
                            <button
                                onClick={() => navigate('/explore?startups=all')}
                                className={styles.moreProjectsBtn}
                            >See All</button>
                            <div className={styles.navButtons}>
                                <button className="nav-prev" disabled={isFirstSlide}>
                                    <FaArrowLeft />
                                </button>
                                <button className="nav-next" disabled={isLastSlide}>
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={15}
                        slidesPerView={1}
                        grabCursor={true}
                        navigation={{ nextEl: ".nav-next", prevEl: ".nav-prev" }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        breakpoints={{
                            480: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1536: { slidesPerView: 3 },
                        }}
                        onSwiper={(swiperInstance) => {
                            setSwiper(swiperInstance);
                        }}
                    >
                        {projects.map((project) => (
                            <SwiperSlide key={project.id}>
                                <Link className={styles.projectCard}
                                    to={{
                                        pathname: `/offering/${slugify(project.title)}`, // or project.slug
                                        search,                                         // keeps ?startups=all
                                    }}
                                >
                                    <div className="img-container">
                                        <img
                                            src={project.img}
                                            alt={project.title}
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
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className={styles.moreInvestBtn} onClick={() => navigate('/explore')}>Explore More Investments</button>
                </div>
            </div>
        </div>
    )
}

export default MoreProjects
