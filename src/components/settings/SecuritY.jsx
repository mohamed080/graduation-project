import React from 'react'
import styles from './Settings.module.css'
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

const SecuritY = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.settingsContainer}>
            {/* back button */}
            <div 
                className={`d-flex align-items-center gap-4 ${styles.backButton}`}
                onClick={() => navigate('/settings')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/settings')}
            >
                <div className={styles.arrowIcon}>
                    <FaArrowLeftLong />
                </div>
                <p className={styles.back}>Back</p>
            </div>
            <h4 className='mt-5'>Security</h4>
            <div className={styles.settingsContent}>
                {/* 2FA (2-Factor Authentication) */}
                <div
                    className={styles.settingsItem}
                    role="button"
                    tabIndex={0}
                >
                    <div className='d-flex align-items-start gap-5'>
                        <div>
                            <p className='fw-bold'>Enable 2FA <span style={{ color: 'rgb(224, 96, 4)' }}>• Recommended</span></p>
                            <p className='text-muted'>Two-factor authentication (2FA) adds extra security to your account</p>
                        </div>
                    </div>
                    <div className={styles.arrowIcon}>
                        {/* switch button */}
                        {/* <FaArrowRightLong /> */}
                    </div>
                </div>
                <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                {/* Security */}
                <div
                    className={`${styles.settingsItem} pt-4`}
                    onClick={() => navigate('/settings/update-password')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/settings/update-password')}
                >
                    <div className='d-flex align-items-start gap-5'>
                        <div>
                            <p className='fw-bold'>Change Password</p>
                            <p className='text-muted'>Reset your password</p>
                        </div>
                    </div>
                    <div className={styles.arrowIcon}>
                        <FaArrowRightLong />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecuritY
