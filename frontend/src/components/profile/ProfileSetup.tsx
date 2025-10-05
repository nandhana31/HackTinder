// frontend/src/components/profile/ProfileSetup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idea: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save basic profile info to context
    updateProfile({
      name: formData.name,
      email: formData.email,
      idea: formData.idea,
    });
    
    // Navigate to skills selection
    navigate('/skills');
  };

  return (
    <div className="selection-container">
      <div className="selection-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Create Your Profile</h2>
            <p className="card-description">Let's get to know you better</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Project Idea (Optional)
              </label>
              <textarea
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                }}
                placeholder="Describe your hackathon project idea..."
              />
            </div>

            <button type="submit" className="button button-primary">
              Continue to Skills
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};