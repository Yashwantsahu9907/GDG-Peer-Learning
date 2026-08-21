import React, { useState, useEffect } from'react';
import { Coins, CheckCircle, Clock, Plus, Tag, X } from'lucide-react';
import { useAuth } from'../contexts/AuthContext';
import toast from'react-hot-toast';
import { API_URL } from '../config';

const Bounties = () => {
 const [filter, setFilter] = useState('All');
 const [bounties, setBounties] = useState([]);
 const [showModal, setShowModal] = useState(false);
 const [loading, setLoading] = useState(true);
 const { user } = useAuth();
 
 const [formData, setFormData] = useState({
 title:'',
 description:'',
 coins: 50,
 tags:''
 });

 const fetchBounties = async () => {
 try {
 const res = await fetch(`${API_URL}/bounties`);
 const data = await res.json();
 if (data.success) {
 setBounties(data.bounties);
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchBounties();
 }, []);

 const handlePostBounty = async (e) => {
 e.preventDefault();
 if (!user) {
 toast.error('Please login to post a bounty');
 return;
 }
 try {
 const tagsArray = formData.tags.split(',').map(t => t.trim());
 const res = await fetch(`${API_URL}/bounties`, {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({
 ...formData,
 tags: tagsArray
 }),
 credentials:'include'
 });
 const data = await res.json();
 if (data.success) {
 toast.success('Bounty posted successfully!');
 setShowModal(false);
 setFormData({ title:'', description:'', coins: 50, tags:'' });
 fetchBounties();
 } else {
 toast.error(data.message ||'Failed to post bounty');
 }
 } catch (err) {
 console.error('Error posting bounty:', err);
 toast.error('Error posting bounty');
 }
 };

 const handleResolve = async (bountyId) => {
 if (!user) {
 toast.error('Please login to resolve a bounty');
 return;
 }
 // Simplification for UI demonstration: we pass our own ID as the solver
 // In a real flow, the author would pick the solver.
 try {
 const res = await fetch(`${API_URL}/bounties/${bountyId}/resolve`, {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({ solverId: user._id }),
 credentials:'include'
 });
 const data = await res.json();
 if (data.success) {
 toast.success('Bounty resolved!');
 fetchBounties();
 } else {
 toast.error(data.message ||'Failed to resolve bounty');
 }
 } catch (err) {
 console.error('Error resolving bounty:', err);
 toast.error('Error resolving bounty');
 }
 };

 const filteredBounties = bounties.filter(b => filter ==='All' || b.status === filter);

 return (
 <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 relative">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Doubt Bounties</h1>
 <p className="text-[var(--color-text-secondary)]">Earn GDG Coins by solving peer issues, or post your own.</p>
 </div>
 <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
 <Plus className="h-4 w-4" /> Post a Bounty
 </button>
 </div>

 <div className="flex gap-2 border-b border-[var(--color-border)] pb-4 overflow-x-auto hide-scrollbar">
 {['All','Open','In Progress','Solved'].map(f => (
 <button 
 key={f} 
 onClick={() => setFilter(f)}
 className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${filter === f ?'bg-[var(--color-bg-secondary)] text-[var(--color-accent)] border border-[var(--color-accent)]' :'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] border border-transparent'}`}
 >
 {f}
 </button>
 ))}
 </div>

 <div className="space-y-4">
 {loading ? (
 <div className="text-center py-10 text-[var(--color-text-secondary)]">Loading bounties...</div>
 ) : filteredBounties.map(bounty => (
 <div key={bounty._id} className="p-5 gfg-panel card-hover flex flex-col sm:flex-row gap-4 sm:items-center">
 
 <div className="flex-grow">
 <div className="flex items-center gap-3 mb-2">
 <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
 bounty.status ==='Open' ?'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
 bounty.status ==='In Progress' ?'bg-orange-500/10 text-orange-600 border-orange-500/20' :'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] border-[var(--color-border)]'
 }`}>
 {bounty.status}
 </span>
 <span className="text-[var(--color-text-muted)] text-sm font-medium flex items-center gap-1">
 <Clock className="h-3 w-3" /> {new Date(bounty.createdAt).toLocaleDateString()} by {bounty.author?.name ||'Anonymous'}
 </span>
 </div>
 <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 hover:text-[var(--color-accent)] cursor-pointer transition-colors">{bounty.title}</h3>
 <div className="flex gap-2 flex-wrap">
 {bounty.tags.map(tag => (
 <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center gap-1 font-medium">
 <Tag className="h-3 w-3" /> {tag}
 </span>
 ))}
 </div>
 </div>

 <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-[var(--color-border)] pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 font-bold">
 <Coins className="h-4 w-4" />
 {bounty.coins}
 </div>
 <button onClick={() => handleResolve(bounty._id)} className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] font-semibold hover:text-[var(--color-accent)] transition-colors">
 <CheckCircle className="h-4 w-4" /> Resolve
 </button>
 </div>

 </div>
 ))}

 {!loading && filteredBounties.length === 0 && (
 <div className="py-12 text-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-bg-secondary)]">
 <CheckCircle className="h-10 w-10 text-[var(--color-text-muted)] mx-auto mb-3" />
 <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No {filter.toLowerCase()} bounties found</h3>
 <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Check back later or post your own.</p>
 </div>
 )}
 </div>

 {showModal && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
 <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
 <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
 <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Post a Bounty</h2>
 <button onClick={() => setShowModal(false)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
 <X className="h-5 w-5" />
 </button>
 </div>
 <form onSubmit={handlePostBounty} className="p-5 space-y-4">
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Title</label>
 <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]" placeholder="e.g., Need help debugging React useEffect" />
 </div>
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Description</label>
 <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]" placeholder="Describe your issue..."></textarea>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Reward (Coins)</label>
 <input type="number" required min="10" value={formData.coins} onChange={e => setFormData({...formData, coins: e.target.value})} className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]" />
 </div>
 <div>
 <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Tags (comma separated)</label>
 <input type="text" required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]" placeholder="React, Node.js" />
 </div>
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Cancel</button>
 <button type="submit" className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">Post Bounty</button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
};

export default Bounties;
