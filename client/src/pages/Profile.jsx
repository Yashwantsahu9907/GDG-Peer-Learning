import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';
import { 
  MapPin, Link as LinkIcon, Users, Video, BookOpen, Star, Trophy, Clock,
  CheckCircle2, Flame, Award, Calendar, Code, Zap, Edit3, Settings, Shield,
  UserPlus, UserMinus, UserCheck, MessageSquare, Plus, ExternalLink, X,
  Search, Check, Heart, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Brand SVGs
const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
const TwitterIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
);

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[var(--color-border)] rounded-xl ${className}`}></div>
);

const Section = ({ title, children, action }) => (
  <div className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm mb-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);

  // Modals state
  const [activeSocialModal, setActiveSocialModal] = useState(null); // 'followers' | 'following' | 'friends' | null
  const [modalList, setModalList] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    bio: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    location: '',
    college: '',
    skills: ''
  });

  const targetId = userId || 'me';

  // Load Profile Data
  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${targetId}`, {
        credentials: 'include'
      });
      const resData = await res.json();
      if (resData.success && resData.profile) {
        setData(resData.profile);
        setIsFollowing(resData.profile.isFollowing);
        setIsFriend(resData.profile.isFriend);
        setFollowersCount(resData.profile.stats.followers);
        setFollowingCount(resData.profile.stats.following);
        setFriendsCount(resData.profile.stats.friends || 0);

        setEditForm({
          bio: resData.profile.basicInfo.bio || '',
          website: resData.profile.basicInfo.website || '',
          github: resData.profile.basicInfo.github || '',
          linkedin: resData.profile.basicInfo.linkedin || '',
          twitter: resData.profile.basicInfo.twitter || '',
          location: resData.profile.basicInfo.location || 'India',
          college: resData.profile.basicInfo.college || '',
          skills: (resData.profile.skills || []).join(', ')
        });
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [targetId, currentUser]);

  // Toggle Follow Handler
  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const actionUserId = data?._id;
    if (!actionUserId) return;

    try {
      const res = await fetch(`${API_URL}/users/${actionUserId}/follow`, {
        method: 'POST',
        credentials: 'include'
      });
      const resData = await res.json();
      if (resData.success) {
        setIsFollowing(resData.isFollowing);
        setFollowersCount(resData.followersCount);
        toast.success(resData.message);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  // Toggle Friend Handler
  const handleFriendToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const actionUserId = data?._id;
    if (!actionUserId) return;

    try {
      const res = await fetch(`${API_URL}/users/${actionUserId}/friend`, {
        method: 'POST',
        credentials: 'include'
      });
      const resData = await res.json();
      if (resData.success) {
        setIsFriend(resData.isFriend);
        setFriendsCount(resData.friendsCount);
        if (resData.isFriend) setIsFollowing(true);
        toast.success(resData.message);
      }
    } catch (err) {
      toast.error('Failed to update friend status');
    }
  };

  // Open Social Modal (Followers / Following / Friends)
  const openSocialModal = async (type) => {
    setActiveSocialModal(type);
    setModalLoading(true);
    setModalList([]);
    const actionUserId = data?._id || 'me';

    try {
      const res = await fetch(`${API_URL}/users/${actionUserId}/${type}`, {
        credentials: 'include'
      });
      const resData = await res.json();
      if (resData.success) {
        setModalList(resData[type] || []);
      }
    } catch (err) {
      toast.error(`Failed to load ${type}`);
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle Follow for item in modal
  const handleModalFollowToggle = async (modalUser) => {
    try {
      const res = await fetch(`${API_URL}/users/${modalUser._id}/follow`, {
        method: 'POST',
        credentials: 'include'
      });
      const resData = await res.json();
      if (resData.success) {
        setModalList(prev => prev.map(u => u._id === modalUser._id ? { ...u, isFollowing: resData.isFollowing } : u));
        toast.success(resData.message);
      }
    } catch (err) {
      toast.error('Failed to update follow');
    }
  };

  // Save Edit Profile Form
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = editForm.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${API_URL}/users/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bio: editForm.bio,
          website: editForm.website,
          github: editForm.github,
          linkedin: editForm.linkedin,
          twitter: editForm.twitter,
          location: editForm.location,
          college: editForm.college,
          skills: skillsArray
        })
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success('Profile updated successfully!');
        setIsEditModalOpen(false);
        loadProfile();
      } else {
        toast.error(resData.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Error saving profile');
    }
  };

  const handleStartCollab = () => {
    const roomId = `collab-${Math.random().toString(36).substring(2, 8)}`;
    navigate(`/meeting/${roomId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-[var(--color-bg-primary)] p-8 rounded-3xl border border-[var(--color-border)] flex gap-8 items-start">
          <Skeleton className="w-32 h-32 rounded-full shrink-0" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--color-text-secondary)]">
        <Shield className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Profile Not Found</h2>
        <p>The requested peer profile could not be loaded.</p>
        <Link to="/discover" className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-xl text-sm">
          Back to Discover
        </Link>
      </div>
    );
  }

  const isSelf = data.isOwnProfile || (currentUser && currentUser._id === data._id);
  const tabs = ['Overview', 'Skills', 'Learning', 'Sessions', 'Projects', 'Achievements'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* 1. Profile Hero Card */}
      <div className="bg-[var(--color-bg-primary)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent"></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[var(--color-bg-secondary)] border-4 border-[var(--color-bg-primary)] rounded-full flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] shadow-md shrink-0 z-10 relative">
            {data.basicInfo.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 w-full z-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                    {data.basicInfo.name}
                  </h1>
                  {data.stats.streak >= 3 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold" title={`${data.stats.streak} day streak!`}>
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      {data.stats.streak}d
                    </span>
                  )}
                </div>
                <p className="text-lg text-[var(--color-text-secondary)] font-medium mb-3">
                  {data.basicInfo.username}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {isSelf ? (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm shadow transition-all hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                ) : (
                  <>
                    {/* Follow / Unfollow */}
                    <button 
                      onClick={handleFollowToggle}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow transition-all hover:-translate-y-0.5 flex items-center gap-2 ${
                        isFollowing 
                          ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4 text-emerald-600" /> Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" /> Follow
                        </>
                      )}
                    </button>

                    {/* Add Friend / Friends */}
                    <button
                      onClick={handleFriendToggle}
                      className={`px-4 py-2.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-2 ${
                        isFriend 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                          : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800'
                      }`}
                    >
                      {isFriend ? (
                        <>
                          <Check className="w-4 h-4 text-blue-600" /> Friends
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Add Friend
                        </>
                      )}
                    </button>

                    {/* Chat & Collab */}
                    <Link
                      to="/chat"
                      className="p-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded-xl transition-colors"
                      title="Send Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={handleStartCollab}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow"
                      title="Start Collab Room"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Collab</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-[var(--color-text-primary)] text-base sm:text-lg leading-relaxed max-w-3xl mb-6 whitespace-pre-wrap">
              {data.basicInfo.bio}
            </p>

            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--color-text-secondary)] font-medium">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {data.basicInfo.location}</div>
              <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gray-400" /> {data.basicInfo.college}</div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-[var(--color-text-primary)] font-bold text-xs">{data.basicInfo.department}</div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-[var(--color-text-primary)] font-bold text-xs">{data.basicInfo.year}</div>
              
              {data.basicInfo.website && (
                <a href={data.basicInfo.website.startsWith('http') ? data.basicInfo.website : `https://${data.basicInfo.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-primary)] hover:text-emerald-600 transition-colors">
                  <LinkIcon className="w-3.5 h-3.5" /> {data.basicInfo.website}
                </a>
              )}

              <div className="flex items-center gap-4 ml-auto">
                {data.basicInfo.github && (
                  <a href={data.basicInfo.github.startsWith('http') ? data.basicInfo.github : `https://${data.basicInfo.github}`} target="_blank" rel="noreferrer">
                    <GithubIcon className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                  </a>
                )}
                {data.basicInfo.linkedin && (
                  <a href={data.basicInfo.linkedin.startsWith('http') ? data.basicInfo.linkedin : `https://${data.basicInfo.linkedin}`} target="_blank" rel="noreferrer">
                    <LinkedinIcon className="w-5 h-5 text-[#0a66c2] hover:opacity-80 transition-opacity" />
                  </a>
                )}
                {data.basicInfo.twitter && (
                  <a href={data.basicInfo.twitter.startsWith('http') ? data.basicInfo.twitter : `https://${data.basicInfo.twitter}`} target="_blank" rel="noreferrer">
                    <TwitterIcon className="w-5 h-5 text-[#1da1f2] hover:opacity-80 transition-opacity" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 2. Interactive Social Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-10 pt-6 border-t border-[var(--color-border)] relative z-10">
          
          {/* Followers (Clickable Modal) */}
          <div 
            onClick={() => openSocialModal('followers')} 
            className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 cursor-pointer transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-zinc-950 group-hover:text-emerald-600 transition-colors">
                {followersCount}
              </p>
              <Users className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Followers</p>
          </div>

          {/* Following (Clickable Modal) */}
          <div 
            onClick={() => openSocialModal('following')} 
            className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 cursor-pointer transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-zinc-950 group-hover:text-blue-600 transition-colors">
                {followingCount}
              </p>
              <UserCheck className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Following</p>
          </div>

          {/* Friends (Clickable Modal) */}
          <div 
            onClick={() => openSocialModal('friends')} 
            className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 cursor-pointer transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-zinc-950 group-hover:text-purple-600 transition-colors">
                {friendsCount}
              </p>
              <Heart className="w-4 h-4 text-zinc-400 group-hover:text-purple-600" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Friends</p>
          </div>

          {/* GDG Coins */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-yellow-600">{data.stats.gdgCoins || 100}</p>
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Coins</p>
          </div>

          {/* Streak */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-orange-600">{data.stats.streak || 1}d</p>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Streak</p>
          </div>

          {/* Sessions */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <p className="text-2xl font-black text-zinc-950">{data.stats.learningSessions + data.stats.teachingSessions}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Sessions</p>
          </div>

          {/* Reputation */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-black text-emerald-600">{data.stats.reputation}</p>
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-1">{data.stats.reviews} Reviews</p>
          </div>

        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-[var(--color-border)]">
        <div className="flex space-x-8 min-w-max px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 text-sm font-bold transition-all relative ${
                activeTab === tab 
                  ? 'text-[var(--color-accent)]' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Skills & Technologies */}
          <Section 
            title="Skills & Technologies"
            action={isSelf && <button onClick={() => setIsEditModalOpen(true)} className="text-sm font-semibold text-emerald-600 hover:underline">Edit Skills</button>}
          >
            <div className="flex flex-wrap gap-2">
              {(data.skills || []).map((skill, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm border border-zinc-200 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </Section>

          {/* I Can Teach */}
          <Section title="I Can Teach">
            <div className="grid sm:grid-cols-2 gap-4">
              {(data.teaching || []).map((skill, i) => (
                <div key={i} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-emerald-900 text-lg">{skill.skill}</h3>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">{skill.proficiency}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-emerald-700 font-medium">
                    <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {skill.sessions} sessions</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {skill.endorsements} endorsements</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* I Want To Learn */}
          <Section title="I Want To Learn">
            <div className="grid sm:grid-cols-2 gap-4">
              {(data.learning || []).map((skill, i) => (
                <div key={i} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-blue-900 text-lg">{skill.skill}</h3>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold uppercase">{skill.priority}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-blue-700 mb-1.5">
                      <span>Progress</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Quick Connect Card */}
          {!isSelf && (
            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold">Collaborate with {data.basicInfo.name.split(' ')[0]}</h2>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Connect on projects, schedule 1-on-1 mentorship, or launch an instant shared code room.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={handleStartCollab}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" /> Start Collab Session
                </button>
                <Link 
                  to="/chat"
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-colors text-center block"
                >
                  Send Direct Message
                </Link>
              </div>
            </div>
          )}

          {/* Activity Statistics */}
          <Section title="Learning Highlights">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900">{data.stats.hoursLearned} Hours</p>
                  <p className="text-xs text-zinc-500 uppercase font-semibold">Total Learning Time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900">{data.stats.peersHelped}</p>
                  <p className="text-xs text-zinc-500 uppercase font-semibold">Peers Helped</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Availability */}
          <Section title="Availability">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                <Clock className="w-4 h-4 text-emerald-600" /> {data.availability.time}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.availability.types.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-zinc-100 rounded-lg text-xs font-bold text-zinc-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Section>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Social List Modal (Followers / Following / Friends)           */}
      {/* ------------------------------------------------------------- */}
      {activeSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 capitalize">{activeSocialModal}</h3>
                  <p className="text-xs text-zinc-500">{modalList.length} total peers</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveSocialModal(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal List */}
            <div className="flex-grow overflow-y-auto space-y-3 py-2">
              {modalLoading ? (
                <div className="space-y-3 p-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : modalList.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-zinc-300" />
                  <p className="font-semibold text-sm">No {activeSocialModal} yet</p>
                </div>
              ) : (
                modalList.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-all">
                    
                    {/* User Info Link */}
                    <div 
                      onClick={() => {
                        setActiveSocialModal(null);
                        navigate(`/profile/${item._id}`);
                      }}
                      className="flex items-center gap-3 cursor-pointer group flex-grow mr-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-950 group-hover:text-emerald-600 transition-colors truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {item.username} • {item.branch || 'CSE'}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {currentUser && currentUser._id !== item._id && (
                      <button
                        onClick={() => handleModalFollowToggle(item)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          item.isFollowing
                            ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                      >
                        {item.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 shrink-0">
              <button
                onClick={() => setActiveSocialModal(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Edit Profile Modal                                            */}
      {/* ------------------------------------------------------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-950">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell peers what you love to build and learn..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="React, Node.js, Python, TypeScript"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">College / Institute</label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    placeholder="e.g. NIT / IIT / State Univ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">Website URL</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">GitHub</label>
                  <input
                    type="text"
                    value={editForm.github}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    placeholder="github.com/username"
                    className="w-full px-2.5 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={editForm.linkedin}
                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-2.5 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">Twitter (X)</label>
                  <input
                    type="text"
                    value={editForm.twitter}
                    onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                    placeholder="twitter.com/username"
                    className="w-full px-2.5 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
