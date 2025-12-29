import './Auth.css';

import React, { useState } from 'react';

import { useUser } from '../../contexts/UserContext';

interface ForgotPasswordProps {
  onBack: () => void;
  onForgotPassword?: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBack,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Check Your Email</h2>
          <div className="auth-success">
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
          </div>
          <button onClick={onBack} className="auth-button">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
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
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '16px',
            textDecoration: 'underline',
          }}
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
};
