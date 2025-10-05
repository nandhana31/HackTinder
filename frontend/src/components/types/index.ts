export interface User {
  id: string;
  name: string;
  email: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  interests: string[];
}

export interface Match {
  id: string;
  name: string;
  skills: string[];
  interests: string[];
  matchScore: number;
  avatar: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
}