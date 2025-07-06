import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import logo from '../../assets/logo1.png'
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CiSearch } from "react-icons/ci";
import { IoMenuSharp, IoSettingsOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown, MdMenuOpen } from 'react-icons/md';
import { FaBell, FaRegUser } from 'react-icons/fa';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import axiosInstance from '../../utils/axiosInstance';
import person from '../../assets/person.png'
import correct from '../../assets/correct.png'
import style from '../auth/AuthLogin.module.css'
import { useAuth, useNotification } from '../../context/AuthContext';

const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { slug } = useParams();                      // works even in navbar
    const [inWatchlist, setInWatchlist] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();                     // current URL
    const isOfferingPage = /^\/offering\/[^/]+$/.test(location.pathname);
    const { unreadCount } = useNotification();
    const { currentUser, logout, token } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setMobileMenu(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!slug) {                    // we’re not on an offering page
            setInWatchlist(false);
            return;
        }
        const list = JSON.parse(localStorage.getItem('watchList') || '[]');
        setInWatchlist(list.includes(slug));
    }, [slug]);

    const toggleWatchlist = () => {
        if (!slug) return;

        const list = JSON.parse(localStorage.getItem('watchList') || '[]');
        let updated;

        if (inWatchlist) {
            updated = list.filter(item => item !== slug);  // remove
        } else {
            updated = [...list, slug];                     // add
        }

        localStorage.setItem('watchList', JSON.stringify(updated));
        setInWatchlist(!inWatchlist);
    };
    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        setShowModal(false);
        try {
            await axiosInstance.post('/logout');     // token still attached
        } catch (err) {
            console.error('Logout failed:', err);    // optional toast, etc.
        } finally {
            logout();
            navigate('/');
            setLoggingOut(false);
        }
    };


    const toggleMenu = () => {
        setMobileMenu((prev) => !prev);
    }

    // Close mobile menu when clicking anywhere outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileMenu && !e.target.closest(`.${styles.navLinks}`) &&
                !e.target.closest(`.${styles.menuIcon}`)) {
                setMobileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileMenu]);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            window.scrollY > 50 ? setSticky(true) : setSticky(false);
        })
    }, [])

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };
    return (
        <header className={`${styles.header} ${sticky ? styles.fixed : ''}`}>
            <nav>
                <div className='d-flex align-items-center gap-2 gap-lg-5'>
                    <img src={logo} alt="logo image for platform" className={styles.logo} onClick={() => navigate('/')} />
                    {/* input for search Explore  Investment */}
                    {!isOfferingPage && <div className={`${styles.searchContainer} input-group`}>
                        <input
                            type="text"
                            className={`form-control ${styles.searchInput}`}
                            placeholder="Explore Investment"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            aria-label='Search investment'
                        />
                        {isSearchFocused && (
                            <CiSearch className={styles.searchIcon} />
                        )}
                    </div>}
                </div>
                <ul className={`${styles.navLinks} ${!mobileMenu ? styles.hideMobileMenu : ""}`}>
                    {isOfferingPage && token ?
                        <div className={styles.watchDesktopOnly}>
                            <button
                                className={`${styles.watchBtn} ${inWatchlist ? styles.active : ''}`}      /* add CSS below */
                                onClick={toggleWatchlist}
                                aria-pressed={inWatchlist}
                            >
                                {inWatchlist ? <><AiFillHeart size={18} />Add to Watch List</> : <><AiOutlineHeart size={18} />WatchList</>}
                            </button>
                        </div>
                        : <> <li><NavLink to='/' onClick={closeMobileMenu}>Home</NavLink></li>
                            <li><NavLink to='/explore' onClick={closeMobileMenu}>Start Investing</NavLink></li>
                            <li><NavLink to='/blog' onClick={closeMobileMenu}>Learn</NavLink></li>
                            <li><NavLink to='/investments' onClick={closeMobileMenu}>My Investment</NavLink></li>
                            {/* Notification Icon */}
                            {token && <li className={styles.notificationItem}>
                                <NavLink to="/settings/notifications" className={styles.notificationLink} onClick={closeMobileMenu} >
                                    <div className={styles.notificationIcon}>
                                        <FaBell size={20} />
                                        {unreadCount > 0 && (
                                            <span className={styles.notificationBadge}>{unreadCount}</span>
                                        )}
                                    </div>
                                </NavLink>
                            </li>
                            }
                        </>}
                    <li className={token ? styles.userMenuItem : styles.btn}>
                        {token ? (
                            <>
                                <Link aria-label="User Profile" className={styles.user}>
                                    <FaRegUser size={20} />
                                    <MdKeyboardArrowDown className={styles.arrow} size={26} />
                                </Link>
                                <div className={styles.dropdown}>
                                    <p className={styles.name}>{currentUser?.name}</p>
                                    <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    <ul>
                                        <li><Link to='/watchlist' onClick={closeMobileMenu}><AiOutlineHeart /> Watchlist</Link></li>
                                        <li><Link to='/settings' onClick={closeMobileMenu}><IoSettingsOutline /> Settings</Link></li>
                                        <li><Link onClick={() => setShowModal(true)}><RiLogoutCircleLine /> Logout</Link> </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <Link to='/login' onClick={closeMobileMenu}>Login</Link>
                        )}
                    </li>
                </ul>
                <div className='d-flex align-items-center gap-2 gap-lg-5'>
                    {isOfferingPage && token &&
                        <button
                            className={`${styles.watchBtn} ${styles.heartBehind} ${inWatchlist ? styles.active : ''}`}      /* add CSS below */
                            onClick={toggleWatchlist}
                            aria-pressed={inWatchlist}
                        >
                            {inWatchlist ? <><AiFillHeart size={18} />Add to Watch List</> : <><AiOutlineHeart size={18} />WatchList</>}
                        </button>
                    }
                    {mobileMenu ? (
                        <MdMenuOpen onClick={toggleMenu} className={styles.menuIcon} aria-label='Open menu' />
                    ) : (
                        <IoMenuSharp onClick={toggleMenu} className={styles.menuIcon} aria-label='Close menu' />
                    )}
                </div>
            </nav>
            {showModal && (
                <div className={`${style.overlay} ${showModal ? style.open : ''}`}
                    role="dialog"
                    aria-labelledby="logoutDone"
                >
                    <div className={style.modalContent}>
                        <div className={style.modalBody}>
                            <div className={style.modalIcon}>
                                <img src={person} alt="person" className={style.person} />
                                <img src={correct} alt="correct" className={style.correct} />
                            </div>
                            <h3 id="logoutDone">You’ve logged out</h3>
                            <p>Thanks for visiting FundX. See you soon!</p>
                            <div className='d-flex gap-3 justify-content-center'>
                                <button
                                    className={`${style.loginBtn} ${style.canselModalBtn}`}
                                    onClick={() => setShowModal(false)}
                                    disabled={loggingOut}
                                >
                                    Cansel
                                </button>
                                <button
                                    className={`${style.loginBtn} ${style.continueModalBtn}`}
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                >
                                    {loggingOut ? 'Logging out…' : 'Continue'}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header >
    )
}

export default Navbar
