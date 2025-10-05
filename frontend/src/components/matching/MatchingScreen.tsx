import React from 'react';
import { Sparkles } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { useAuth } from '../context/AuthContext';
import { useMatching } from '../../hooks/useMatching';

export const MatchingScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    currentMatch,
    loading,
    hasMoreMatches,
    handleLike,
    handlePass,
    reset
  } = useMatching(user?.email);

  if (loading) {
    return (
      <div className="matching-container">
        <div className="matching-content">
          <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
            Loading matches...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="matching-container">
      <div className="matching-content">
        <div className="matching-header">
          <h2 className="matching-title">
            <Sparkles size={32} />
            Your Matches
          </h2>
          <p className="matching-subtitle">Swipe to connect with developers</p>
        </div>

        {hasMoreMatches && currentMatch ? (
          <MatchCard
            match={currentMatch}
            onLike={() => handleLike(currentMatch.id)}
            onPass={() => handlePass(currentMatch.id)}
          />
        ) : (
          <div className="completed-card">
            <div className="completed-emoji">🎉</div>
            <h3 className="completed-title">All Caught Up!</h3>
            <p className="completed-text">Check back later for more matches</p>
            <button onClick={reset} className="button button-primary">
              Review Matches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};