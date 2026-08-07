import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Users, BookOpenCheck, Zap } from 'lucide-react';
import { getStoredUser, setStoredUser } from '../utils/userClient';

const Home = () => {
  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = getStoredUser();
      if (storedUser?.userId) {
        return storedUser;
      }

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Guest' })
      });

      const data = await response.json();
      const newUser = { userId: data.userId, name: data.name };
      setStoredUser(newUser);
      return newUser;
    };

    const setupSocket = async () => {
      const user = await initializeUser();
      const socket = io('http://localhost:5000', {
        auth: {
          userId: user.userId
        }
      });

      socket.on('connect', () => {
        console.log('Connected to socket server from client', user.userId);
      });

      return socket;
    };

    let socket;
    setupSocket().then((s) => {
      socket = s;
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="leetcode-hero leetcode-card mt-6">
        <div className="hero-left">
          <h1 className="text-4xl font-extrabold">Sharpen your skills with GDG Peer Learning</h1>
          <p className="mt-4">Practice problems, join study groups, and collaborate in real-time — all in one community-driven platform.</p>

          <div className="cta-row">
            <button className="leetcode-btn">Start Solving</button>
            <button className="px-4 py-2 border rounded-md">Explore Tracks</button>
          </div>

          <div className="leetcode-stats">
            <div className="stat">1.2k Questions</div>
            <div className="stat">8.9k Learners</div>
            <div className="stat">320 Groups</div>
          </div>
        </div>

        <div className="hero-right">
          <div className="leetcode-codebox">
            <div className="text-sm text-slate-400">Example</div>
            <pre className="mt-2">{
`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}`
            }</pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Peer Groups</h3>
          <p className="text-slate-600 leading-relaxed">
            Join study groups tailored to your interests and skill levels. Collaborate with peers and learn faster together.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Curated Resources</h3>
          <p className="text-slate-600 leading-relaxed">
            Access high-quality, community-curated learning materials, tutorials, and project ideas.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Collab</h3>
          <p className="text-slate-600 leading-relaxed">
            Engage in live discussions and code pairing sessions with built-in WebSocket support.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
