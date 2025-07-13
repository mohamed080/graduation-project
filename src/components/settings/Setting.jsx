import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Settings.module.css'
import { FaRegUser } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { IoClose, IoNotifications } from 'react-icons/io5'
import { TiLockClosedOutline } from 'react-icons/ti'
import useCategories from '../../hooks/useCategories'
import PreferencesModal from './PreferencesModal'

const Setting = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [saveError, setSaveError] = useState('');

  const { categories, loading, error } = useCategories();

  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setSelectedPreferences(JSON.parse(savedPreferences));
    }
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
    
    localStorage.setItem('userPreferences', JSON.stringify(selectedPreferences));
    console.log('Updated preferences:', selectedPreferences);
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
              <p className='text-muted'>Password & 2FA <span style={{ color: 'rgb(224, 96, 4)' }}>. 2FA Available</span></p>
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
      <PreferencesModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        categories={categories}
        selectedPreferences={selectedPreferences}
        togglePreference={togglePreference}
        loading={loading}
        error={error}
        saveError={saveError}
        onSavePreferences={handleSavePreferences}
      />
    </div>
  )
}

export default Setting
