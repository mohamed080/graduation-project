import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BlogCard.module.css';

const BlogCard = ({ post }) => {
    return (
        <div className={styles.card}>
            <Link to={`/blog/${post.slug}`}>
                <div className={styles.image}>
                    <img src={post.image} alt={post.title} className='img-fluid' loading='eager'/>
                </div>
            </Link>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <span>{post.date}</span>
                    <span className={styles.dot}>•</span>
                    <span>{post.readTime} min read</span>
                </div>

                <Link to={`/blog/${post.slug}`} className={styles.titleLink}>
                    <h3 className={styles.title}>{post.title}</h3>
                </Link>

                <p className={styles.excerpt}>{post.excerpt}</p>

                <div className={styles.footer}>
                    <Link
                        to={`/blog/category/${post.category.toLowerCase()}`}
                        className={styles.category}
                    >
                        {post.category}
                    </Link>

                    <div className={styles.author}>
                        <div className={styles.authorImage}>
                            <img src={post.author.image} alt={post.author.name} className='img-fluid' loading='eager'/>
                        </div>
                        <div className={styles.authorInfo}>
                            <p className={styles.authorName}>{post.author.name}</p>
                            <p className={styles.authorTitle}>{post.author.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;