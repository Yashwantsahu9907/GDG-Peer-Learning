import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Discover from './pages/Discover';
import Bounties from './pages/Bounties';
import Leaderboard from './pages/Leaderboard';
import Meeting from './pages/Meeting';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Points from './pages/Points';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Session from './pages/Session';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="discover" element={<Discover />} />
              <Route path="bounties" element={<Bounties />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="session/:id" element={<Session />} />
                <Route path="meeting" element={<Meeting />} />
                <Route path="profile" element={<Profile />} />
                <Route path="points" element={<Points />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
