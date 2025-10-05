import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SKILLS } from '../../utils/constants';

export const SkillsSelection: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleContinue = () => {
    updateProfile({ skills: selectedSkills });
    navigate('/interests');
  };

  return (
    <div className="selection-container">
      <div className="selection-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Your Skills</h2>
            <p className="card-description">Choose the technologies you're proficient in</p>
          </div>

          <div className="tags-container">
            {SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`tag ${selectedSkills.includes(skill) ? 'tag-selected-purple' : 'tag-default'}`}
              >
                {skill}
                {selectedSkills.includes(skill) && (
                  <CheckCircle size={16} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                )}
              </button>
            ))}
          </div>

          <div style={{ paddingTop: '1rem' }}>
            <p className="selection-info">
              Selected: {selectedSkills.length} skills
            </p>
            <button 
              onClick={handleContinue} 
              className="button button-primary"
              disabled={selectedSkills.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};