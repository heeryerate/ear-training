import './Auth.css';

import React, { useState } from 'react';

import { useUser } from '../../contexts/UserContext';
import { ForgotPassword } from './ForgotPassword';

interface UnifiedAuthProps {
  onForgotPassword?: () => void;
}

export const UnifiedAuth: React.FC<UnifiedAuthProps> = ({
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp } = useUser();

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
        {...(onForgotPassword && { onForgotPassword })}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsSigningUp(false);

    try {
      // Try to sign in first
      await signIn(email, password);
    } catch (err: any) {
      // If user doesn't exist, automatically try to sign up
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential'
      ) {
        setIsSigningUp(true);
        try {
          // Validate password before signing up
          if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
          }
          await signUp(email, password);
          // Sign up successful - user is now signed in
        } catch (signUpErr: any) {
          // Handle sign up errors
          let errorMessage = 'Failed to create account';
          if (signUpErr.code === 'auth/email-already-in-use') {
            errorMessage =
              'This email is already registered. Please check your password or use "Forgot password?"';
          } else if (signUpErr.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
          } else if (signUpErr.code === 'auth/weak-password') {
            errorMessage =
              'Password is too weak. Please use a stronger password.';
          } else if (signUpErr.message) {
            errorMessage = signUpErr.message;
          }
          setError(errorMessage);
        }
      } else {
        // Handle other sign in errors
        let errorMessage = 'Failed to sign in';
        if (err.code === 'auth/wrong-password') {
          errorMessage =
            'Incorrect password. Please try again or use "Forgot password?"';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address.';
        } else if (err.code === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMessage =
            'Too many failed attempts. Please try again later or reset your password.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-info-message">
        <p>
          <strong>Optional:</strong> Sign in only to save your progress and sync
          across devices.
        </p>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isSigningUp ? 'Creating Account...' : 'Sign In'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-button"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="forgot-password-link"
              >
                Forgot password?
              </button>
            </div>
            {error && <div className="auth-error">{error}</div>}
            {isSigningUp && !error && (
              <div className="auth-info-message" style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '12px', margin: 0 }}>
                  Account not found. Creating new account...
                </p>
              </div>
            )}
            <button type="submit" disabled={loading} className="auth-button">
              {loading
                ? isSigningUp
                  ? 'Creating account...'
                  : 'Signing in...'
                : 'Sign In / Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
