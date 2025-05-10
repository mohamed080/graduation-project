import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ScrollToTop from '../components/common/ScrollToTop'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <ScrollToTop />
            <Footer />
        </>
    )
}

export default Layout
