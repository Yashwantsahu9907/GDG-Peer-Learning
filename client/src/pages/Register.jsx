import React, { useState } from'react';
import { Link, useNavigate } from'react-router-dom';
import { useAuth } from'../contexts/AuthContext';
import { Mail, Lock, User, Phone, Book, GraduationCap, ArrowRight } from'lucide-react';
import { useGoogleLogin } from'@react-oauth/google';

const Register = () => {
 const navigate = useNavigate();
 const { login } = useAuth();
 const [formData, setFormData] = useState({
 name:'',
 email:'',
 password:'',
 phone:'',
 gender:'Male',
 enrollmentNumber:'',
 branch:'CSE',
 semester:'1',
 });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (event) => {
 event.preventDefault();
 setError('');

 // Client-side validation
 if (formData.password.length < 8) {
 return setError('Password must be at least 8 characters long');
 }

 setLoading(true);
 try {
 const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify(formData),
 credentials:'include'
 });
 const data = await response.json();

 if (!response.ok || !data.success) {
 setError(data.message ||'Registration failed');
 setLoading(false);
 return;
 }

 login(data.user);
 navigate('/profile');
 } catch (fetchError) {
 console.error(fetchError);
 setError('Server error while trying to register.');
 setLoading(false);
 }
 };

 const handleGoogleLogin = useGoogleLogin({
 onSuccess: async (tokenResponse) => {
 try {
 setLoading(true);
 setError('');
 
 const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
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
 setError(data.message ||'Google registration failed');
 setLoading(false);
 }
 } catch (err) {
 console.error(err);
 setError('Failed to register with Google.');
 setLoading(false);
 }
 },
 onError: () => {
 setError('Google registration was cancelled or failed.');
 setLoading(false);
 }
 });

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 return (
 <div className="w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
 <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
 <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
 Create a new account
 </h2>
 <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
 Or{''}
 <Link to="/login" className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
 sign in to your existing account
 </Link>
 </p>
 </div>

 <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
 <div className="gfg-panel py-8 px-4 sm:rounded-2xl sm:px-10 border border-[var(--color-border)] shadow-sm">
 <form className="space-y-6" onSubmit={handleSubmit}>
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
 
 {/* Name */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <User className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="name" type="text" required value={formData.name} onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="Enter Your Full Name"
 />
 </div>
 </div>

 {/* Email */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email Address</label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Mail className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="email" type="email" required value={formData.email} onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="Enter Your Email"
 />
 </div>
 </div>

 {/* Password */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Lock className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="password" type="password" required minLength="8" value={formData.password} onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="Enter Your Password"
 />
 </div>
 </div>

 {/* Phone */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Phone Number</label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Phone className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="phone" type="tel" required value={formData.phone} onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="Phone Number"
 />
 </div>
 </div>

 {/* Gender */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Gender</label>
 <select
 name="gender" required value={formData.gender} onChange={handleChange}
 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm rounded-md transition-colors"
 >
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 <option value="Other">Other</option>
 </select>
 </div>

 {/* Enrollment Number */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Enrollment Number <span className="text-[var(--color-text-muted)]">(Optional)</span></label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Book className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <input
 name="enrollmentNumber" type="text" value={formData.enrollmentNumber} onChange={handleChange}
 className="focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] block w-full pl-10 sm:text-sm border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md py-2 px-3 focus:outline-none focus:ring-1 transition-colors"
 placeholder="e.g. 0827CS2..."
 />
 </div>
 </div>

 {/* Branch */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Branch</label>
 <select
 name="branch" required value={formData.branch} onChange={handleChange}
 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm rounded-md transition-colors"
 >
 <option value="CSE">Computer Science</option>
 <option value="IT">Information Technology</option>
 <option value="ECE">Electronics and Telecommunication</option>
 <option value="ME">Mechanical</option>
 <option value="CE">Civil</option>
 <option value="EEE">Electrical</option>
 <option value="VLSI">VLSI</option>
 <option value="MINING">Mining</option>
 <option value="CHEMICAL">Chemical</option>
 <option value="METALLURGY">Metallurgy</option>
 <option value="BIOTECH">Biotechnology</option>
 <option value="AIML">Artificial Intelligence and Machine Learning</option>
 <option value="AIDS">Artificial Intelligence and Data Science </option>
 <option value="OTHER">Other</option>
 </select>
 </div>

 {/* Semester */}
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Semester</label>
 <div className="mt-1 relative rounded-md shadow-sm">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <GraduationCap className="h-5 w-5 text-[var(--color-text-muted)]" />
 </div>
 <select
 name="semester" required value={formData.semester} onChange={handleChange}
 className="block w-full pl-10 pr-10 py-2 text-base border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm rounded-md transition-colors"
 >
 {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
 <option key={sem} value={sem.toString()}>Semester {sem}</option>
 ))}
 </select>
 </div>
 </div>

 </div>

 {error && <div className="text-red-500 text-sm text-center">{error}</div>}

 <div>
 <button
 type="submit"
 disabled={loading}
 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] focus:ring-offset-[var(--color-bg-primary)] disabled:opacity-50 group transition-colors"
 >
 {loading ?'Creating account...' :'Create account'}
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

export default Register;
