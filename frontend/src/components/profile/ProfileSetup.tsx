import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Github, Linkedin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    github: '',
    linkedin: ''
  });
  const [resume, setResume] = useState<File | null>(null);

  const handleSubmit = async () => {
    let resumeUrl = '';
    if (resume) {
      resumeUrl = await profileService.uploadResume(resume);
    }

    updateProfile({
      name: formData.name,
      githubUrl: formData.github,
      linkedinUrl: formData.linkedin,
      resumeUrl
    });

    navigate('/skills');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Complete Your Profile</h2>
            <p className="card-description">Tell us about yourself to find the best matches</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Upload size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Upload Resume
              </label>
              <div className="upload-area">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <Upload size={32} className="upload-icon" />
                  <p className="upload-text">
                    {resume ? resume.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="upload-subtext">PDF, DOC up to 10MB</p>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Github size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                GitHub Profile
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="form-input"
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Linkedin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="form-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="button button-primary">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};