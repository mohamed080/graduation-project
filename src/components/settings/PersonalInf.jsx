import React, { useEffect, useState } from 'react'
import styles from './Settings.module.css'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { CiEdit } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { useUser } from '../../context/AuthContext'
import axiosInstance from '../../utils/axiosInstance'

const PersonalInf = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser, loading, setLoading } = useUser();
  console.log(currentUser)
  const [profile, setProfile] = useState(null);
  // const [profile, setProfile] = useState({
  //   firstName: 'Mohamed',
  //   middleName: '',
  //   lastName: 'Ayman',
  //   birth_date: '03-14-2004',          // MM‑DD‑YYYY
  //   email: 'moayman080@gmail.com',
  //   phone: '01000000000',       // placeholder, not editable in this example
  //   country: 'Egypt',
  //   city: 'dekernes',
  //   governorat: 'Dakahlia',
  //   address: 'undefined',
  //   postalcode: 'undefined',
  //   citizenshipCountry: 'EG'
  // });

  const [draft, setDraft] = useState(null);   // copy of *current* profile
  const [editingField, setEditingField] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Function to split full name into parts
  const splitFullName = (fullName) => {
    if (!fullName) return { firstName: '', middleName: '', lastName: '' };

    const nameParts = fullName.split(' ');
    return {
      firstName: nameParts[0] || '',
      middleName: nameParts.slice(1, -1).join(' ') || '',
      lastName: nameParts[nameParts.length - 1] || ''
    };
  };

  // Function to merge name parts into full name
  const mergeFullName = (firstName, middleName, lastName) => {
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };
  useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      if (draft?.profile_image && draft.profile_image.startsWith('blob:')) {
        URL.revokeObjectURL(draft.profile_image);
      }
    };
  }, [draft]);

  useEffect(() => {
    if (currentUser) {
      // Split the full name when receiving data from API
      const nameParts = splitFullName(currentUser.name);

      setProfile({
        ...currentUser,
        ...nameParts
      });

      setDraft({
        ...currentUser,
        ...nameParts
      });
    }
  }, [currentUser]);

  const openEditor = (field) => {
    setDraft({ ...profile });            // preload with current values
    setErrors({});
    setEditingField(field);
    setSuccessMessage('');
  };

  const closeEditor = () => setEditingField(null);

  const handleChange = (field) => (e) =>
    setDraft({ ...draft, [field]: e.target.value });


  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();

      // Handle file upload separately
      if (updatedData.imageFile) {
        formData.append('profile_image', updatedData.imageFile);
        // Remove temporary properties
        delete updatedData.imageFile;
        delete updatedData.profile_image; // Remove the preview URL
      }

      // Add other fields to formData
      for (const key in updatedData) {
        if (updatedData[key] !== undefined && updatedData[key] !== null) {
          // Handle nested objects if needed
          if (typeof updatedData[key] === 'object') {
            formData.append(key, JSON.stringify(updatedData[key]));
          } else {
            formData.append(key, updatedData[key]);
          }
        }
      }

      // If updating name, merge the parts
      if (updatedData.firstName || updatedData.middleName || updatedData.lastName) {
        const fullName = mergeFullName(
          updatedData.firstName || draft.firstName,
          updatedData.middleName || draft.middleName,
          updatedData.lastName || draft.lastName
        );
        formData.append('name', fullName);
      }

      const response = await axiosInstance.put('/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Process response
      const nameParts = splitFullName(response.data.name);
      const updatedProfile = {
        ...response.data,
        ...nameParts
      };

      setProfile(updatedProfile);
      setDraft(updatedProfile);
      updateUser(updatedProfile);

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      const errorMsg = error.response?.data?.message || 'Update failed. Please try again.';
      setErrors({ general: errorMsg });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field, validator) => {
    if (validator && !validator()) return;

    const updatedFields = {};
    switch (field) {
      case 'name':
        updatedFields.firstName = draft.firstName;
        updatedFields.middleName = draft.middleName;
        updatedFields.lastName = draft.lastName;
        break;
      case 'birth_date':
        updatedFields.birth_date = draft.birth_date;
        break;
      case 'email':
        updatedFields.email = draft.email;
        break;
      case 'phone':
        updatedFields.phone = draft.phone;
        break;
      case 'address':
        updatedFields.country = draft.country;
        updatedFields.city = draft.city;
        updatedFields.governorat = draft.governorat;
        updatedFields.address = draft.address;
        updatedFields.postalcode = draft.postalcode;
        break;
      case 'citizenshipCountry':
        updatedFields.citizenshipCountry = draft.citizenshipCountry;
        break;
      case 'title':
        updatedFields.title = draft.title;
        break;
      case 'bio':
        updatedFields.bio = draft.bio;
        break;
      case 'profile_image':
        updatedFields.profile_image = draft.profile_image;
        break;
      case 'gender':
        updatedFields.gender = draft.gender;
        break;
      default:
        break;
    }

    const success = await updateProfile(updatedFields);
    if (success) closeEditor();
  };

  // Validation functions
  const validatebirth_date = () => {
    const isValid = /^(\d{2})-(\d{2})-(\d{4})$/.test(draft.birth_date);
    if (!isValid) {
      setErrors({ birth_date: 'Please enter a valid date (MM-DD-YYYY)' });
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
    if (!isValid) {
      setErrors({ email: 'Please enter a valid email address' });
      return false;
    }
    return true;
  };

  const validatePhone = () => {
    const isValid = /^\d{10,15}$/.test(draft.phone);
    if (!isValid) {
      setErrors({ phone: 'Please enter a valid phone number (10-15 digits)' });
      return false;
    }
    return true;
  };

  const validateAddress = () => {
    const isValid = draft.country && draft.city && draft.governorat && draft.address && draft.postalcode;
    if (!isValid) {
      setErrors({ address: 'Please fill in all address fields' });
      return false;
    }
    return true;
  };
  if (!profile) {
    return (
      <div className={styles.settingsContainer}>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      {/* Back Button */}
      <div
        className={`d-flex align-items-center gap-4 ${styles.backButton}`}
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

      {/* Success Message */}
      {successMessage && (
        <div className={`alert alert-success ${styles.successAlert}`}>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className={`alert alert-danger ${styles.errorAlert}`}>
          {errors.general}
        </div>
      )}

      <h4 className='mt-5'>Personal Info</h4>
      <p className={styles.personinfoText}>
        We'll reach out if there are any issues upon any updates you make.
      </p>

      <div className={styles.PersonalInfContainer}>
        {/* Name */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Name</p>
            <p className='text-muted'>
              {profile.firstName} {profile.middleName} {profile.lastName}
            </p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'name' ? closeEditor() : openEditor('name')}
          >
            {editingField === 'name' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'name' && (
          <div className={styles.editInput}>
            <input
              type="text"
              placeholder='First Name'
              value={draft.firstName}
              onChange={handleChange('firstName')}
            />
            <input
              type="text"
              placeholder='Middle Name'
              value={draft.middleName}
              onChange={handleChange('middleName')}
            />
            <input
              type="text"
              placeholder='Last Name'
              value={draft.lastName}
              onChange={handleChange('lastName')}
            />
            <button
              onClick={() => handleSave('name')}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>
        {/* Job Title */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Job Title</p>
            <p className='text-muted'>
              {profile.title || 'Not specified'}
            </p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'title' ? closeEditor() : openEditor('title')}
          >
            {editingField === 'title' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'title' && (
          <div className={styles.editInput}>
            <input
              type="text"
              placeholder='Enter your job title'
              value={draft.title || ''}
              onChange={handleChange('title')}
            />
            <button
              onClick={() => handleSave('title')}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Profile Image */}
        {/* Profile Image Section */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Profile Image</p>
            <div className="d-flex align-items-center gap-3">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="Profile"
                  className={styles.profileImagePreview}
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <span>No image</span>
                </div>
              )}
              <p className='text-muted mb-0'>
                {profile.profile_image ? 'Image uploaded' : 'No profile image'}
              </p>
            </div>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'profile_image' ? closeEditor() : openEditor('profile_image')}
          >
            {editingField === 'profile_image' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'profile_image' && (
          <div className={styles.editInput}>
            <div className={styles.fileUploadContainer}>
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                className={styles.fileInput}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Create a preview URL for the selected image
                    const previewUrl = URL.createObjectURL(file);
                    setDraft({
                      ...draft,
                      profile_image: previewUrl,
                      imageFile: file  // Store the actual file for upload
                    });
                  }
                }}
              />
              <label htmlFor="profileImageUpload" className={styles.fileUploadButton}>
                Choose Image
              </label>
              {draft.profile_image && (
                <div className="mt-3">
                  <p className="mb-1">Preview:</p>
                  <img
                    src={draft.profile_image}
                    alt="Preview"
                    className={styles.profileImagePreview}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => handleSave('profile_image')}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Gender Section */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Gender</p>
            <p className='text-muted'>{profile.gender || 'Not specified'}</p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'gender' ? closeEditor() : openEditor('gender')}
          >
            {editingField === 'gender' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'gender' && (
          <div className={styles.editInput}>
            <select
              value={draft.gender || ''}
              onChange={handleChange('gender')}
              className='form-select'
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            <button
              onClick={() => handleSave('gender')}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Bio */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Bio</p>
            <p className='text-muted'>
              {profile.bio || 'No bio added yet'}
            </p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'bio' ? closeEditor() : openEditor('bio')}
          >
            {editingField === 'bio' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'bio' && (
          <div className={styles.editInput}>
            <textarea
              placeholder='Tell us about yourself...'
              value={draft.bio || ''}
              onChange={handleChange('bio')}
              rows={4}
              className={styles.bioTextarea}
            />
            <button
              onClick={() => handleSave('bio')}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* birth_date */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Date of Birth (MM-DD-YYYY)</p>
            <p className='text-muted'>{profile.birth_date}</p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'birth_date' ? closeEditor() : openEditor('birth_date')}
          >
            {editingField === 'birth_date' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'birth_date' && (
          <div className={styles.editInput}>
            <input
              type="text"
              placeholder='MM-DD-YYYY'
              value={draft.birth_date}
              onChange={handleChange('birth_date')}
              className={`${styles.input} ${errors.birth_date ? styles.inputError : ''}`}
              maxLength={10}
            />
            {errors.birth_date && <p className={styles.errorText}>{errors.birth_date}</p>}
            <button
              onClick={() => handleSave('birth_date', validatebirth_date)}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Email */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Email: <span style={{color: 'var(--primary-color)'}}>Verified</span></p>
            <p className='text-muted'>{profile.email}</p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'email' ? closeEditor() : openEditor('email')}
          >
            {editingField === 'email' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'email' && (
          <div className={styles.editInput}>
            <input
              type="email"
              value={draft.email}
              placeholder="your@email.com"
              onChange={handleChange('email')}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            <button
              onClick={() => handleSave('email', validateEmail)}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Phone */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Phone Number</p>
            <p className='text-muted'>{profile.phone}</p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'phone' ? closeEditor() : openEditor('phone')}
          >
            {editingField === 'phone' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'phone' && (
          <div className={styles.editInput}>
            <input
              type="tel"
              value={draft.phone}
              placeholder="Enter phone number"
              onChange={handleChange('phone')}
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            />
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
            <button
              onClick={() => handleSave('phone', validatePhone)}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Address */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Address</p>
            <p className='text-muted'>{profile.address}</p>
            <p className='text-muted'>{profile.city}, {profile.governorat}, {profile.country}</p>
            <p className='text-muted'>{profile.postalcode}</p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'address' ? closeEditor() : openEditor('address')}
          >
            {editingField === 'address' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'address' && (
          <div className={styles.editInput}>
            <input
              type="text"
              placeholder='Enter Country'
              value={draft.country}
              onChange={handleChange('country')}
            />
            <input
              type="text"
              placeholder='Enter Address'
              value={draft.address}
              onChange={handleChange('address')}
            />
            <input
              type="text"
              placeholder='Enter City'
              value={draft.city}
              onChange={handleChange('city')}
            />
            <input
              type="text"
              placeholder='Enter Governorat'
              value={draft.governorat}
              onChange={handleChange('governorat')}
            />
            <input
              type="text"
              placeholder='Enter Postal Code'
              value={draft.postalcode}
              onChange={handleChange('postalcode')}
            />
            {errors.address && <p className={styles.errorText}>{errors.address}</p>}
            <button
              onClick={() => handleSave('address', validateAddress)}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line>
        </svg>

        {/* Citizenship */}
        <div className={`${styles.settingsItem} pt-4 pb-4`}>
          <div>
            <p className='fw-bold'>Citizenship Country</p>
            <p className='text-muted'>{profile.citizenshipCountry}</p>
          </div>
          <div
            className={styles.arrowIcon}
            role='button'
            onClick={() => editingField === 'citizenshipCountry' ? closeEditor() : openEditor('citizenshipCountry')}
          >
            {editingField === 'citizenshipCountry' ? <IoClose size={20} /> : <CiEdit size={20} strokeWidth={1} />}
          </div>
        </div>
        {editingField === 'citizenshipCountry' && (
          <div className={styles.editInput}>
            <input
              type="text"
              value={draft.citizenshipCountry}
              placeholder="Enter citizenshipCountry"
              onChange={handleChange('citizenshipCountry')}
              className={`${styles.input} ${errors.citizenshipCountry ? styles.inputError : ''}`}
            />
            {errors.citizenshipCountry && <p className={styles.errorText}>{errors.citizenshipCountry}</p>}
            <button
              onClick={() => handleSave('citizenshipCountry')}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInf;