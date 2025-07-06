import React, { useCallback, useState } from 'react'
import styles from './AuthLogin.module.css'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import facebooklogo from '../../assets/logos_facebook.png';
import googlelogo from '../../assets/google-original.png';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const AuthLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setError('');
            setIsLoading(true);

            if (!email || !password) {
                setError('Please fill in all fields');
                setIsLoading(false);
                return;
            }

            if (!validateEmail(email)) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.post('/login', { email, password });
                login(response.data.access_token); 
                setIsLoading(false);
                navigate('/');
            } catch (err) {
                /* ④ show server‑side validation or generic error */
                const msg =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    'Login failed, please try again';
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        },
        [email, password, navigate, login]
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
                        <h2>WELCOME TO FundX!</h2>
                        <p>New user?<Link to='/register'>Sign up</Link></p>
                        {error && <div className={styles.error}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="Email" aria-describedby="emailHelp"
                                    required  autoComplete="email" />
                            </div>
                            {/* Password */}
                            <div className="mb-2 position-relative">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control rounded-end"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password" 
                                    />
                                    <span
                                        className={styles.inputGroupText}
                                        onClick={() => setShowPassword(!showPassword)}
                                        role='button'
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}                                        >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                {/* Checkbox for "Remind me" */}
                                <div className={`form-check ${styles.checkbox}`}>
                                    <input className={styles.formCheckInput} type="checkbox" id="remindMe" />
                                    <label className="form-check-label" htmlFor="remindMe">Remind me</label>
                                </div>

                                {/* Forget Password Link */}
                                <h4 className="mb-0">
                                    <Link to="/forget-password">Forget Password?</Link>
                                </h4>

                            </div>
                            <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
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

export default AuthLogin
