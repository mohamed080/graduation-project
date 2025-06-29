import React, { useState } from 'react'
import styles from './Settings.module.css'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { CiEdit } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'

const PersonalInf = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: 'Mohamed',
    middleName: '',
    lastName: 'Ayman',
    dob: '03-14-2004',          // MM‑DD‑YYYY
    email: 'moayman080@gmail.com',
    phone: '01000000000',       // placeholder, not editable in this example
    country: 'Egypt',
    city: 'dekernes',
    governorat: 'Dakahlia',
    address: 'undefined',
    postalcode: 'undefined',
    citizenshipCountry: 'EG'
  });

  const [draft, setDraft] = useState(profile);   // copy of *current* profile
  const [editingField, setEditingField] = useState(null);
  const [errors, setErrors] = useState({ dob: '', email: '' });

  const openEditor = (field) => {
    setDraft(profile);            // preload with current values
    setErrors({ dob: '', email: '' });
    setEditingField(field);
  };

  const closeEditor = () => setEditingField(null);

  const saveName = () => {
    setProfile(draft);
    closeEditor();
  };

  const handleChange = (field) => (e) =>
    setDraft({ ...draft, [field]: e.target.value });

  const handleSaveDob = () => {
    const ok = /^(\d{2})-(\d{2})-(\d{4})$/.test(draft.dob); // add range checks if you like
    if (!ok) { setErrors({ ...errors, dob: 'Please enter a valid date (MM-DD-YYYY)' }); return; }
    setProfile(draft);
    closeEditor();
  };

  const handleSaveEmail = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
    if (!ok) { setErrors({ ...errors, email: 'Please enter a valid email address' }); return; }
    setProfile(draft);
    closeEditor();
  };

  const handleSavePhone = () => {
    const ok = /^\d{10,15}$/.test(draft.phone); // simple
    if (!ok) { setErrors({ ...errors, phone: 'Please enter a valid phone number' }); return; }
    setProfile(draft);
    closeEditor();
  };
  const handleSaveAddress = () => {
    const ok = draft.country && draft.city && draft.governorat && draft.address && draft.postalcode;
    if (!ok) { setErrors({ ...errors, address: 'Please fill in all address fields' }); return; }
    setProfile(draft);
    closeEditor();
  };

const handleSavecitizenshipCountry = () => {
  const ok = draft.citizenshipCountry;
  if (!ok) { setErrors({ ...errors, citizenshipCountry: 'Please enter a valid citizenship country' }); return; }
  setProfile(draft);
  closeEditor();
};


  return (
    <div className={styles.settingsContainer}>
      {/* back button */}
      <div className='d-flex align-items-center gap-4'
        onClick={() => navigate('/settings')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/settings')}
      >
        <div className={styles.arrowIcon}>
          <FaArrowLeftLong />
        </div>
        <p className={styles.back}>Back</p>
      </div>
      <h4 className='mt-5'>Personal Info</h4>
      <p className={styles.personinfoText}>We'll reach out if there are any issues upon any updates you make.</p>
      <div className={styles.PersonalInfContainer}>
        {/* Personal Info Item */}
        <div className={`${styles.settingsItem} pt-4`}>
          <div>
            <p className='fw-bold'>Name</p>
            <p className='text-muted'>{profile.firstName} {profile.middleName} {profile.lastName}</p>
          </div>
          <div className={styles.arrowIcon}
            role='button'
            onClick={() =>
              editingField === 'name' ? closeEditor() : openEditor('name')
            }>
            {editingField === 'name' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'name' && (
          <div className={styles.editInput}>
            <input type="text" placeholder='First Name' value={draft.firstName} onChange={handleChange('firstName')} />
            <input type="text" placeholder='Middle Name' value={draft.middleName} onChange={handleChange('middleName')} />
            <input type="text" placeholder='Last Name' value={draft.lastName} onChange={handleChange('lastName')} />
            <button onClick={saveName} className={styles.saveButton}>
              Save
            </button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        {/* DOB */}
        <div className={`${styles.settingsItem} pt-4`}>
          <div>
            <p className='fw-bold'>Date of Birth (MM-DD-YYYY)</p>
            <p className='text-muted'>{profile.dob}</p>
          </div>
          <div className={styles.arrowIcon}
            role='button'
            onClick={() =>
              editingField === 'dob' ? closeEditor() : openEditor('dob')
            }>
            {editingField === 'dob' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'dob' && (
          <div className={styles.editInput}>
            <input type="text" placeholder='MM-DD-YYYY' value={draft.dob} onChange={handleChange('dob')}
              className={`${styles.input} ${errors.dob ? styles.inputError : ''}`}
              maxLength={10}
            />
            {errors.dob && <p className={styles.errorText}>{errors.dob}</p>}
            <button onClick={handleSaveDob} className={styles.saveButton}>
              Save
            </button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        {/* Email */}
        <div className={`${styles.settingsItem} pt-4`}>
          <div>
            <p className='fw-bold'>Email: Verified</p>
            <p className='text-muted'>{profile.email}</p>
          </div>
          <div className={styles.arrowIcon} role='button' onClick={() =>
            editingField === 'email' ? closeEditor() : openEditor('email')
          }>
            {editingField === 'email' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'email' && (
          <div className={styles.editInput}>
            <input type="email"
              value={draft.email}
              placeholder="your@email.com"
              onChange={handleChange('email')}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            <button onClick={handleSaveEmail} className={styles.saveButton}>Save</button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        {/* phone */}
        <div className={`${styles.settingsItem} pt-4`}>
          <div>
            <p className='fw-bold'>Phone Number</p>
            <p className='text-muted'>{profile.phone}</p>
          </div>
          <div className={styles.arrowIcon} role='button' onClick={() =>
            editingField === 'phone' ? closeEditor() : openEditor('phone')
          }>
            {editingField === 'phone' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'phone' && (
          <div className={styles.editInput}>
            <input type="number"
              value={draft.phone}
              placeholder="Enter phone number"
              onChange={handleChange('phone')}
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            />
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
            <button onClick={handleSavePhone} className={styles.saveButton}>Save</button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        <div className={`${styles.settingsItem} pt-4`}>
          <div>
            <p className='fw-bold'>Address</p>
            <p className='text-muted'>{profile.address}</p>
            <p className='text-muted'>{profile.city}, {profile.governorat}, {profile.country}</p>
            <p className='text-muted'>{profile.postalcode}</p>
          </div>
            <div className={styles.arrowIcon} role='button' onClick={() =>
            editingField === 'address' ? closeEditor() : openEditor('address')
          }>
            {editingField === 'address' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
         {editingField === 'address' && (
          <div className={styles.editInput}>
             <input type="text" placeholder='Enter Country' value={draft.country} onChange={handleChange('country')} />
            <input type="text" placeholder='Enter Address' value={draft.address} onChange={handleChange('address')} />
            <input type="text" placeholder='Enter City' value={draft.city} onChange={handleChange('city')} />
            <input type="text" placeholder='Enter Governorat' value={draft.governorat} onChange={handleChange('governorat')} />
            <input type="text" placeholder='Enter Postal Code' value={draft.postalcode} onChange={handleChange('postalcode')} />
            {errors.address && <p className={styles.errorText}>{errors.address}</p>}
            <button onClick={handleSaveAddress} className={styles.saveButton}>Save</button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
        <div className={`${styles.settingsItem} pt-4`}>
          <div>
            <p className='fw-bold'>Citizenship Country</p>
            <p className='text-muted'>{profile.citizenshipCountry}</p>
          </div>
          <div className={styles.arrowIcon} role='button' onClick={() =>
            editingField === 'citizenshipCountry' ? closeEditor() : openEditor('citizenshipCountry')
          }>
            {editingField === 'citizenshipCountry' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
         {editingField === 'citizenshipCountry' && (
          <div className={styles.editInput}>
            <input type="text"
              value={draft.citizenshipCountry}
              placeholder="Enter citizenshipCountry"
              onChange={handleChange('citizenshipCountry')}
              className={`${styles.input} ${errors.citizenshipCountry ? styles.inputError : ''}`}
            />
            {errors.citizenshipCountry && <p className={styles.errorText}>{errors.citizenshipCountry}</p>}
            <button onClick={handleSavecitizenshipCountry} className={styles.saveButton}>Save</button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
      </div>
    </div>
  )
}

export default PersonalInf
