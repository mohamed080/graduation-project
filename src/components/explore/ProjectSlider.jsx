import React, { useEffect, useState } from 'react'
import styles from './ProjectSlider.module.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { projects } from '../../data/startups';



const ProjectSlider = () => {
    const [swiper, setSwiper] = useState(null);
    const [isFirstSlide, setIsFirstSlide] = useState(true);
    const [isLastSlide, setIsLastSlide] = useState(false);

    useEffect(() => {
        if (swiper) {
            swiper.params.navigation.prevEl = ".nav-prev";
            swiper.params.navigation.nextEl = ".nav-next";
            swiper.navigation.init();
            swiper.navigation.update();
            setIsFirstSlide(swiper.isBeginning);
            setIsLastSlide(swiper.isEnd);
            swiper.on("slideChange", () => {
                setIsFirstSlide(swiper.isBeginning);
                setIsLastSlide(swiper.isEnd);
            });
        }
    }, [swiper]);

    return (
        <div className={styles.moreProjects}>
            <div className='d-flex justify-content-between align-items-center'>
                <div className={styles.moreProjectsTitle}>
                    <h2>EXCLUSIVE PRIVATE</h2>
                    <p>Gain exposure to venture-backed businesses - accredited investors only</p>
                </div>
                <div className={`d-flex align-items-center gap-2 gap-md-4 ${styles.navButtonsContainer}`}>
                    <button className={styles.moreProjectsBtn}>See All</button>
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
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                    1024: { slidesPerView: 3 },
                    1536: { slidesPerView: 3 },
                }}
                onSwiper={(swiperInstance) => {
                    setSwiper(swiperInstance);
                }}
            >
                {projects.map((project) => (
                    <SwiperSlide key={project.id}>
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
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default ProjectSlider




