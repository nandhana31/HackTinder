import { Match } from '../types';
import { MOCK_MATCHES } from '../../utils/constants';

export const matchingService = {
  getMatches: async (userId: string): Promise<Match[]> => {
    // TODO: Implement API call to get matches
    console.log('Getting matches for user:', userId);
    return MOCK_MATCHES;
  },

  likeUser: async (userId: string, likedUserId: string): Promise<boolean> => {
    // TODO: Implement API call to like user
    console.log('User', userId, 'liked', likedUserId);
    return true;
  },

  passUser: async (userId: string, passedUserId: string): Promise<boolean> => {
    // TODO: Implement API call to pass user
    console.log('User', userId, 'passed', passedUserId);
    return true;
  }
};