import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import logo from '../../assets/logo1.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CiSearch } from "react-icons/ci";
import { IoMenuSharp, IoSettingsOutline } from 'react-icons/io5'
import { MdKeyboardArrowDown, MdMenuOpen } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { RiLogoutCircleLine } from 'react-icons/ri';
const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setMobileMenu(false);
    };
    const toggleMenu = () => {
        setMobileMenu((prev) => !prev);
    }
    useEffect(() => {
        window.addEventListener("scroll", () => {
            window.scrollY > 50 ? setSticky(true) : setSticky(false);
        })
    }, [])
    return (
        <header className={`${styles.header} ${sticky ? styles.fixed : ''}`}>
            <nav>
                <div className='d-flex align-items-center gap-2 gap-lg-5'>
                    <img src={logo} alt="logo image for platform" className={styles.logo} onClick={() => navigate('/')}/>
                    {/* input for search Explore  Investment */}
                    <div className={`${styles.searchContainer} input-group`}>
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
                    </div>
                </div>
                <ul className={`${styles.navLinks} ${!mobileMenu ? styles.hideMobileMenu : ""}`}>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/explore'>Start Investing</NavLink></li>
                    <li><NavLink to='saved'>Saved</NavLink></li>
                    <li><NavLink to='investment'>My Investment</NavLink></li>
                    <li className={isLoggedIn ? styles.userMenuItem : styles.btn}>
                        {isLoggedIn ? (
                            <>
                                <Link to="/profile" aria-label="User Profile" className={styles.user}>
                                    <FaRegUser size={20} />
                                    <MdKeyboardArrowDown className={styles.arrow} size={26} />
                                </Link>
                                <div className={styles.dropdown}>
                                    <p className={styles.name}>Mohamed</p>
                                    <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    <ul>
                                        <li><Link to='/settings'><IoSettingsOutline /> Settings</Link></li>
                                        <li><Link to='/login' onClick={handleLogout}><RiLogoutCircleLine /> Logout</Link> </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <Link to='/login'>Login</Link>
                        )}
                    </li>
                </ul>
                {mobileMenu ? (
                    <MdMenuOpen onClick={toggleMenu} className={styles.menuIcon} aria-label='Open menu' />
                ) : (
                    <IoMenuSharp onClick={toggleMenu} className={styles.menuIcon} aria-label='Close menu' />
                )}
            </nav>
        </header >
    )
}

export default Navbar
