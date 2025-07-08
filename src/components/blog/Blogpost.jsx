import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './Blogpost.module.css';
import blogPosts, { getPostBySlug } from '../../data/blogPosts';

const Blogpost = () => {
    const { slug } = useParams();
    const blogPost = getPostBySlug(slug);

    useEffect(() => {
        window.scrollTo(0, 0, { behavior: 'smooth' });
    }, [slug]);
    // Get related posts
    const relatedPosts = blogPosts.filter(post =>
        blogPost.relatedPosts.includes(post.id)
    );

    if (!blogPost) {
        return <div>Post not found</div>;
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <nav className={styles.breadcrumb}>
                    <ol className={styles.breadcrumbList}>
                        <li className={styles.breadcrumbItem}>
                            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                        </li>
                        <li className={styles.breadcrumbDivider}>/</li>
                        <li className={styles.breadcrumbItem}>
                            <Link to="/blog" className={styles.breadcrumbLink}>Blog</Link>
                        </li>
                        <li className={styles.breadcrumbDivider}>/</li>
                        <li className={styles.breadcrumbItemActive}>{blogPost.category}</li>
                    </ol>
                </nav>

                <article>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{blogPost.title}</h1>
                        <div className={styles.meta}>
                            <span>{blogPost.date}</span>
                            <span className={styles.dot}>•</span>
                            <span>{blogPost.readTime} min read</span>
                            <span className={styles.dot}>•</span>
                            <Link
                                to={`/blog/category/${blogPost.category.toLowerCase()}`}
                                className={styles.categoryLink}
                            >
                                {blogPost.category}
                            </Link>
                        </div>
                        <div className={styles.image}>
                            <img src={blogPost.image} alt={blogPost.title} className='img-fluid' loading='eager' />
                        </div>
                    </header>

                    <div className={styles.articleContent}>
                        <h2 className={styles.contentH2}>{blogPost.content.title}</h2>
                        <p className={styles.contentP}>{blogPost.content.text}</p>
                        <h3 className={styles.contentH3}>{blogPost.content.subTitle}</h3>
                        <ul className={styles.contentUl}>
                            {blogPost?.content?.listItems?.length ? (
                                blogPost.content.listItems.map((item, idx) => (
                                    <li key={idx}>
                                        <strong>{item.label}</strong> {item.desc}
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted">No points available.</li>
                            )}
                        </ul>
                        <div className={styles.contentTip}>
                            <p><strong>Pro Tip:</strong> {blogPost.content.proTip}</p>
                        </div>
                    </div>

                    <div className={styles.tagsSection}>
                        <h3 className={styles.tagsTitle}>Tags</h3>
                        <div className={styles.tagsContainer}>
                            {blogPost.tags.map(tag => (
                                <Link
                                    key={tag}
                                    to={`/blog/tag/${tag}`}
                                    className={styles.tag}
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className={styles.authorSection}>
                        <div className={styles.authorImage}>
                            <img src={blogPost.author.image} alt={blogPost.author.name} className='img-fluid' loading='eager' />
                        </div>
                        <div className={styles.authorInfo}>
                            <h3 className={styles.authorName}>{blogPost.author.name}</h3>
                            <p className={styles.authorTitle}>{blogPost.author.title}</p>
                            <p className={styles.authorBio}>{blogPost.author.bio}</p>
                        </div>
                    </div>

                    <div className={styles.relatedSection}>
                        <h2 className={styles.relatedTitle}>Related Articles</h2>
                        <div className={styles.relatedGrid}>
                            {relatedPosts.map(post => (
                                <div key={post.id} className={styles.relatedCard}>
                                    <div className={styles.relatedImage}>
                                        <img src={post.image} alt={post.title} className='img-fluid' loading='eager' />
                                    </div>
                                    <div className={styles.relatedContent}>
                                        <p className={styles.relatedDate}>{post.date}</p>
                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className={styles.relatedTitle}
                                        >
                                            {post.title}
                                        </Link>
                                        <p className={styles.relatedReadTime}>{post.readTime} min read</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.commentsSection}>
                        <h2 className={styles.commentsTitle}>Comments (3)</h2>

                        <div className={styles.commentsList}>
                            <div className={styles.comment}>
                                <div className={styles.commentAuthorImage}></div>
                                <div className={styles.commentContent}>
                                    <h4 className={styles.commentAuthorName}>James Wilson</h4>
                                    <p className={styles.commentMeta}>Business Owner • 2 days ago</p>
                                    <p className={styles.commentText}>
                                        This article perfectly explains the valuation methods. I've been struggling to explain
                                        our valuation to potential investors, and this gives me a much clearer framework.
                                    </p>
                                </div>
                            </div>
                            {/* Add more comments */}
                        </div>

                        <div className={styles.commentForm}>
                            <h3 className={styles.commentFormTitle}>Leave a Comment</h3>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <textarea
                                    placeholder="Share your thoughts..."
                                    className={styles.commentTextarea}
                                ></textarea>
                                <button type="submit" className={styles.commentSubmit}>
                                    Post Comment
                                </button>
                            </form>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default Blogpost;