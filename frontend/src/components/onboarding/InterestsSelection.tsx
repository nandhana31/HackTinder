// frontend/src/components/onboarding/InterestsSelection.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INTERESTS } from '../../utils/constants';

export const InterestsSelection: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, registerUser } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update profile with interests
      updateProfile({ interests: selectedInterests });
      
      // Register user with backend
      await registerUser();
      
      // Navigate to matching page
      navigate('/matching');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="selection-container">
      <div className="selection-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Areas of Interest</h2>
            <p className="card-description">What kind of projects excite you?</p>
          </div>

          <div className="tags-container">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`tag ${selectedInterests.includes(interest) ? 'tag-selected-blue' : 'tag-default'}`}
                disabled={isLoading}
              >
                {interest}
                {selectedInterests.includes(interest) && (
                  <CheckCircle size={16} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                )}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
              {error}
            </p>
          )}

          <div style={{ paddingTop: '1rem' }}>
            <p className="selection-info">
              Selected: {selectedInterests.length} interests
            </p>
            <button 
              onClick={handleContinue} 
              className="button button-primary"
              disabled={selectedInterests.length === 0 || isLoading}
            >
              {isLoading ? 'Saving Profile...' : 'Find My Matches'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};