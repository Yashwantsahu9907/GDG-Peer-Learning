import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, Video, Grid, List, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data
const mentors = [
  { id: 1, name: 'Alice Chen', role: 'Senior CS Student', skills: ['React', 'Node.js', 'System Design'], rating: 4.9, match: 95, availability: ['Today 2-4PM', 'Tomorrow 10AM-12PM'], avatar: 'AC' },
  { id: 2, name: 'David Kumar', role: 'GDG Lead', skills: ['Python', 'Machine Learning', 'Data Structures'], rating: 4.8, match: 88, availability: ['Wed 3-5PM'], avatar: 'DK' },
  { id: 3, name: 'Sarah Jones', role: 'Frontend Specialist', skills: ['Vue', 'Tailwind CSS', 'Figma'], rating: 4.7, match: 82, availability: ['Thu 1-3PM', 'Fri 10AM-12PM'], avatar: 'SJ' },
  { id: 4, name: 'Michael Lee', role: 'Backend Dev', skills: ['Go', 'Docker', 'Kubernetes'], rating: 4.9, match: 91, availability: ['Mon 9-11AM'], avatar: 'ML' },
];

const Discover = () => {
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModalMentor, setSelectedModalMentor] = useState(null);
  const navigate = useNavigate();

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const searchLower = searchTerm.toLowerCase();
      return (
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.role.toLowerCase().includes(searchLower) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    });
  }, [searchTerm]);

  const handleSchedule = (e) => {
    e.preventDefault();
    // Simulate scheduling logic
    const sessionId = Math.random().toString(36).substring(7);
    navigate(`/session/${sessionId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Find a Peer Mentor</h1>
          <p className="text-[var(--color-text-secondary)]">Discover students who can help you master your next skill.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-1 flex">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
              <Grid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="gfg-panel p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skills, names, or roles..." 
            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors font-semibold">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Grid View */}
      <div className={`grid gap-6 ${view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className={`gfg-panel p-5 flex ${view === 'grid' ? 'flex-col' : 'flex-col sm:flex-row gap-6 items-start'} card-hover`}>
            
            <div className={`flex items-start gap-4 ${view === 'grid' ? 'mb-4' : 'w-1/3'}`}>
              <div className="h-14 w-14 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg shrink-0">
                {mentor.avatar}
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{mentor.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{mentor.role}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    {mentor.rating}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {mentor.match}% Match
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex flex-col flex-grow ${view === 'grid' ? '' : 'w-2/3'}`}>
              <div className="mb-4">
                <div className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wide font-bold">Skills Taught</div>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] text-xs border border-[var(--color-border)] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-medium">
                  <Clock className="h-4 w-4" />
                  <span>{mentor.availability[0]}</span>
                </div>
                <button onClick={() => setSelectedModalMentor(mentor)} className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold transition-colors">
                  Request Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduling Modal */}
      {selectedModalMentor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Schedule Session</h2>
              <button onClick={() => setSelectedModalMentor(null)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSchedule} className="p-5 space-y-5">
              <div className="flex items-center gap-4 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
                <div className="h-12 w-12 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg">
                  {selectedModalMentor.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">{selectedModalMentor.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">{selectedModalMentor.role}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Topic / Skills</label>
                <input type="text" defaultValue={selectedModalMentor.skills[0]} className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Select Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedModalMentor.availability.map((time) => (
                    <div key={time} className="flex items-center gap-2 p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] cursor-pointer hover:border-[var(--color-accent)] transition-colors">
                      <input type="radio" name="time" value={time} defaultChecked className="text-[var(--color-accent)]" />
                      <span className="text-sm text-[var(--color-text-primary)]">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedModalMentor(null)} className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors flex items-center gap-2">
                  <Video className="h-4 w-4" /> Start Collaboration
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
