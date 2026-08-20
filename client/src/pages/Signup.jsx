import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setStoredUser } from '../utils/userClient';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name || 'Guest' })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Unable to create account.');
        setLoading(false);
        return;
      }

      setStoredUser({ userId: data.userId, name: data.name });
      navigate('/');
    } catch (fetchError) {
      console.error('Signup error:', fetchError);
      setError('Server error while creating account.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Sign Up</h1>
      <p className="text-slate-600 mb-8">Create a new account and receive a unique user ID for future login.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your name"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
          Log in here
        </Link>
        .
      </p>
    </div>
  );
};

export default Signup;
