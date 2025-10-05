import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { ProfileSetup } from './components/profile/ProfileSetup';
import { SkillsSelection } from './components/onboarding/SkillsSelection';
import { InterestsSelection } from './components/onboarding/InterestsSelection';
import { MatchingScreen } from './components/matching/MatchingScreen';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <PrivateRoute>
                <SkillsSelection />
              </PrivateRoute>
            }
          />
          <Route
            path="/interests"
            element={
              <PrivateRoute>
                <InterestsSelection />
              </PrivateRoute>
            }
          />
          <Route
            path="/matching"
            element={
              <PrivateRoute>
                <MatchingScreen />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;