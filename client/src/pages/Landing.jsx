import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Code, Zap, ChevronRight, Globe, ArrowRight } from 'lucide-react';
import { getStoredUser } from '../utils/userClient';

const Landing = () => {
  const [activePeers, setActivePeers] = useState(1248);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats');
        const data = await res.json();
        if (data && data.activePeers) {
          setActivePeers(data.activePeers);
        }
      } catch (err) {
        // Suppress console error if backend is not running during UI testing
        // and stop polling to prevent console spam
        if (interval) clearInterval(interval);
      }
    };
    fetchStats();
    
    interval = setInterval(fetchStats, 10000);
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
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-accent-muted)] text-[var(--color-accent)] text-xs font-bold tracking-wide uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
          </span>
          {activePeers.toLocaleString()} Peers Active Now
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight mb-6">
          Master Tech Skills with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#4ade80]">
            Peer Mentorship
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed">
          Connect, collaborate, and learn from fellow developers. Earn reputation, complete bounties, and build your engineering career in an open, community-driven ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={handleFindMentorClick} className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium flex items-center justify-center gap-2 transition-colors">
            Find a Mentor <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/bounties" className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-primary)] font-medium flex items-center justify-center gap-2 transition-colors">
            Solve Bounties
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 border-t border-[var(--color-border)]">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl gfg-panel card-hover">
            <div className="h-12 w-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center mb-6 border border-[var(--color-accent-muted)]">
              <Users className="h-6 w-6 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">1-on-1 Mentorship</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Book deep-dive sessions with peers who have mastered the stack you want to learn. Share screens, pair program, and grow.</p>
          </div>
          <div className="p-6 rounded-2xl gfg-panel card-hover">
            <div className="h-12 w-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center mb-6 border border-[var(--color-accent-muted)]">
              <Code className="h-6 w-6 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Doubt Bounties</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Stuck on a bug? Post a bounty using your GDG Coins. Help others solve their issues and earn coins in return.</p>
          </div>
          <div className="p-6 rounded-2xl gfg-panel card-hover">
            <div className="h-12 w-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center mb-6 border border-[var(--color-accent-muted)]">
              <Zap className="h-6 w-6 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Gamified Growth</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Maintain learning streaks, climb the campus leaderboard, and showcase your verifiable skills to potential recruiters.</p>
          </div>
        </div>
      </section>

      {/* Interactive Timeline (How it works) */}
      <section className="w-full max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">How Peer Mentorship Works</h2>
          <p className="text-[var(--color-text-secondary)]">A seamless workflow from finding help to mastering the skill.</p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-[var(--color-border)]">
          {[
            { step: '01', title: 'Discover Mentors', desc: 'Search for peers by specific skills (e.g., React, Go) and availability.', align: 'left' },
            { step: '02', title: 'Request a Session', desc: 'Send a quick context message and book a slot directly on their calendar.', align: 'right' },
            { step: '03', title: 'Collaborate & Code', desc: 'Join the real-time Collab Room with integrated code editor and video chat.', align: 'left' },
            { step: '04', title: 'Rate & Earn', desc: 'Leave feedback. Mentors earn GDG Coins and climb the leaderboard.', align: 'right' }
          ].map((item, i) => (
            <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors">
                {item.step}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl gfg-panel card-hover">
                <h4 className="font-bold text-[var(--color-text-primary)] mb-1">{item.title}</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
