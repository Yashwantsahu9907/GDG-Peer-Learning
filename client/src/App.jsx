import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Bounties from './pages/Bounties';
import Leaderboard from './pages/Leaderboard';
import Meeting from './pages/Meeting';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="discover" element={<Discover />} />
            <Route path="bounties" element={<Bounties />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="meeting" element={<Meeting />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
