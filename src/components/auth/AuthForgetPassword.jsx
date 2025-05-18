import React, { useCallback, useState } from 'react'
import styles from './AuthLogin.module.css'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import facebooklogo from '../../assets/logos_facebook.png';
import googlelogo from '../../assets/google-original.png';

const AuthForgetPassword = () => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateInput = (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[0-9]{10,15}$/; // Accepts + and numbers (10-15 digits)

        if (emailRegex.test(value) || phoneRegex.test(value)) {
            setError("");
            return true;
        } else {
            setError("Please enter a valid email or phone number.");
            return false;
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        validateInput(e.target.value);
    };
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!validateInput(inputValue)) return;

            setIsLoading(true);
            setError('');
            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
                navigate('/verification-code');
            }, 1000); // Replace with actual API call
        },
        [inputValue, navigate]
    );

    const handleSocialLogin = (provider) => {
        // Implement OAuth logic here (e.g., Google, Facebook)
        console.log(`Login with ${provider}`);
    };
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
                    <div className="col-8 ms-auto">
                        <div className={styles.loginForm}>
                            <h2>Forget Password</h2>
                            <p>New user?<Link to='/register'>Sign up</Link></p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email/phone</label>
                                    <input type="text" className="form-control" id="email" placeholder="Email/phone" value={inputValue} onChange={handleInputChange} aria-describedby='inputHelp'/>
                                    {error && <p className="text-danger" id="inputHelp">{error}</p>}
                                </div>
                                <button type="submit" className={styles.loginBtn} disabled={isLoading || error}>
                                    {isLoading ? 'Sending ...' : 'Send OTP'}
                                </button>
                                {/* Or Signup with */}
                                <div className="text-center mt-3">
                                    <p className={styles.lineth}>Or login with</p>
                                    <div className={`d-flex justify-content-center gap-3 ${styles.socialIcons}`}>
                                        <Link to={'/login'} type="button" className={styles.socialBtn} onClick={() => handleSocialLogin('google')}>
                                            <img src={googlelogo} alt="Login with Google" className='img-fluid' />Google</Link>
                                        <Link to={'/login'} type="button" className={styles.socialBtn} onClick={() => handleSocialLogin('facebook')}>
                                            <img src={facebooklogo} alt="Login with Facebook" className='img-fluid' />
                                            Facebook</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthForgetPassword
