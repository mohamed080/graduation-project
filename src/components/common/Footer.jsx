import React from 'react'
import styles from './Footer.module.css'
import logo from '../../assets/logo1.png'
import google_play from '../../assets/google_play.png'
import app_store from '../../assets/apple_store.png'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FaX, FaXTwitter } from 'react-icons/fa6'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-4 col-md-3 mb-4 mb-md-0">
            <Link to="/">
              <img src={logo} alt="logo image for platform" className={styles.logo} />
            </Link>
            <p className={styles.copyright}>@ {new Date().getFullYear()} All Rights Reserved</p>
            <img src={app_store} alt="apple Store badge" className='mb-3'/>
            <img src={google_play} alt="google play badge" />
          </div>
          <div className="col-12 col-sm-4 col-md-3  mb-4 mb-md-0">
            <h4>Get To Know Us</h4>
            <Link to="#"><p>Our Team</p></Link>
            <Link to="#"><p>Careers</p></Link>
            <Link to="#"><p>Blog</p></Link>
          </div>
          <div className="col-12 col-sm-4 col-md-3  mb-4 mb-md-0">
            <h4>Let's Work Together</h4>
            <Link to="#"><p>Raise Capital</p></Link>
            <Link to="#"><p>Refer a Founder, eatrn $10k</p></Link>
            <Link to="#"><p>Success Stories</p></Link>
            <Link to="#"><p>Partnerships </p></Link>
          </div>
          <div className="col-12 col-sm-4 col-md-3  mb-4 mb-md-0">
            <h4>Need Help</h4>
            <Link to="#"><p>Contact Us</p></Link>
            <Link to="#"><p>Help Center</p></Link>
          </div>
        </div>
        <div className="row mt-4 justify-content-center">
          <div className="col-12 col-md-3">
          <div className={styles.socialIcons}>
              <Link to="#"><FaFacebook /></Link>
              <Link to="#"><FaXTwitter /></Link>
              <Link to="#"><FaLinkedin /></Link>
              <Link to="#"><FaInstagram /></Link>
          </div>
          </div>
          <div className="col-12 col-md-9">
            <div className={styles.policy}>
              <Link to="#"><p>Privacy Policy</p></Link>
              <Link to="#"><p>Terms & Conditions</p></Link>
              <Link to="#"><p>Support</p></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
