import React from 'react';
import styles from './Settings.module.css';
import { IoClose } from 'react-icons/io5';

const PreferencesModal = ({
    showModal,
    onClose,
    categories,
    selectedPreferences,
    togglePreference,
    loading,
    error,
    saveError,
    onSavePreferences
}) => {
    if (!showModal) return null;

       const token = localStorage.getItem('accessToken');
    const isAuthenticated = Boolean(token);
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoClose size={24} />
                </button>

                <div className={styles.modalBody}>
                    <p className={styles.modalTitle}>Preferences</p>
                    <p className={styles.modalDescription}>
                        We want to provide an experience that fits your investment needs.
                        <br />
                        Choose at least three categories for best experience.
                    </p>

                    {loading ? (
                        <div className={styles.loadingMessage}>Loading categories...</div>
                    ) : error ? (
                        <div className={styles.errorMessage}>
                            {error}
                            <button className={styles.retryButton} onClick={() => window.location.reload()}>
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className={styles.preferencesGrid}>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`${styles.preferenceButton} ${selectedPreferences.includes(category.id) ? styles.selected : ''
                                        }`}
                                    onClick={() => togglePreference(category.id)}
                                    type="button"
                                >
                                    {category.name}
                                    {selectedPreferences.includes(category.id) && (
                                        <span className={styles.selectedIndicator}>✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {saveError && <div className={styles.saveErrorMessage}>{saveError}</div>}
                    {!isAuthenticated && (
                        <div className={styles.saveErrorMessage}>
                            You must have an account to save preferences.
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <div className={styles.saveButtonContainer}>
                        <button
                            className={styles.saveButton}
                            onClick={onSavePreferences}
                            disabled={!isAuthenticated || selectedPreferences.length === 0 || loading}
                        >
                            {loading ? 'Saving...' : 'Update and See Offering'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;
