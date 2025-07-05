import React, { useState } from 'react'
import styles from './Settings.module.css'
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import qr_ios from '../../assets/google-authenticator-apple-store-qrcode.png';
import qr_android from '../../assets/google-authenticator-play-store-qrcode.png';
import googlelogo from '../../assets/google-authenticator-logo.png';
const SecuritY = () => {
    const navigate = useNavigate();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [is2FAVerified, setIs2FAVerified] = useState(false);

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
            {is2FAEnabled ?
                <>
                    <h4 className='mt-5'>ENABLING 2FA AUTHENTICATION</h4>
                    <p className={styles.personinfoText}>Protect your account from unauthorized access by requiring a form of authentication in addition to your password.</p>
                    <div className={styles.settingsContent}>
                        <h6 className={styles.steps}>Steps to Enable 2FA</h6>
                        <div className='d-flex align-items-center'>
                            <svg width="20" height="100%" viewBox="0 0 20 122" fill="none"><g filter="url(#filter0_i_105_34)"><rect x="20" width="122px" height="20" rx="10" transform="rotate(90 20 0)" fill="#F4F4F4"></rect></g><rect x="15" y="5" width="10" height="10" rx="5" transform="rotate(90 15 5)" fill="url(#paint0_linear_102_26)"></rect><rect x="15" y="5" width="112px" height="10" rx="5" transform="rotate(90 15 5)" fill="url(#paint0_linear_102_18)"></rect><circle cx="10" cy="10" r="3" fill="white"></circle><circle cx="10" cy="49.18032786885246%" r="3" fill="white"></circle><circle cx="10" cy="91.80327868852459%" r="3" fill="white"></circle><defs><linearGradient id="paint0_linear_102_26" x1="14.6181" y1="15.0032" x2="39.9547" y2="15.0218" gradientUnits="userSpaceOnUse"><stop stopColor="#185C65"></stop><stop offset="0.549054" stopColor="#2B8BD7"></stop><stop offset="1" stopColor="#BAF4DC"></stop></linearGradient><linearGradient id="paint0_linear_102_18" x1="9.2721" y1="15.0032" x2="389.275" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#185C65"></stop><stop offset="0.549054" stopColor="#2B8BD7"></stop><stop offset="1" stopColor="#BAF4DC"></stop></linearGradient><filter id="filter0_i_105_34" x="0" y="0" width="21" height="342" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="1" dy="2"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_105_34"></feBlend></filter><filter id="filter0_i_803_1231" x="0" y="0" width="1063" height="22.0001" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="1" dy="2"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_803_1231"></feBlend></filter></defs></svg>
                            <div className={styles.step}>
                                <p className={styles.stepText}>Install any Authenticator app. We recommend Google Authenticator.</p>
                                <p className={styles.stepText}>Copy or scan Setup Key into authenticator app.</p>
                                <p className={`mb-0 ${styles.stepText}`}>Enter verification code from authenticator app.</p>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center mt-5'>
                            <button
                                className={`mt-4 ${styles.updateButton} w-50`}
                                type='button'
                                onClick={() => {
                                    setIs2FAVerified(!is2FAVerified);
                                    setIs2FAEnabled(false);
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </>
                : is2FAVerified ?
                    <>
                        <h4 className='mt-5'>DOWNLOAD AN AUTHENTICATOR</h4>
                        <p className={styles.personinfoText}>You can use any authenticator app but we recommend Google Authenticator.</p>
                        <div className={styles.settingsContent}>
                            <div className={styles.qrcodeContainer}>
                                <div className={styles.qrcode}>
                                    <img src={qr_ios} alt="App Store QR Code" />
                                    <p className={`mb-0 mt-1 ${styles.scan}`}>Scan for IOS</p>
                                </div>
                                <div className={styles.qrcode} >
                                    <img src={googlelogo} alt="Google Authenticator logo" className={styles.googlelogo} />
                                </div>
                                <div className={styles.qrcode}>
                                    <img src={qr_android} alt="play store QR Code" />
                                    <p className={`mb-0 mt-1 ${styles.scan}`}>Scan for Android</p>
                                </div>
                            </div>
                            <button
                                className={`mt-5 mb-5 mb-md-0 ${styles.updateButton} w-50`}
                                type='button'
                                onClick={() => {
                                    setIs2FAVerified(!is2FAVerified);
                                    setIs2FAEnabled(false);

                                }}
                            >
                                Next
                            </button>
                        </div>
                    </>
                    : <>
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
                                <div className={styles.switchContainer}>
                                    {/* switch button */}
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={is2FAEnabled}
                                            onChange={(() => setIs2FAEnabled(!is2FAEnabled))}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
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
                    </>}
        </div>
    )
}

export default SecuritY
