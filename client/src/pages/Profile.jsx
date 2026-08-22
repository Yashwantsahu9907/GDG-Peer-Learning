import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';
import { 
  MapPin, Link as LinkIcon,
  Users, Video, BookOpen, Star, Trophy, Clock,
  CheckCircle2, Flame, Award,
  Calendar, Code, Zap, Edit3, Settings, Shield
} from 'lucide-react';

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

// Subcomponents
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

// MOCK API Client
const fetchProfileData = async (_userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        basicInfo: {
          name: "Sourabh",
          username: "@sourabh08923",
          bio: "Full-stack developer passionate about open source and systems design. Learning Rust and Kubernetes. Always happy to pair program!",
          college: "National Institute of Technology",
          department: "Computer Science",
          year: "3rd Year",
          location: "India",
          website: "yashwant.dev",
          github: "github.com/sourabh",
          twitter: "twitter.com/sourabh",
          linkedin: "linkedin.com/in/sourabh"
        },
        stats: {
          followers: 142,
          following: 89,
          peersHelped: 312,
          learningSessions: 84,
          teachingSessions: 142,
          projects: 12,
          reputation: 4.9,
          reviews: 38,
          hoursLearned: 1248,
          currentStreak: 14,
          longestStreak: 42
        },
        teaching: [
          { skill: "React", proficiency: "Advanced", sessions: 24, endorsements: 18 },
          { skill: "JavaScript", proficiency: "Advanced", sessions: 31, endorsements: 22 },
          { skill: "Node.js", proficiency: "Intermediate", sessions: 16, endorsements: 11 }
        ],
        learning: [
          { skill: "Kubernetes", priority: "High Priority", progress: 70 },
          { skill: "Rust", priority: "High Priority", progress: 35 },
          { skill: "System Design", priority: "Medium Priority", progress: 45 }
        ],
        learningGoals: [
          { title: "Become production-ready with Kubernetes", description: "Deploy a highly available microservices cluster.", progress: 70, target: "September 2026" }
        ],
        recentSessions: [
          { topic: "React Hooks", role: "Mentor", peer: "Rahul", date: "Aug 18", duration: "60 min", rating: 5 },
          { topic: "Node.js APIs", role: "Learner", peer: "Ankit", date: "Aug 16", duration: "45 min", rating: 5 }
        ],
        projects: [
          { name: "GDGPeerPlatform", description: "Open source peer learning platform", tech: ["React", "Node", "MongoDB"], role: "Lead Developer", status: "Building" }
        ],
        achievements: [
          "Top Mentor", "30 Day Learning Streak", "50 Peers Helped", "Open Source Contributor"
        ],
        availability: {
          types: ["Pair Programming", "Mentoring", "Study Sessions"],
          time: "Weekdays 7 PM — 10 PM"
        },
        peerMatches: [
          { name: "Rahul", teaches: [], wants: ["React"], matchScore: 82 },
          { name: "Priya", teaches: ["Kubernetes"], wants: [], matchScore: 91 }
        ]
      });
    }, 1500);
  });
};

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState("");
  const [editWebsiteText, setEditWebsiteText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from /api/users/${userId}
        const profileData = await fetchProfileData(user?._id || 'me');
        
        // Merge actual user data if available
        if (user) {
          profileData.basicInfo.name = user.name || profileData.basicInfo.name;
          if (user.email) {
            profileData.basicInfo.username = `@${user.email.split('@')[0]}`;
          }
          if (user.branch) {
            profileData.basicInfo.department = user.branch;
          }
          if (user.semester) {
            profileData.basicInfo.year = `Semester ${user.semester}`;
          }
          if (user.gdgCoins !== undefined) {
            profileData.stats.gdgCoins = user.gdgCoins;
          }
          if (user.streak !== undefined) {
            profileData.stats.currentStreak = user.streak;
          }
          if (user.longestStreak !== undefined) {
            profileData.stats.longestStreak = user.longestStreak;
          }
          if (user.bio !== undefined && user.bio !== null && user.bio !== '') {
            profileData.basicInfo.bio = user.bio;
          }
          if (user.website !== undefined) {
            profileData.basicInfo.website = user.website;
          }
        }
        
        setData(profileData);
        setEditBioText(profileData.basicInfo.bio);
        setEditWebsiteText(profileData.basicInfo.website);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleSaveBio = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ bio: editBioText, website: editWebsiteText })
      });
      if (res.ok) {
        setIsEditingBio(false);
        setData({
          ...data,
          basicInfo: { ...data.basicInfo, bio: editBioText, website: editWebsiteText }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-[var(--color-bg-primary)] p-8 rounded-2xl border border-[var(--color-border)] flex gap-8 items-start">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--color-text-secondary)]">
        <Shield className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Profile Not Found</h2>
        <p>We couldn't load this profile right now.</p>
      </div>
    );
  }

  const tabs = ['Overview', 'Skills', 'Learning', 'Sessions', 'Projects', 'Achievements', 'Activity'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* 1. Profile Header */}
      <div className="bg-[var(--color-bg-primary)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--color-accent)]/20 to-transparent"></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[var(--color-bg-secondary)] border-4 border-[var(--color-bg-primary)] rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] shadow-md shrink-0 z-10 relative">
            {data.basicInfo.name.charAt(0)}
          </div>
          
          <div className="flex-1 w-full z-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                  {data.basicInfo.name}
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)] font-medium mb-4">
                  {data.basicInfo.username}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isEditingBio ? (
                  <button 
                    onClick={handleSaveBio}
                    className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-semibold hover:bg-[var(--color-accent-dark)] transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditingBio(true)}
                    className="px-5 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl font-semibold hover:border-[var(--color-accent)] transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
                <button className="p-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl hover:border-[var(--color-accent)] transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isEditingBio ? (
              <textarea 
                className="w-full max-w-3xl mb-6 p-4 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                rows={3}
                value={editBioText}
                onChange={(e) => setEditBioText(e.target.value)}
              />
            ) : (
              <p className="text-[var(--color-text-primary)] text-lg leading-relaxed max-w-3xl mb-6 whitespace-pre-wrap">
                {data.basicInfo.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--color-text-secondary)] font-medium">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {data.basicInfo.location}</div>
              <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {data.basicInfo.college}</div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-primary)] font-bold text-xs">{data.basicInfo.department}</div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-primary)] font-bold text-xs">{data.basicInfo.year}</div>
              {isEditingBio ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-primary)] border border-[var(--color-accent)] transition-colors">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <input 
                    type="text" 
                    placeholder="Website URL"
                    className="bg-transparent focus:outline-none text-xs w-32"
                    value={editWebsiteText}
                    onChange={(e) => setEditWebsiteText(e.target.value)}
                  />
                </div>
              ) : data.basicInfo.website ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"><LinkIcon className="w-3.5 h-3.5" /> {data.basicInfo.website}</div>
              ) : null}
              <div className="flex items-center gap-4 ml-auto">
                <GithubIcon className="w-5 h-5 hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" />
                <LinkedinIcon className="w-5 h-5 hover:text-[#0a66c2] cursor-pointer transition-colors" />
                <TwitterIcon className="w-5 h-5 hover:text-[#1da1f2] cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
        
        {/* 2. Social Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-10 pt-6 border-t border-[var(--color-border)] relative z-10">
          <div className="cursor-pointer group">
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{data.stats.gdgCoins || 0}</p>
              <Award className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">GDG Coins</p>
          </div>
          <div className="cursor-pointer group">
            <p className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{data.stats.followers}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{data.stats.peersHelped}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Peers Helped</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{data.stats.teachingSessions}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Sessions Taught</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{data.stats.learningSessions}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Sessions Attended</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{data.stats.projects}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Projects</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-bold text-[var(--color-accent)]">{data.stats.reputation}</p>
              <Star className="w-5 h-5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{data.stats.reviews} Reviews</p>
          </div>
        </div>
      </div>

      {/* 14. Profile Navigation */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          
          {/* 6. Peer Activity Heatmap */}
          <Section title="Learning Activity">
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[650px]">
                <div className="flex text-xs text-[var(--color-text-muted)] mb-2 font-medium">
                  <div className="w-8"></div>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <div key={m} className="flex-1">{m}</div>
                  ))}
                </div>
                <div className="flex gap-1">
                  <div className="flex flex-col justify-between text-xs text-[var(--color-text-muted)] font-medium pr-2">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>
                  <div className="flex-1 flex gap-1">
                    {[...Array(52)].map((_, w) => (
                      <div key={w} className="flex flex-col gap-1 flex-1">
                        {[...Array(7)].map((_, d) => {
                          // Random intensity for realistic look
                          const intensity = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
                          const bg = intensity === 0 ? 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)]' : 
                                     intensity === 1 ? 'bg-emerald-200 dark:bg-emerald-900/40' :
                                     intensity === 2 ? 'bg-emerald-400 dark:bg-emerald-700/60' :
                                     intensity === 3 ? 'bg-emerald-500 dark:bg-emerald-500/80' : 
                                     'bg-emerald-600 dark:bg-emerald-400';
                          return <div key={d} className={`w-full aspect-square rounded-sm ${bg}`}></div>
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 mt-4 text-xs text-[var(--color-text-muted)] font-medium">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"></div>
                  <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40"></div>
                  <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/60"></div>
                  <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500/80"></div>
                  <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400"></div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </Section>

          {/* 3. I Can Teach */}
          <Section 
            title="I Can Teach" 
            action={<button className="text-sm font-semibold text-[var(--color-accent)] hover:underline">Add Skill</button>}
          >
            {data.teaching.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--color-text-secondary)] mb-2">No teaching skills added yet</p>
                <button className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors">Start building your teaching profile</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {data.teaching.map((skill, i) => (
                  <div key={i} className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-emerald-800 dark:text-emerald-400 text-lg">{skill.skill}</h3>
                      <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">{skill.proficiency}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                      <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {skill.sessions} sessions</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {skill.endorsements} endorsements</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* 4. I Want To Learn */}
          <Section 
            title="I Want To Learn"
            action={<button className="text-sm font-semibold text-[var(--color-accent)] hover:underline">Add Skill</button>}
          >
            {data.learning.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--color-text-secondary)] mb-2">No learning goals yet</p>
                <button className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors">Add something you want to learn</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {data.learning.map((skill, i) => (
                  <div key={i} className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-blue-800 dark:text-blue-400 text-lg">{skill.skill}</h3>
                      <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">{skill.priority}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-blue-600 dark:text-blue-400 mb-1.5">
                        <span>Progress</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-900/40 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* 5. Learning Goals */}
          <Section title="Current Learning Goals" action={<button className="text-sm font-semibold text-[var(--color-accent)] hover:underline">Manage Goals</button>}>
            <div className="space-y-4">
              {data.learningGoals.map((goal, i) => (
                <div key={i} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{goal.title}</h3>
                    <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Target: {goal.target}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">{goal.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                        <div className="bg-[var(--color-accent)] h-2 rounded-full relative" style={{ width: `${goal.progress}%` }}>
                           <span className="absolute -right-3 -top-6 text-xs font-bold text-[var(--color-accent)]">{goal.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 9. Recent Sessions */}
          <Section title="Recent Learning Sessions">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-sm text-[var(--color-text-muted)] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Topic</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Peer</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.recentSessions.map((session, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-secondary)] transition-colors">
                      <td className="py-4 font-bold text-[var(--color-text-primary)]">{session.topic}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${session.role === 'Mentor' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {session.role}
                        </span>
                      </td>
                      <td className="py-4 font-medium flex items-center gap-2 text-[var(--color-text-secondary)]">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[10px] font-bold">{session.peer[0]}</div>
                        {session.peer}
                      </td>
                      <td className="py-4 text-[var(--color-text-secondary)]">{session.date} • {session.duration}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end text-yellow-400">
                          {[...Array(session.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-4 text-sm font-semibold text-[var(--color-accent)] hover:underline w-full text-center">View All Sessions</button>
          </Section>

          {/* 10. Projects */}
          <Section title="Projects & Collaborations">
             <div className="grid sm:grid-cols-2 gap-4">
               {data.projects.map((project, i) => (
                 <div key={i} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] transition-colors">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-[var(--color-text-primary)] text-lg flex items-center gap-2"><Code className="w-5 h-5 text-[var(--color-accent)]"/> {project.name}</h3>
                     <span className="px-2 py-1 bg-[var(--color-bg-secondary)] rounded-md text-xs font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)]">{project.status}</span>
                   </div>
                   <p className="text-sm text-[var(--color-text-secondary)] mb-4">{project.description}</p>
                   <div className="flex flex-wrap gap-2 mb-4">
                     {project.tech.map(t => <span key={t} className="px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-md text-xs font-semibold border border-[var(--color-border)]">{t}</span>)}
                   </div>
                   <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                     <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Role: <span className="text-[var(--color-text-primary)]">{project.role}</span></span>
                     <div className="flex gap-2">
                       <GithubIcon className="w-4 h-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer" />
                       <LinkIcon className="w-4 h-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer" />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </Section>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* 13. Peer Matching */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500 fill-yellow-500"/> Great Learning Matches</h2>
            <div className="space-y-4">
              {data.peerMatches.map((match, i) => (
                <div key={i} className="bg-white dark:bg-[var(--color-bg-primary)] p-4 rounded-xl border border-indigo-50 dark:border-[var(--color-border)] shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400">{match.name[0]}</div>
                      <span className="font-bold text-[var(--color-text-primary)]">{match.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">{match.matchScore}% Match</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                    {match.wants.length > 0 ? <><span className="font-semibold text-[var(--color-text-primary)]">{match.name}</span> wants to learn <span className="font-semibold text-[var(--color-text-primary)]">{match.wants.join(', ')}</span></> : <><span className="font-semibold text-[var(--color-text-primary)]">{match.name}</span> can teach <span className="font-semibold text-[var(--color-text-primary)]">{match.teaches.join(', ')}</span></>}
                  </p>
                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors">
                    {match.wants.length > 0 ? 'Connect' : 'Start Learning'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Learning & Teaching Statistics */}
          <Section title="Career Stats">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center"><Clock className="w-6 h-6 text-[var(--color-text-secondary)]" /></div>
                <div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">{data.stats.hoursLearned}</p>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Hours Learned</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center"><Video className="w-6 h-6 text-[var(--color-text-secondary)]" /></div>
                <div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">{data.stats.teachingSessions}</p>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Sessions Hosted</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center"><Users className="w-6 h-6 text-[var(--color-text-secondary)]" /></div>
                <div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">{data.stats.peersHelped}</p>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Peers Helped</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center"><Flame className="w-5 h-5 text-orange-500" /></div>
                <div>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{data.stats.currentStreak} Day</p>
                  <p className="text-xs font-bold text-orange-600/70 dark:text-orange-500/70 uppercase tracking-wider">Current Streak</p>
                </div>
              </div>
            </div>
          </Section>

          {/* 8. Peer Reputation */}
          <Section title="Peer Reputation">
            <div className="text-center mb-6">
              <p className="text-5xl font-extrabold text-[var(--color-text-primary)] mb-2">{data.stats.reputation}</p>
              <div className="flex justify-center gap-1 text-yellow-400 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">Based on {data.stats.reviews} peer reviews</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-text-primary)]">Helpful +24</span>
              <span className="px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-text-primary)]">Clear Communicator +18</span>
              <span className="px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-text-primary)]">Great Mentor +15</span>
              <span className="px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-text-primary)]">Reliable +12</span>
            </div>
          </Section>

          {/* 11. Achievements */}
          <Section title="Achievements">
            <div className="flex flex-col gap-3">
              {data.achievements.map((ach, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border border-purple-200 dark:border-purple-800/50 shrink-0">
                    <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">{ach}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* 12. Availability */}
          <Section title="Available For">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                <Clock className="w-4 h-4 text-[var(--color-accent)]" /> {data.availability.time}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.availability.types.map(type => (
                  <span key={type} className="px-3 py-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-xs font-bold text-[var(--color-text-primary)]">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default Profile;
