import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Settings.module.css'
import { FaRegUser } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { IoClose, IoNotifications } from 'react-icons/io5'
import axiosInstance from '../../utils/axiosInstance'
import { TiLockClosedOutline } from 'react-icons/ti'

const Setting = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/categories');
        setCategories(response.data);
      } catch (error) {
        setError('Failed to load categories. Please try again.');
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // Handle checkbox changes
  const togglePreference = (id) => {
    setSaveError('');
    setSelectedPreferences(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Handle save preferences
  const handleSavePreferences = () => {
    if (selectedPreferences.length < 3) {
      alert('Please select at least three categories for the best experience.');
      return;
    }
    // TODO: Save preferences to backend or local storage
    console.log('Saved preferences:', selectedPreferences);
    setShowModal(false);
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h4>Account Settings</h4>
        <button className={styles.editPreferences}
          onClick={() => setShowModal(true)}
          aria-label='Edit investment Preferences'>Edit Preferences</button>
      </div>
      <div className={styles.settingsContent}>
        {/* Personal Info */}
        <div
          className={styles.settingsItem}
          onClick={() => navigate('/settings/personal-info')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/settings/personal-info')}
        >
          <div className='d-flex align-items-start gap-5'>
            <FaRegUser size={20} className={styles.icon} />
            <div>
              <p className='fw-bold'>Personal Info</p>
              <p className='text-muted'>Mohamed Ayman</p>
            </div>
          </div>
          <div className={styles.arrowIcon}>
            <FaArrowRightLong />
          </div>
        </div>
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        {/* Security */}
        <div
          className={`${styles.settingsItem} pt-4`}
          onClick={() => navigate('/settings/security')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/settings/security')}
        >
          <div className='d-flex align-items-start gap-5'>
            <TiLockClosedOutline size={20} className={styles.icon} />
            <div>
              <p className='fw-bold'>Security</p>
              <p className='text-muted'>Password & 2FA <span style={{ color: 'rgb(224, 96, 4)'}}>. 2FA Available</span></p>
            </div>
          </div>
          <div className={styles.arrowIcon}>
            <FaArrowRightLong />
          </div>
        </div>
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        {/* Notifications */}
        <div
          className={`${styles.settingsItem} pt-4`}
          onClick={() => navigate('/settings/notifications')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/settings/notifications')}
        >
          <div className='d-flex align-items-start gap-5'>
            <IoNotifications size={20} className={styles.icon} />
            <div>
              <p className='fw-bold'>Notifications</p>
              <p className='text-muted'>Choose notification preferences</p>
            </div>
          </div>
          <div className={styles.arrowIcon}>
            <FaArrowRightLong />
          </div>
        </div>
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
      </div>
      {/* Modal Overlay */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
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
                <div className={styles.loadingMessage}>
                  Loading categories...
                </div>
              ) : error ? (
                <div className={styles.errorMessage}>
                  {error}
                  <button
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className={styles.preferencesGrid}>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`${styles.preferenceButton} ${selectedPreferences.includes(category.id)
                        ? styles.selected
                        : ''
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

              {saveError && (
                <div className={styles.saveErrorMessage}>
                  {saveError}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
            <div className={styles.saveButtonContainer}>
                <button
                  className={styles.saveButton}
                  onClick={handleSavePreferences}
                  disabled={selectedPreferences.length <= 0 || loading}
                >
                  {loading ? 'Saving...' : 'update and see Offering'}
                </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Setting
