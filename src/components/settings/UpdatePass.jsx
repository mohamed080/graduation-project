import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './Settings.module.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa6';
import axiosInstance from '../../utils/axiosInstance';

const UpdatePass = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [visibility, setVisibility] = useState({
        password: false,
        newPassword: false,
        confirmPassword: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength meter
    useEffect(() => {
        if (!formData.newPassword) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (formData.newPassword.length >= 8) strength += 1;
        if (/[A-Z]/.test(formData.newPassword)) strength += 1;
        if (/\d/.test(formData.newPassword)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) strength += 1;

        setPasswordStrength(strength);
    }, [formData.newPassword]);

    // Password requirements checklist
    const requirements = useMemo(
        () => [
            { text: 'At least 8 characters', valid: formData.newPassword?.length >= 8 },
            { text: 'Contains a capital letter', valid: /[A-Z]/.test(formData.newPassword) },
            { text: 'Contains a number', valid: /\d/.test(formData.newPassword) },
            { text: 'Contains a special character', valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) }
        ],
        [formData.newPassword]
    );

    const toggleVisibility = (field) => {
        setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Clear error when user types
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
    };


    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };
    const validate = useCallback(() => {
        const newErrors = {};

        if (!formData.password) newErrors.password = 'Current password is required';
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';

        if (formData.newPassword && formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }

        if (formData.newPassword && passwordStrength < 3) {
            newErrors.newPassword = 'Password does not meet requirements';
        }

        if (formData.newPassword && formData.confirmPassword &&
            formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, passwordStrength]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No authentication token found');

            const payload = {
                current_password: formData.password,
                new_password: formData.newPassword,
                new_password_confirmation: formData.confirmPassword
            };
            await axiosInstance.post('/password', payload);
            setSuccess(true);
            setFormData({ password: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            const apiErrors = error.response?.data?.errors; // For field-specific errors
            const apiMessage = error.response?.data?.message; // For general error message
            const newErrors = {};

            if (apiErrors && typeof apiErrors === 'object') {
                if (apiErrors.current_password) newErrors.password = apiErrors.current_password[0];
                if (apiErrors.new_password) newErrors.newPassword = apiErrors.new_password[0];
                if (apiErrors.new_password_confirmation) newErrors.confirmPassword = apiErrors.new_password_confirmation[0];
            }
            else if (apiMessage && typeof apiMessage === 'string') {
                newErrors.submit = apiMessage;
            } else {
                newErrors.submit = 'Failed to update password. Please try again.';
            }

            setErrors(newErrors);
        } finally {
            setIsLoading(false);
        }
    },
        [formData, validate]
    );



    return (
        <div className={styles.settingsContainer}>
            {/* Back Navigation */}
            <div
                className={`d-flex align-items-center gap-4 ${styles.backButton}`}
                onClick={() => navigate('/settings/security')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, () => navigate('/settings/security'))}
                aria-label="Back to security settings"
            >
                <div className={styles.arrowIcon} aria-hidden="true">
                    <FaArrowLeftLong />
                </div>
                <p className={styles.back}>Back</p>
            </div>

            <h4 className='mt-5'>Security</h4>
            <h6 className={`mt-5 ${styles.updatePass}`}>Update Password</h6>
            <p className={styles.personinfoText}>Password will update immediately</p>

            <div className={`my-5 ${styles.settingsContent}`}>
                <form onSubmit={handleSubmit}>
                    {/* Current Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Current Password</label>
                        <div className="input-group">
                            <input
                                type={visibility.password ? "text" : "password"}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                placeholder="Current Password"
                                value={formData.password}
                                onChange={handleChange}
                                aria-describedby="passwordHelp"
                                required
                            />
                            <span
                                className={`${styles.inputGroupText} ${visibility.password ? styles.visible : ''} ${errors.confirmPassword ? 'd-none' : ''}`}
                                role='button'
                                tabIndex={0}
                                aria-label={visibility.password ? "Hide password" : "Show password"}
                                onClick={() => toggleVisibility('password')}
                                onKeyDown={(e) => handleKeyDown(e, () => toggleVisibility('password'))}
                            >
                                {visibility.password ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <div className="input-group">
                            <input
                                type={visibility.newPassword ? "text" : "password"}
                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                id="newPassword"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className={`${styles.inputGroupText} ${visibility.newPassword ? styles.visible : ''} ${errors.confirmPassword ? 'd-none' : ''}`}
                                role='button'
                                tabIndex={0}
                                aria-label={visibility.newPassword ? "Hide password" : "Show password"}
                                onClick={() => toggleVisibility('newPassword')}
                                onKeyDown={(e) => handleKeyDown(e, () => toggleVisibility('newPassword'))}
                            >
                                {visibility.newPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.newPassword && (
                                <div className="invalid-feedback">{errors.newPassword}</div>
                            )}
                        </div>

                        {/* Password Strength Meter */}
                        <div className="mt-2">
                            <div className={styles.strengthMeter}>
                                <div
                                    className={`
                                        ${styles.strengthBar} 
                                        ${passwordStrength > 0 ? styles.active : ''}
                                        ${passwordStrength === 1 ? styles.weak : ''}
                                        ${passwordStrength === 2 ? styles.medium : ''}
                                        ${passwordStrength >= 3 ? styles.strong : ''}
                                    `}
                                />
                                <div
                                    className={`
                                        ${styles.strengthBar} 
                                        ${passwordStrength > 1 ? styles.active : ''}
                                        ${passwordStrength === 2 ? styles.medium : ''}
                                        ${passwordStrength >= 3 ? styles.strong : ''}
                                    `}
                                />
                                <div
                                    className={`
                                        ${styles.strengthBar} 
                                        ${passwordStrength > 2 ? styles.active : ''}
                                        ${passwordStrength >= 3 ? styles.strong : ''}
                                    `}
                                />
                                <div
                                    className={`
                                        ${styles.strengthBar} 
                                        ${passwordStrength > 3 ? styles.active : ''}
                                        ${passwordStrength >= 4 ? styles.strong : ''}
                                    `}
                                />
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-3">
                            <p className={styles.requirementsTitle}>Password must include:</p>
                            <ul className={styles.requirementsList}>
                                {requirements.map((req, i) => (
                                    <li key={i} className={req.valid ? styles.valid : ''}>
                                        {req.valid ? <FaCheck className="me-2" /> : <span className={styles.bullet}>•</span>}
                                        {req.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <div className="input-group">
                            <input
                                type={visibility.confirmPassword ? "text" : "password"}
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className={`${styles.inputGroupText} ${visibility.confirmPassword ? styles.visible : ''} ${errors.confirmPassword ? 'd-none' : ''}`}
                                role='button'
                                tabIndex={0}
                                aria-label={visibility.confirmPassword ? "Hide password" : "Show password"}
                                onClick={() => toggleVisibility('confirmPassword')}
                                onKeyDown={(e) => handleKeyDown(e, () => toggleVisibility('confirmPassword'))}
                            >
                                {visibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className={`alert alert-danger ${styles.alert}`}>
                            {errors.submit}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className={`alert alert-success ${styles.alert}`}>
                            Password updated successfully!
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`mt-4 ${styles.updateButton}`}
                        disabled={
                            isLoading ||
                            !formData.password ||
                            !formData.newPassword ||
                            !formData.confirmPassword ||
                            passwordStrength < 3}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePass;