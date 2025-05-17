import React from 'react'
import styles from './Hero.module.css'
import { projects } from '../../data/startups';

const ExploreAll = () => {
    return (
        <div className={styles.hero}>
            <div className="container">
                <div className="row mb-5">
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
            </div>
        </div>
    )
}

export default ExploreAll
