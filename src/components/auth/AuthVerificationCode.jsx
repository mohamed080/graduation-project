import React, { useCallback, useRef, useState } from 'react'
import styles from './AuthLogin.module.css'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'

const AuthVerificationCode = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([null, null, null, null].map(() => React.createRef()));
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleInputChange = useCallback((index, value) => {
        if (!/^[0-9]*$/.test(value) || value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1].current.focus();
        }
    }, [otp, inputRefs]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].current.focus();
        }
    }, [otp, inputRefs]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim().slice(0, 4);
        if (/^\d{4}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[3].current.focus();
        }
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (otp.some((value) => !value)) return;

            setIsLoading(true);
            setError('');

            try {
                // Replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                navigate('/reset-password');
            } catch (err) {
                setError('Verification failed. Please try again.', err);
            } finally {
                setIsLoading(false);
            }
        },
        [navigate, otp]
    );

    return (
        <div className={styles.login}>
            <div className="container-fluid">
                <div className="row">
                    <div className={`col-4 ${styles.loginImg}`}>
                        <Link to='/'>
                            <img src={logo} alt="FundX company logo" className={`img-fluid ${styles.loginLogo}`} />
                        </Link>
                        <h4 className={styles.loginText}>We help our users to make the right financial decisions</h4>
                    </div>
                    <div className="col-8 ms-auto text-center">
                        <div className={styles.loginForm}>
                            <h2>Verification Code</h2>
                            <p>Please enter the verification code sent to your email/number</p>
                            <form onSubmit={handleSubmit} className='w-100' aria-label="Verification code form">
                                {/* OTP Input Fields */}
                                <div className="mb-4 d-flex justify-content-center gap-3" role="group"
                                    aria-label="Verification code inputs">
                                    {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className={`form-control my-5 ${styles.otp}`}
                                            style={{ width: "50px", fontSize: "1.5rem" }}
                                            maxLength="1"
                                            value={value}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={handlePaste}
                                            ref={inputRefs.current[index]}
                                            aria-label={`Digit ${index + 1}`}
                                            required
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                                {error && <p className="text-danger" id="error-message" role="alert">{error}</p>}
                                <button type="submit" className={`w-50 ${styles.loginBtn}`} disabled={isLoading || otp.some((value) => !value)} aria-busy={isLoading}>
                                    {isLoading ? 'Verifying ...' : 'Verify'}
                                </button>
                                <p className='mt-5'>Didn't receive the code?<Link to='#' aria-label="Resend verification code">Resend</Link></p>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthVerificationCode
