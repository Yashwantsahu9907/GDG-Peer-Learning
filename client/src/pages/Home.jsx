import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Users, BookOpenCheck, Zap } from 'lucide-react';

const Home = () => {
  useEffect(() => {
    // Example socket connection to test setup
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to socket server from client');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-3xl shadow-sm border border-slate-100 mt-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 to-white/10 z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">GDG Peer Learning</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
            A collaborative platform for students and professionals to learn, share knowledge, and grow together. Join study groups, access curated resources, and engage in real-time discussions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
              Get Started
            </button>
            <button className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all">
              Browse Courses
            </button>
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
