import React from 'react'
import styles from './HowToInvest.module.css'
const HowToInvest = () => {
    return (
        <div className={styles.howToInvest}>
            <div className="container">
                <div className="row">
                    <div className="col-11">
                        <h1>How To Invest</h1>
                        <div className={styles.timelineContainer}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineHeader}>
                                    <h6 className={styles.timelineYear}>01</h6>
                                    <div className={styles.timelineDot}>
                                        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    </div>
                                </div>
                                <h5>SIGN <br />UP</h5>
                                <p>Securely create an account on FundX.</p>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineHeader}>
                                    <h6 className={styles.timelineYear}>02</h6>
                                    <div className={styles.timelineDot}>
                                        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    </div>
                                </div>
                                <h5>BROWSE <br />INVESTMENTS</h5>
                                <p>Review hundreds of investment opportunities, from Startups to Collectibles. </p>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineHeader}>
                                    <h6 className={styles.timelineYear}>03</h6>
                                    <div className={styles.timelineDot}>
                                        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    </div>
                                </div>
                                <h5>MAKE AN <br />INVESTMENT</h5>
                                <p>Submit your payment and own a financial stake in a Startup or Collectible.</p>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineHeader}>
                                    <h6 className={styles.timelineYear}>04</h6>
                                    <div className={styles.timelineDot}>
                                        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    </div>
                                </div>
                                <h5>HOLD <br />OR SELL</h5>
                                <p>You can continue to invest in future rounds, hold on to your investment, or sell eligible securities on StartEngine's trading platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowToInvest
