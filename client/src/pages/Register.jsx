import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Phone, Book, GraduationCap, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    enrollmentNumber: '',
    branch: 'CSE',
    semester: '1',
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      login(data.user);
      navigate('/dashboard');
    } catch (fetchError) {
      setError('Server error while trying to register.');
      setLoading(false);
    }
  };

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
          Or{' '}
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
                {loading ? 'Creating account...' : 'Create account'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
