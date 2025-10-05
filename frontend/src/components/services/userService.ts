// frontend/src/services/userService.ts
import { api } from './api';

export interface UserProfile {
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  idea?: string;
}

export interface ProfileUpdateData {
  email: string;
  github_link?: string;
  linkedin_link?: string;
}

export const userService = {
  // Register a new user
  async registerUser(userData: UserProfile) {
    try {
      const response = await api.post('/register', userData);
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user profile with additional data
  async updateUserProfile(formData: FormData) {
    try {
      const response = await fetch('http://localhost:8000/profile/update', {
        method: 'PUT',
        body: formData, // Send FormData directly for file upload
      });
      
      if (!response.ok) throw new Error('Profile update failed');
      return response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};