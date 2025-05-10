import React from 'react'
import styles from './Hero.module.css'
import heroimg from '../../assets/hero1.png'
const Hero = () => {
  return (
    <div className={styles.hero}>
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h1>Invest in the FundX<br/> Fund Promising <br />Projects with<br /> Confidence.</h1>
                    <p>A Platform that connects you with top investment
                    opportunities and offers the potential for attactive returns.</p>
                    <button className={styles.heroBtn}>Start Funding Now</button>
                </div>
                <div className="col-12 col-md-5 ms-auto">
                        <img src={heroimg} alt="hero image" className={styles.heroImg}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
