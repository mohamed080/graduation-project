import React from "react";
import { Link } from "react-router-dom";
import styles from "./Investments.module.css";

const ProjectCard = ({ project, isOwner, onViewOffers }) => {
    return (
        <div className={styles.projectCard}>
            <div className={styles.cardImage}>
                <img src={project.img} alt={project.title} />
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.category}</p>

                <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
                </svg>
                <div className='d-flex justify-content-between mt-3'>
                    <div className='d-flex flex-column gap-0'>
                        <h4>{project.raised}</h4>
                        <p className={styles.raised}>Raised</p>
                    </div>
                     <div className='d-flex flex-column gap-0'>
                        <h4>Equity</h4>
                        <p>{project.equityOffered}%</p>
                    </div>
                    <div className='d-flex flex-column'>
                        <h4>{project.minInvestment}</h4>
                        <p className={styles.raised}>Min Investment</p>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    {isOwner ? (
                        <>
                            <Link
                                to={`/offering/${project.slug}`}
                                className={styles.manageBtn}
                            >
                                Manage
                            </Link>
                            <button className={styles.reportBtn} onClick={() => onViewOffers(project.id)}>View Offers</button>
                        </>
                    ) : (
                        <Link to={`/offering/${project.slug}`} className={styles.viewBtn}>
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
