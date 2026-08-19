import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Code, Zap, Globe, ArrowRight, BookOpen, UserPlus, Target, Award, Plus, ChevronDown, ChevronUp, CheckCircle2, Star, Shield, Trophy } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';

const HeroSection = ({ activePeers, handleFindMentorClick }) => (
  <section id="hero" className="w-full max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-accent-muted)] text-[var(--color-accent)] text-xs font-bold tracking-wide uppercase mb-8 opacity-0 animate-[fadeUp_0.5s_ease-out_forwards]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
      </span>
      {activePeers.toLocaleString()} Peers Active Now
    </div>
    
    <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight mb-6 opacity-0 animate-[fadeUp_0.5s_ease-out_0.1s_forwards]">
      Master Tech Skills with <br className="hidden md:block" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#4ade80]">
        Peer Mentorship
      </span>
    </h1>
    
    <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed opacity-0 animate-[fadeUp_0.5s_ease-out_0.2s_forwards]">
      Connect, collaborate, and learn from fellow developers. Earn reputation, complete bounties, and build your engineering career in an open, community-driven ecosystem.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeUp_0.5s_ease-out_0.3s_forwards]">
      <button onClick={handleFindMentorClick} className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
        Find a Mentor <ArrowRight className="h-4 w-4" />
      </button>
      <Link to="/bounties" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-primary)] font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow">
        Solve Bounties
      </Link>
    </div>
  </section>
);

const WorkspaceOverview = () => (
  <section id="workspace" className="w-full max-w-6xl mx-auto px-4 py-20 border-t border-[var(--color-border)]">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">Your Developer Workspace</h2>
      <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">Everything you need to learn, contribute, collaborate, and grow with other developers.</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: BookOpen, title: 'Learn', desc: 'Find peers who can teach you the technologies you want to master.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30' },
        { icon: Users, title: 'Teach', desc: 'Share your expertise and help other developers grow.', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/30' },
        { icon: Code, title: 'Build', desc: 'Collaborate with developers on real projects and challenges.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-900/30' },
        { icon: Trophy, title: 'Earn', desc: 'Build reputation through mentorship, contributions, and completed bounties.', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-900/30' }
      ].map((feature, i) => (
        <div key={i} className="p-6 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-lg transition-all group">
          <div className={`h-12 w-12 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <feature.icon className={`h-6 w-6 ${feature.color}`} />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{feature.title}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="w-full max-w-4xl mx-auto px-4 py-20">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">How Peer Learning Works</h2>
      <p className="text-lg text-[var(--color-text-secondary)]">A seamless workflow from finding help to mastering the skill.</p>
    </div>

    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-[var(--color-border)]">
      {[
        { step: '01', title: 'Discover', desc: 'Find developers based on their skills and interests.', align: 'left' },
        { step: '02', title: 'Connect', desc: 'Send a request and start a conversation.', align: 'right' },
        { step: '03', title: 'Collaborate', desc: 'Learn together through mentorship, projects, and challenges.', align: 'left' },
        { step: '04', title: 'Grow', desc: 'Build reputation, improve your skills, and become a mentor yourself.', align: 'right' }
      ].map((item, i) => (
        <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
            {item.step}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-md transition-all">
            <h4 className="font-bold text-lg text-[var(--color-text-primary)] mb-2">{item.title}</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SkillExchange = () => (
  <section id="skill-exchange" className="w-full max-w-6xl mx-auto px-4 py-20 border-t border-[var(--color-border)]">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-6">The Skill Exchange</h2>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          GDGPeer matches developers based on complementary skills. You teach what you know, and learn what you don't.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400"/></div>
            <div>
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase">Skills you know</p>
              <p className="font-bold text-[var(--color-text-primary)]">React, UI/UX, Node.js</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Target className="h-5 w-5 text-blue-600 dark:text-blue-400"/></div>
            <div>
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase">Skills you want to learn</p>
              <p className="font-bold text-[var(--color-text-primary)]">Java, Machine Learning, DevOps</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-[400px] rounded-3xl bg-gradient-to-br from-[var(--color-accent-light)] to-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden flex items-center justify-center">
        {/* Abstract visual representation */}
        <div className="absolute w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -top-10 -left-10"></div>
        <div className="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -bottom-10 -right-10"></div>
        <div className="relative flex items-center gap-4 sm:gap-8">
           <div className="flex flex-col gap-3">
              <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-sm border border-emerald-200 dark:border-emerald-900 text-emerald-600">React</span>
              <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-sm border border-emerald-200 dark:border-emerald-900 text-emerald-600">Node.js</span>
           </div>
           <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-text-muted)]" />
           <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-lg shrink-0">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
           </div>
           <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-text-muted)]" />
           <div className="flex flex-col gap-3">
              <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-sm border border-blue-200 dark:border-blue-900 text-blue-600">Java</span>
              <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-sm border border-blue-200 dark:border-blue-900 text-blue-600">DevOps</span>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const HallOfFame = () => (
  <section id="hall-of-fame" className="w-full max-w-6xl mx-auto px-4 py-20 bg-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border)] my-10">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">Hall of Fame</h2>
      <p className="text-lg text-[var(--color-text-secondary)]">Recognizing our top community contributors and mentors.</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { name: "Alex Rivera", role: "Top Mentor", score: "4.9", reviews: 142, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
        { name: "Priya Sharma", role: "Bounty Champion", score: "1,250", reviews: "Coins", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
        { name: "David Kim", role: "Top Contributor", score: "84", reviews: "Projects", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50" }
      ].map((user, i) => (
        <div key={i} className="bg-[var(--color-bg-primary)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] border-4 border-[var(--color-bg-primary)] flex items-center justify-center text-2xl font-bold text-[var(--color-text-primary)] shadow-sm mb-4 relative">
            {user.name[0]}
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${user.bg} dark:bg-gray-800 flex items-center justify-center shadow-sm border border-[var(--color-border)]`}>
              <user.icon className={`w-4 h-4 ${user.color}`} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-[var(--color-text-primary)]">{user.name}</h3>
          <p className="text-sm font-semibold text-[var(--color-accent)] mb-4">{user.role}</p>
          <div className="w-full pt-4 border-t border-[var(--color-border)] flex justify-between items-center px-2">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase">{typeof user.reviews === 'number' ? 'Reviews' : user.reviews}</span>
            <span className="font-bold text-[var(--color-text-primary)]">{user.score}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const BountySection = () => (
  <section id="bounties-section" className="w-full max-w-6xl mx-auto px-4 py-20">
    <div className="bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border)] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-5 blur-3xl rounded-full"></div>
      
      <div className="lg:w-1/2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase mb-6 border border-orange-200 dark:border-orange-800">
          <Zap className="w-3.5 h-3.5" /> Community Driven
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6 leading-tight">Learn by <br/><span className="text-[var(--color-accent)]">Building</span></h2>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Solve real technical challenges posted by peers, demonstrate your skills, and earn GDG Coins and reputation.
        </p>
        <Link to="/bounties" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-primary)] font-bold transition-all shadow-sm hover:shadow">
          Explore Bounties <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4 relative z-10">
        {['Frontend', 'Backend', 'AI / ML', 'DevOps', 'Open Source', 'UI/UX'].map((tag) => (
          <div key={tag} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            <span className="font-bold text-sm text-[var(--color-text-primary)]">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CommunityStats = () => (
  <section id="stats" className="w-full border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[var(--color-border)]">
        {[
          { label: 'Active Peers', value: '1,248' },
          { label: 'Skills Shared', value: '8,420' },
          { label: 'Mentorship Sessions', value: '14.2k' },
          { label: 'Bounties Completed', value: '3,840' }
        ].map((stat, i) => (
          <div key={i} className="text-center px-4">
            <p className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">{stat.value}</p>
            <p className="text-xs md:text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: "What is GDGPeer?", a: "GDGPeer is a peer-to-peer developer learning ecosystem where developers can teach, learn, collaborate, and grow together." },
    { q: "Can I be both a mentor and learner?", a: "Yes. Every developer can teach skills they know while learning skills they want to improve." },
    { q: "How do I find a mentor?", a: "Use the developer discovery experience to find peers based on their skills and interests." },
    { q: "What are Bounties?", a: "Bounties are community-driven technical challenges that developers can solve to demonstrate their skills and earn reputation." },
    { q: "How does reputation work?", a: "Reputation grows through meaningful contributions, mentorship, collaboration, and completed challenges." },
    { q: "Is GDGPeer only for experienced developers?", a: "No. Beginners, intermediate developers, and experienced developers can all participate." }
  ];

  return (
    <section id="faq" className="w-full max-w-3xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-primary)] overflow-hidden transition-all">
            <button 
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <span className="font-bold text-[var(--color-text-primary)] text-lg pr-4">{faq.q}</span>
              {openIndex === i ? <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />}
            </button>
            <div className={`px-6 pb-6 text-[var(--color-text-secondary)] leading-relaxed transition-all ${openIndex === i ? 'block' : 'hidden'}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section id="connect" className="w-full max-w-6xl mx-auto px-4 py-20">
    <div className="bg-[var(--color-accent)] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Build Your Network.<br/>Share Your Skills.<br/>Grow Together.</h2>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          Your next mentor, collaborator, or learning partner is already in the community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="px-8 py-4 rounded-xl bg-white text-[var(--color-accent)] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Find Your Peers &rarr;
          </Link>
          <Link to="/discover" className="px-8 py-4 rounded-xl bg-transparent border-2 border-white/30 hover:bg-white/10 font-bold transition-all">
            Explore Workspace
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] pt-16 pb-8">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <div className="md:col-span-1">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <div className="bg-[var(--color-accent)] p-1.5 rounded-lg">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
            GDG<span className="text-[var(--color-accent)]">Peer</span>
          </span>
        </Link>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Peer-powered learning for the next generation of developers.
        </p>
      </div>
      
      <div>
        <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Navigation</h4>
        <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
          <li><a href="/#" className="hover:text-[var(--color-accent)] transition-colors">Home</a></li>
          <li><a href="/#workspace" className="hover:text-[var(--color-accent)] transition-colors">Workspace Overview</a></li>
          <li><a href="/#hall-of-fame" className="hover:text-[var(--color-accent)] transition-colors">Hall of Fame</a></li>
          <li><a href="/#faq" className="hover:text-[var(--color-accent)] transition-colors">FAQ</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Workspace</h4>
        <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
          <li><Link to="/discover" className="hover:text-[var(--color-accent)] transition-colors">Discover</Link></li>
          <li><Link to="/bounties" className="hover:text-[var(--color-accent)] transition-colors">Bounties</Link></li>
          <li><Link to="/leaderboard" className="hover:text-[var(--color-accent)] transition-colors">Leaderboard</Link></li>
          <li><Link to="/meeting" className="hover:text-[var(--color-accent)] transition-colors">Collab Room</Link></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Account</h4>
        <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
          <li><Link to="/profile" className="hover:text-[var(--color-accent)] transition-colors">Profile</Link></li>
          <li><Link to="/profile" className="hover:text-[var(--color-accent)] transition-colors">Settings</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
      &copy; {new Date().getFullYear()} GDGPeer Learning Platform. All rights reserved.
    </div>
  </footer>
);

const Landing = () => {
  const [activePeers, setActivePeers] = useState(1248);
  const navigate = useNavigate();

  useEffect(() => {
    // Add custom keyframes for animations if not exist
    if (!document.getElementById('landing-styles')) {
      const style = document.createElement('style');
      style.id = 'landing-styles';
      style.innerHTML = `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        html { scroll-behavior: smooth; }
      `;
      document.head.appendChild(style);
    }
  
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats');
        const data = await res.json();
        if (data && data.activePeers) {
          setActivePeers(data.activePeers);
        }
      } catch (err) {
        console.error('[API Error] Failed to fetch stats:', err);
      }
    };
    fetchStats();
    
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFindMentorClick = (e) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!user || !user.userId) {
      navigate('/login', { state: { returnTo: '/discover' } });
    } else {
      navigate('/discover');
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-[var(--color-bg-primary)] font-sans">
      <HeroSection activePeers={activePeers} handleFindMentorClick={handleFindMentorClick} />
      <WorkspaceOverview />
      <HowItWorks />
      <SkillExchange />
      <HallOfFame />
      <BountySection />
      <CommunityStats />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
