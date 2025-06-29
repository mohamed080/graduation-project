import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Settings.module.css'
import { FaRegUser } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { IoNotifications } from 'react-icons/io5'

const Setting = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h4>Account Settings</h4>
        <button className={styles.editPreferences}>Edit Preferences</button>
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
            <FaRegUser size={20} />
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
        {/* Notifications */}
        <div 
          className={`${styles.settingsItem} pt-4`}
          onClick={() => navigate('/settings/notifications')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/settings/notifications')}
        >
          <div className='d-flex align-items-start gap-5'>
            <IoNotifications size={20} />
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
    </div>
  )
}

export default Setting
