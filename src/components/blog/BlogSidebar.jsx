import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './BlogSidebar.module.css';
import blogPosts from '../../data/blogPosts';

const BlogSidebar = () => {
    const [email, setEmail] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

        // Function to handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to blog page with search query
            navigate(`/blog?search=${encodeURIComponent(searchQuery)}`);
            
            // Clear search input
            setSearchQuery('');
            
            // Optional: Focus back on input
            searchInputRef.current.blur();
        }
    };

    // 1. Dynamically calculate categories with counts
    const categoryCounts = {};
    blogPosts.forEach(post => {
        const category = post.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Convert to array with id, name, count
    const categories = Object.entries(categoryCounts).map(([name, count], index) => ({
        id: index + 1,
        name,
        count
    }));

    // Get popular posts
    const popularPosts = blogPosts.slice(0, 3).map(post => ({
        id: post.id,
        title: post.title,
        date: post.date,
        slug: post.slug,
        image: post.image
    }));

    // Get all unique tags from all posts
    const allTags = [];
    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }
        });
    });

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            alert(`Thank you for subscribing with: ${email}`);
            setEmail('');
        }
    };


    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Search Articles</h3>
 <form onSubmit={handleSearch} className={styles.searchContainer}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search topics, keywords..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className={styles.searchButtons}>
                        {searchQuery && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={() => {
                                    setSearchQuery('');
                                    searchInputRef.current.focus();
                                }}
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={styles.clearIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                        <button 
                            type="submit" 
                            className={styles.searchButton}
                            disabled={!searchQuery.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {categories.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Categories</h3>
                    <ul className={styles.categoryList}>
                        {categories.map(category => (
                            <li key={category.id} className={styles.categoryItem}>
                                <Link
                                    to={`/blog/category/${category.name.toLowerCase()}`}
                                    className={styles.categoryLink}
                                >
                                    <span>{category.name}</span>
                                    <span className={styles.categoryCount}>{category.count}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Popular Posts</h3>
                <ul className={styles.popularList}>
                    {popularPosts.map(post => (
                        <li key={post.id} className={styles.popularItem}>
                            <Link
                                to={`/blog/${post.slug}`}
                                className={styles.popularLink}
                            >
                                <div className={styles.popularImage}>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className='img-fluid'
                                        loading='lazy'
                                    />
                                </div>
                                <div>
                                    <h4 className={styles.popularTitle}>{post.title}</h4>
                                    <p className={styles.popularDate}>{post.date}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.subscribeSection}>
                <h3 className={styles.subscribeTitle}>Stay Updated</h3>
                <p className={styles.subscribeText}>Get the latest articles on equity negotiation delivered to your inbox</p>
                <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className={styles.subscribeInput}
                        required
                    />
                    <button
                        type="submit"
                        className={styles.subscribeButton}
                    >
                        Subscribe
                    </button>
                </form>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Tags</h3>
                <div className={styles.tagsContainer}>
                    {allTags.map(tag => (
                        <Link
                            key={tag}
                            to={`/blog/tag/${tag.toLowerCase()}`}
                            className={styles.tag}
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;