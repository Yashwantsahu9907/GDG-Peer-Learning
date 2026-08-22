import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, Clock, Video, Grid, List, X, UserPlus, UserCheck, Heart, User, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DEFAULT_MENTORS = [
  { _id: 'm1', name: 'Alice Chen', role: 'Senior CS Student', branch: 'CSE', skills: ['React', 'Node.js', 'System Design'], rating: 4.9, match: 95, availability: ['Today 2-4PM', 'Tomorrow 10AM-12PM'], isFollowing: false, isFriend: false },
  { _id: 'm2', name: 'David Kumar', role: 'GDG Lead', branch: 'AI/ML', skills: ['Python', 'Machine Learning', 'Data Structures'], rating: 4.8, match: 88, availability: ['Wed 3-5PM'], isFollowing: false, isFriend: false },
  { _id: 'm3', name: 'Sarah Jones', role: 'Frontend Specialist', branch: 'IT', skills: ['Vue', 'Tailwind CSS', 'Figma'], rating: 4.7, match: 82, availability: ['Thu 1-3PM', 'Fri 10AM-12PM'], isFollowing: false, isFriend: false },
  { _id: 'm4', name: 'Michael Lee', role: 'Backend Dev', branch: 'CSE', skills: ['Go', 'Docker', 'Kubernetes'], rating: 4.9, match: 91, availability: ['Mon 9-11AM'], isFollowing: false, isFriend: false },
];

const Discover = () => {
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModalMentor, setSelectedModalMentor] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch registered peers from backend
  useEffect(() => {
    const fetchPeers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(searchTerm)}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.users && data.users.length > 0) {
          setPeers(data.users);
        } else {
          // Fallback to default mentors if no query results
          setPeers(DEFAULT_MENTORS);
        }
      } catch (err) {
        setPeers(DEFAULT_MENTORS);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPeers, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFollowToggle = async (e, targetUser) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/${targetUser._id}/follow`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setPeers(prev => prev.map(p => p._id === targetUser._id ? { ...p, isFollowing: data.isFollowing } : p));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error('Failed to follow');
    }
  };

  const handleFriendToggle = async (e, targetUser) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/${targetUser._id}/friend`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setPeers(prev => prev.map(p => p._id === targetUser._id ? { ...p, isFriend: data.isFriend, isFollowing: data.isFriend ? true : p.isFollowing } : p));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error('Failed to update friend');
    }
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    const sessionId = `collab-${Math.random().toString(36).substring(2, 8)}`;
    navigate(`/meeting/${sessionId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4 relative font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Community Directory
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Discover Peers & Mentors</h1>
          <p className="text-[var(--color-text-secondary)]">Search community developers, follow their progress, add friends, and collaborate.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-1 flex">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] shadow-xs' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
              <Grid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] shadow-xs' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="gfg-panel p-4 flex flex-col md:flex-row gap-4 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search peers by name, skills (React, Python, Go), or branch..." 
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Grid / List View */}
      <div className={`grid gap-6 ${view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {peers.map(peer => (
          <div 
            key={peer._id} 
            className="p-5 rounded-3xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <Link to={`/profile/${peer._id}`} className="flex items-center gap-3.5 group/peer">
                  <div className="h-13 w-13 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0 group-hover/peer:scale-105 transition-transform">
                    {peer.name ? peer.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg group-hover/peer:text-emerald-600 transition-colors">
                      {peer.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                      {peer.role || 'Peer Learner'} • {peer.branch || 'CSE'}
                    </p>
                  </div>
                </Link>

                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {peer.match || 90}% Match
                </span>
              </div>

              {/* Bio snippet */}
              {peer.bio && (
                <p className="text-xs text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed">
                  {peer.bio}
                </p>
              )}

              {/* Skills Taught */}
              <div className="mb-5">
                <div className="text-[11px] text-[var(--color-text-muted)] mb-2 uppercase tracking-wider font-bold">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {(peer.skills || ['JavaScript', 'React']).map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-xs border border-[var(--color-border)] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {/* Follow */}
                <button
                  onClick={(e) => handleFollowToggle(e, peer)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    peer.isFollowing 
                      ? 'bg-zinc-100 text-zinc-800 border border-zinc-300' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {peer.isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{peer.isFollowing ? 'Following' : 'Follow'}</span>
                </button>

                {/* Add Friend */}
                <button
                  onClick={(e) => handleFriendToggle(e, peer)}
                  className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                    peer.isFriend 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
                  }`}
                  title={peer.isFriend ? 'Friends' : 'Add Friend'}
                >
                  <Heart className={`w-4 h-4 ${peer.isFriend ? 'fill-blue-600 text-blue-600' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${peer._id}`}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
                >
                  Profile
                </Link>
                <button 
                  onClick={() => setSelectedModalMentor(peer)} 
                  className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Collab</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduling / Collab Modal */}
      {selectedModalMentor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Start Collaboration</h2>
              <button onClick={() => setSelectedModalMentor(null)} className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSchedule} className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg">
                  {selectedModalMentor.name ? selectedModalMentor.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedModalMentor.name}</h3>
                  <p className="text-xs text-gray-500">{selectedModalMentor.role || 'Peer'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Topic / Skills</label>
                <input 
                  type="text" 
                  defaultValue={(selectedModalMentor.skills && selectedModalMentor.skills[0]) || 'System Architecture & Pair Programming'} 
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-black" 
                  required 
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedModalMentor(null)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow">
                  <Video className="h-4 w-4" /> Launch Collab Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
