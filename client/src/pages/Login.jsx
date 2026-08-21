import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { API_URL } from '../config';

const Login = () => {
 const navigate = useNavigate();
 const location = useLocation();
 const { login } = useAuth();
 const [formData, setFormData] = useState({ email:'', password:'' });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 if (location.state?.message) {
 toast.error(location.state.message);
 // Clear the state so it doesn't show again on refresh
 window.history.replaceState({}, document.title);
 }
 }, [location]);

 const handleSubmit = async (event) => {
 event.preventDefault();
 setError('');
 setLoading(true);

 try {
 const response = await fetch(`${API_URL}/auth/login`, {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify(formData),
 credentials:'include'
 });
 const data = await response.json();

 if (!response.ok || !data.success) {
 setError(data.message ||'Invalid credentials');
 setLoading(false);
 return;
 }

 login(data.user);
 navigate('/profile');
 } catch (fetchError) {
 console.error(fetchError);
 setError('Server error while trying to log in.');
 setLoading(false);
 }
 };

 const handleGoogleLogin = useGoogleLogin({
 onSuccess: async (tokenResponse) => {
 try {
 setLoading(true);
 setError('');
 
 const response = await fetch(`${API_URL}/auth/google`, {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({
 accessToken: tokenResponse.access_token
 }),
 credentials:'include'
 });
 const data = await response.json();
 
 if (response.ok && data.success) {
 login(data.user);
 navigate('/profile');
 } else {
 setError(data.message ||'Google login failed');
 setLoading(false);
 }
 } catch (err) {
 console.error(err);
 setError('Failed to login with Google.');
 setLoading(false);
 }
 },
 onError: () => {
 setError('Google login was cancelled or failed.');
 setLoading(false);
 }
 });

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 return (
 <div className="w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
 <div className="sm:mx-auto sm:w-full sm:max-w-md">
 <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
 Sign in to your account
 </h2>
 <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
 Or{''}
 <Link to="/register" className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
 create a new account
 </Link>
 </p>
 </div>

 <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
 <div className="gfg-panel py-8 px-4 sm:rounded-2xl sm:px-10 border border-[var(--color-border)] shadow-sm">
 <form className="space-y-6" onSubmit={handleSubmit}>
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
 Email address
 </label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Mail className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="email"
 type="email"
 required
 value={formData.email}
 onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="you@example.com"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
 Password
 </label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Lock className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="password"
 type="password"
 required
 value={formData.password}
 onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="••••••••"
 />
 </div>
 </div>

 {error && <div className="text-red-500 text-sm">{error}</div>}

 <div>
 <button
 type="submit"
 disabled={loading}
 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] focus:ring-offset-[var(--color-bg-primary)] disabled:opacity-50 group transition-colors"
 >
 {loading ?'Signing in...' :'Sign in'}
 {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
 </button>
 </div>
 </form>

 <div className="mt-6">
 <div className="relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-[var(--color-border)]" />
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="px-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
 Or continue with
 </span>
 </div>
 </div>

 <div className="mt-6">
 <button
 type="button"
 onClick={handleGoogleLogin}
 disabled={loading}
 className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-[var(--color-border)] rounded-full shadow-sm bg-[var(--color-bg-primary)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
 >
 <svg className="h-5 w-5" viewBox="0 0 24 24">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
 <path d="M1 1h22v22H1z" fill="none"/>
 </svg>
 Google
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default Login;
