import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, setStoredUser } from '../utils/userClient';

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(userId)}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Unable to find user. Please check your ID.');
        setLoading(false);
        return;
      }

      const user = data.user;
      setStoredUser({ userId: user.userId, name: user.name });
      navigate('/');
    } catch (fetchError) {
      setError('Server error while trying to log in.');
      setLoading(false);
    }
  };

  const storedUser = getStoredUser();
  if (storedUser?.userId) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Login</h1>
      <p className="text-slate-600 mb-8">Enter your user ID to log in or create a new account on the signup page.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-2">
            User ID
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your unique user ID"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
          Sign up here
        </Link>
        .
      </p>
    </div>
  );
};

export default Login;
