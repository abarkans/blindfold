import { useState } from 'react';

export default function StepCredentials({ email, setEmail, password, setPassword, onSubmit, loading, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError('Email is required');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError('Password is required');
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate before submit
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-white mb-2">Create your account</h2>
        <p className="text-[#b0b0b0] font-body">Start your adventure today</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-900/30 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            className={`
              w-full px-5 py-4 bg-[#1a1a1a] border rounded-full text-white placeholder-[#6e6e6e]
              focus:outline-none transition-colors
              ${emailError ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#fd297b]'}
            `}
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-400">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              placeholder="Min. 8 characters"
              className={`
                w-full px-5 py-4 bg-[#1a1a1a] border rounded-full text-white placeholder-[#6e6e6e]
                focus:outline-none transition-colors pr-12
                ${passwordError ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#fd297b]'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6e6e] hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {passwordError && (
            <p className="mt-2 text-sm text-red-400">{passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  );
}
