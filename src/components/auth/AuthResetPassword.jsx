import React, { useState, useCallback } from 'react';
import styles from './AuthLogin.module.css'; // Reusing the same styles for consistency
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

        if (pwd.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumber) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setError('');

            // Validate passwords
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                setError(passwordError);
                return;
            }

            setIsLoading(true);

            try {
                // Replace with actual API call to reset password
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Assuming successful reset, navigate to login page
                navigate('/login');
            } catch (err) {
                setError('Password reset failed. Please try again.', err);
            } finally {
                setIsLoading(false);
            }
        },
        [password, confirmPassword, navigate]
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
                    <div className="col-8 ms-auto">
                        <div className={styles.loginForm}>
                            <h2>Reset Password</h2>
                            <p>Enter your new password below</p>
                            <form onSubmit={handleSubmit} aria-label="Reset password form">
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
                                            aria-label="New password"
                                            disabled={isLoading}
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
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="form-control rounded-end"
                                            id="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                                                    aria-label="Confirm password"
                                        required
                                        disabled={isLoading}
                                        />
                                        <span
                                            className={styles.inputGroupText}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            role='button'
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>
                                {error && <p className="text-danger" id="error-message" role="alert">{error}</p>}
                                <button
                                    type="submit"
                                    className={`${styles.loginBtn}`}
                                    disabled={isLoading || !password || !confirmPassword}
                                    aria-busy={isLoading}
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                            <p className='mt-5'>
                                Remembered your password? <Link to='/login' aria-label="Back to login">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthResetPassword;