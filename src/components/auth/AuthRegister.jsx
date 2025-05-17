import React, { useCallback, useState } from 'react'
import styles from './AuthLogin.module.css'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import facebooklogo from '../../assets/logos_facebook.png';
import googlelogo from '../../assets/google-original.png';
import investorImg from '../../assets/investorImg.png'
import ownerImg from '../../assets/ownerImg.png'

const AuthRegister = () => {
    const [category, setCategory] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const handleSubmit = useCallback(
        (e) => {
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

            // Simulate API call
            setTimeout(() => {
                console.log('Email:', email);
                console.log('Password:', password);
                localStorage.setItem('isLoggedIn', 'true');
                setIsLoading(false);
                navigate('/');
            }, 1000); // Replace with actual API call
        },
        [email, password, navigate]
    );

    const handleSocialLogin = (provider) => {
        // Implement OAuth logic here (e.g., Google, Facebook)
        console.log(`Login with ${provider}`);
    };
    return (
        <div className={styles.login}>
            <div className="container-fluid">
                <div className="row">
                    {/* right side */}
                    <div className={`col-4 ${styles.loginImg}`}>
                        <Link to='/'>
                            <img src={logo} alt="FundX company logo" className={`img-fluid ${styles.loginLogo}`} />
                        </Link>
                        <h4 className={styles.loginText}>We help our users to make the right financial decisions</h4>
                    </div>
                    {/* left side */}
                    <div className="col-8">
                        <div className={styles.loginForm}>
                            {!showForm ? (
                                <div className={styles.categorySelection}>
                                    <h2>Select Your Role</h2>
                                    <p>Explore our knowledge base and see everything we have to offer.</p>
                                    <div className={styles.categoryBtns}>
                                        <button
                                            className={`${styles.categoryBtn} ${category === 'Owner' ? styles.active : ''}`}
                                            onClick={() => setCategory('Owner')}
                                        >
                                            <img src={ownerImg} alt="owner image" className='img-fluid' />
                                            Owner
                                        </button>
                                        <button
                                            className={`${styles.categoryBtn} ${category === 'Investor' ? styles.active : ''}`}
                                            onClick={() => setCategory('Investor')}
                                        >
                                            <img src={investorImg} alt="investor image" className='img-fluid' />
                                            Investor
                                        </button>
                                    </div>
                                    <div className='text-center'>
                                        <button
                                            className={`${styles.loginBtn} ${styles.continueBtn}`}
                                            onClick={() => category && setShowForm(true)}
                                            disabled={!category}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            ) :
                                <>
                                    <h2>Create an Account</h2>
                                    <p>Already have an account?<Link to='/login'>Login</Link></p>
                                    {error && <div className={styles.error}>{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        {/* First Name & Last Name in One Row */}
                                        <div className="row mb-1">
                                            <div className="col-6">
                                                <label htmlFor="firstName">First Name</label>
                                                <input type="text" className="form-control" id="firstName" placeholder="First Name" />
                                            </div>
                                            <div className="col-6">
                                                <label htmlFor="lastName">Last Name</label>
                                                <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                                            </div>
                                        </div>

                                        <div className="row mb-1">
                                            <div className="col-6">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="Email" aria-describedby="emailHelp"
                                                    required />
                                            </div>
                                            {/* Country */}
                                            <div className="col-6">
                                                <label htmlFor="country" className="form-label">Country</label>
                                                <input type="text" className="form-control" id="country" placeholder="🇪🇬 EGYPT" />
                                            </div>
                                        </div>
                                        <div className="row mb-1">
                                            {/* Gender */}
                                            <div className='col-6'>
                                                <label htmlFor="gender">Gender</label>
                                                <select className="form-control" id="gender">
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                            </div>
                                            <div className='col-6'>
                                                {/* Phone Number */}
                                                <label htmlFor="phone">Phone Number</label>
                                                <div className="input-group">
                                                    <select className={`form-select ${styles.countryCode}`} id="countryCode" defaultValue="+20">
                                                        <option value="+1">USA</option>
                                                        <option value="+44">GB</option>
                                                        <option value="+33">FR</option>
                                                        <option value="+49">DEN</option>
                                                        <option value="+20">EGY</option>
                                                        <option value="+91">IND</option>
                                                    </select>
                                                    <input type="tel" className="form-control" id="phone" placeholder="+20100000" />
                                                </div>
                                            </div>
                                        </div>


                                        {/* Password */}
                                        <div className="mb-1 position-relative">
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
                                        {/* Confirm Password  */}
                                        <div className="mb-1 position-relative">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control rounded-end"
                                                    id="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                                <span
                                                    className={styles.inputGroupText}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    role='button'
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                    tabIndex={0}
                                                    onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}>
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </div>
                                        </div>
                                        <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                                            {isLoading ? 'Signing up...' : 'Sign up'}
                                        </button>
                                        {/* Or Signup with */}
                                        <div className="text-center mt-3">
                                            <p className={styles.lineth}>Or Signup with</p>
                                            <div className={`d-flex justify-content-center gap-3 ${styles.socialIcons}`}>
                                                <Link to={'/login'} type="button" className={styles.socialBtn} onClick={() => handleSocialLogin('google')}>
                                                    <img src={googlelogo} alt="Login with Google" className='img-fluid' />Google</Link>
                                                <Link to={'/login'} type="button" className={styles.socialBtn} onClick={() => handleSocialLogin('facebook')}>
                                                    <img src={facebooklogo} alt="Login with Facebook" className='img-fluid' />
                                                    Facebook</Link>
                                            </div>
                                        </div>
                                    </form>
                                </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthRegister
