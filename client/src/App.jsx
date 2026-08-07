import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat';
import Users from './pages/Users';
import Meeting from './pages/Meeting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="conversations/:id" element={<Chat />} />
          <Route path="users" element={<Users />} />
          <Route path="meeting" element={<Meeting />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
