import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import logo from '../../assets/logo1.png'
import { Link, NavLink } from 'react-router-dom'
import { CiSearch } from "react-icons/ci";
import { IoMenuSharp } from 'react-icons/io5'
import { MdMenuOpen } from 'react-icons/md';
const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [sticky, setSticky] = useState(false);


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
                    <img src={logo} alt="logo image for platform" className={styles.logo} />
                    {/* input for search Explore  Investment */}
                    <div className={`${styles.searchContainer} input-group`}>
                        <input
                            type="text"
                            className={`form-control ${styles.searchInput}`}
                            placeholder="Explore Investment"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {isSearchFocused && (
                            <CiSearch
                                className={styles.searchIcon}
                            />
                        )}
                    </div>
                </div>
                <ul className={`${!mobileMenu ? styles.hideMobileMenu : ""}`}>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/explore'>Start Investing</NavLink></li>
                    <li><NavLink to='saved'>Saved</NavLink></li>
                    <li><NavLink to='investment'>My Investment</NavLink></li>
                    <li><NavLink to='cards'>Cards</NavLink></li>
                    <li className={styles.btn}><Link to='login'>Login</Link></li>
                </ul>
                {mobileMenu ? (
                    <MdMenuOpen onClick={toggleMenu} className={styles.menuIcon} />
                ) : (
                    <IoMenuSharp onClick={toggleMenu} className={styles.menuIcon} />
                )}
            </nav>
        </header>
    )
}

export default Navbar
