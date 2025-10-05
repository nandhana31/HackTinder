import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth0Login = async () => {
    await login();
    navigate('/profile');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="login-icon">
              <Code size={48} color="white" />
            </div>
          </div>
          <h1 className="login-title">Hack Tinder</h1>
          <p className="login-subtitle">Find your perfect coding partner</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleAuth0Login} className="button button-primary">
            <Users size={20} />
            Sign in with Auth0
          </button>

          <div className="divider-container">
            <div className="divider">
              <span className="divider-text">or continue with</span>
            </div>
          </div>

          <button className="button button-secondary">
            <Github size={20} />
            GitHub
          </button>
        </div>

        <p className="terms">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};