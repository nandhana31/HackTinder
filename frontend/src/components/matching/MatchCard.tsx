import React from 'react';
import { Heart, X, Github, Linkedin } from 'lucide-react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  onLike: () => void;
  onPass: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onPass }) => {
  return (
    <div className="match-card">
      <div className="match-header">
        <div className="match-avatar">{match.avatar}</div>
        <h3 className="match-name">{match.name}</h3>
        <div className="match-score">
          <Heart size={20} />
          <span>{match.matchScore}% Match</span>
        </div>

        {(match.githubUrl || match.linkedinUrl) && (
          <div className="social-links">
            {match.githubUrl && (
              <a
                href={match.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Github size={20} />
              </a>
            )}
            {match.linkedinUrl && (
              <a
                href={match.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="match-body">
        <div className="match-section">
          <h4 className="match-section-title">Skills</h4>
          <div className="skills-list">
            {match.skills.map(skill => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="match-section">
          <h4 className="match-section-title">Interests</h4>
          <div className="interests-list">
            {match.interests.map(interest => (
              <span key={interest} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="match-actions">
        <button onClick={onPass} className="action-button action-pass">
          <X size={24} />
          Pass
        </button>
        <button onClick={onLike} className="action-button action-like">
          <Heart size={24} />
          Connect
        </button>
      </div>
    </div>
  );
};