import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Coins, Flame, Award, Video, CheckCircle2, Search, Target, Gift } from 'lucide-react';

const Points = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans mt-8">
      <div className="bg-[var(--color-bg-primary)] rounded-3xl border border-[var(--color-border)] p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">
              GDG Coins & Rewards
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Earn coins by participating in the community and spend them on bounties or exclusive rewards!
            </p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border-2 border-[var(--color-accent)]/30 rounded-2xl p-6 text-center shadow-lg min-w-[200px]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Coins className="w-8 h-8 text-[var(--color-accent)]" />
              <span className="text-5xl font-black text-[var(--color-text-primary)]">{user?.gdgCoins || 0}</span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Your Balance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">How to Earn</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-emerald-500/50 transition-colors bg-[var(--color-bg-secondary)]">
              <Flame className="w-6 h-6 text-orange-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Daily Login <span className="text-emerald-500 font-black">+1 Coin</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Visit the platform every day to automatically receive a coin.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-emerald-500/50 transition-colors bg-[var(--color-bg-secondary)]">
              <Video className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Host a Session <span className="text-emerald-500 font-black">+10 Coins</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Teach a skill or host a study group for your peers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-emerald-500/50 transition-colors bg-[var(--color-bg-secondary)]">
              <CheckCircle2 className="w-6 h-6 text-purple-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Solve a Bounty <span className="text-emerald-500 font-black">Variable</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Complete open bounties and earn the coins offered by the creator.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-emerald-500/50 transition-colors bg-[var(--color-bg-secondary)]">
              <Award className="w-6 h-6 text-yellow-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Get 5-Star Review <span className="text-emerald-500 font-black">+5 Coins</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Receive top ratings from peers after a mentoring session.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <Gift className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">How to Spend</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-rose-500/50 transition-colors bg-[var(--color-bg-secondary)]">
              <Search className="w-6 h-6 text-indigo-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Create a Bounty <span className="text-rose-500 font-black">- Any Amount</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Need help debugging or learning a specific topic? Offer coins to incentivize peers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-rose-500/50 transition-colors bg-[var(--color-bg-secondary)]">
              <Video className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Request 1-on-1 <span className="text-rose-500 font-black">- 15 Coins</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Book a private priority session with an expert mentor.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-rose-500/50 transition-colors bg-gradient-to-r from-[var(--color-bg-secondary)] to-yellow-50/50 dark:to-yellow-900/10">
              <Award className="w-6 h-6 text-yellow-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center justify-between">Swag & Merch <span className="text-rose-500 font-black">Coming Soon</span></h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">Redeem your coins for exclusive GDG Peer Learning merchandise!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points;
