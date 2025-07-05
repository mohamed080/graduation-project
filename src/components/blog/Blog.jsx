import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './Blog.module.css';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';
import blogPosts from '../../data/blogPosts';

const POSTS_PER_PAGE = 3;

const Blog = () => {
  const [page, setPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const { category, tag } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [category, tag]);

  // Filter posts based on URL params and search
  useEffect(() => {
    let result = [...blogPosts];

    // Handle search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query)
      );
    }
    // Handle category filter
    else if (category) {
      result = result.filter(post =>
        post.category.toLowerCase() === category.toLowerCase()
      );
    }
    // Handle tag filter
    else if (tag) {
      result = result.filter(post =>
        post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      );
    }

    setFilteredPosts(result);
    setPage(1); // Reset to first page when filters change
  }, [category, tag, searchQuery, location.pathname]);

  // Calculate pagination values
  const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  // Get featured post (only on main blog page)
  const featuredPost = !category && !tag
    ? blogPosts.find(post => post.id === 2)
    : null;

  // Handle reset button click
  const resetFilters = () => {
    navigate('/blog'); // Navigate back to main blog page
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            {/* Featured section only on main blog page */}
            {!category && !tag && featuredPost && (
              <div className={styles.featuredContainer}>
                <div className={styles.featuredCard}>
                  <div className={styles.featuredContent}>
                    <div className={styles.featuredBadge}>Featured</div>
                    <h2 className={styles.featuredTitle}>
                      {featuredPost.title}
                    </h2>
                    <p className={styles.featuredText}>
                      {featuredPost.excerpt}
                    </p>
                    <div className={styles.authorContainer}>
                      <div className={styles.authorImage}>
                        <img
                          src={featuredPost.author.image}
                          alt="Author"
                          className={styles.authorAvatar}
                        />
                      </div>
                      <div className={styles.authorInfo}>
                        <p className={styles.authorName}>{featuredPost.author.name}</p>
                        <p className={styles.authorTitle}>{featuredPost.author.title}</p>
                      </div>
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className={styles.readButton}
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------- SECTION HEADER WITH RESET BUTTON --------- */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {searchQuery ? (
                  <>Search Results for: <span className={styles.searchTerm}>"{searchQuery}"</span></>
                ) : category ? (
                  <>Category: <span className={styles.categoryName}>{category}</span></>
                ) : tag ? (
                  <>Tag: <span className={styles.tagName}>#{tag}</span></>
                ) : (
                  "Recent Articles"
                )}
              </h2>

              {(category || tag || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className={styles.resetButton}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {currentPosts.length > 0 ? (
              <>
                <div className={styles.postsGrid}>
                  {currentPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* PAGINATION */}
                {pageCount > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      className={styles.paginationButton}
                      disabled={page === 1}
                    >
                      Previous
                    </button>

                    {Array.from({ length: pageCount }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`${styles.paginationButton} ${page === i + 1 ? styles.paginationButtonActive : ''
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage(p => Math.min(p + 1, pageCount))}
                      className={styles.paginationButton}
                      disabled={page === pageCount}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noResults}>
                <h3>No articles found</h3>
                <p>Try selecting a different category or tag</p>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;