import React, { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import MoreProjects from '../components/home/MoreProjects'
import HowToInvest from '../components/home/HowToInvest'
import Questions from '../components/home/Questions'
import PreferencesModal from '../components/settings/PreferencesModal'
import useCategories from '../hooks/useCategories'

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [saveError, setSaveError] = useState('');
  const { categories, loading, error } = useCategories();

  useEffect(() => {
  const token = localStorage.getItem('accessToken'); // or whatever your token key is
  const savedPreferences = localStorage.getItem('userPreferences');

  if (token && !savedPreferences) {
    // Only show modal if user is logged in (token exists) and preferences not saved
    setShowModal(true);
  } else if (savedPreferences) {
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
      setSaveError('Please select at least three categories for the best experience.');
      return;
    }
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(selectedPreferences));
    console.log('Saved preferences:', selectedPreferences);
    setShowModal(false);
  };
  return (
    <>
      <Hero />
      <MoreProjects />
      <HowToInvest />
      <Questions />
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
    </>
  )
}

export default Home
