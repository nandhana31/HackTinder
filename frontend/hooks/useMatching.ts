import { useState, useEffect } from 'react';
import { Match } from '../components/types';
import { matchingService } from '../components/services/matchingService';

export const useMatching = (userId?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadMatches();
    }
  }, [userId]);

  const loadMatches = async () => {
    if (!userId) return;
    setLoading(true);
    const data = await matchingService.getMatches(userId);
    setMatches(data);
    setLoading(false);
  };

  const handleLike = async (matchId: string) => {
    if (!userId) return;
    await matchingService.likeUser(userId, matchId);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = async (matchId: string) => {
    if (!userId) return;
    await matchingService.passUser(userId, matchId);
    setCurrentIndex(prev => prev + 1);
  };

  return {
    matches,
    currentMatch: matches[currentIndex],
    currentIndex,
    hasMoreMatches: currentIndex < matches.length,
    loading,
    handleLike,
    handlePass,
    reset: () => setCurrentIndex(0)
  };
};