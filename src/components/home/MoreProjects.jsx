import React, { useEffect, useState } from 'react'
import styles from './MoreProject.module.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import project1 from '../../assets/project1.png'
import project2 from '../../assets/project2.png'
import project3 from '../../assets/project3.png'
import project4 from '../../assets/project4.jpeg'
import project5 from '../../assets/project5.jpeg'

const projects = [
    {
        id: 1,
        title: "Series spaceX-2",
        img: project1,
        raised: '$6.10M',
        minInvestment: '$75,2K',
        link: '#',
    },
    {
        id: 2,
        title: "Series OpenAI",
        img: project2,
        raised: '$4.75M',
        minInvestment: '$17,2K',
        link: '#',
    },
    {
        id: 3,
        title: "Series spaceX-2",
        img: project3,
        raised: '$6.10M',
        minInvestment: '$20,2K',
        link: '#',
    },
    {
        id: 4,
        title: "Series Ripple",
        img: project4,
        raised: '$1M',
        minInvestment: '$15K',
        link: '#',
    },
    {
        id: 5,
        title: "A.I Disruptors Fund",
        img: project5,
        raised: '$2.31M',
        minInvestment: '$25,2K',
        link: '#',
    }
];

const MoreProjects = () => {
    const [swiper, setSwiper] = useState(null);
    const [isFirstSlide, setIsFirstSlide] = useState(true);
    const [isLastSlide, setIsLastSlide] = useState(false);
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

    return (
        <div className={styles.moreProjects}>
            <div className={`container ${styles.moreProjectsContainer}`}>
                <div className="row">
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className={styles.moreProjectsTitle}>
                            <h4>EXCLUSIVE PRIVATE</h4>
                            <p>Gain exposure to venture-backed businesses - accredited investors only</p>
                        </div>
                        <div className='d-flex align-items-center gap-4'>
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
                            320: { slidesPerView: 1 },
                            480: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
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
                                        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" stroke-linecap="round" stroke-dasharray="0.5 8"></line></svg>
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

                    <button className={styles.moreInvestBtn}>Explore More Investments</button>
                </div>
            </div>
        </div>
    )
}

export default MoreProjects
