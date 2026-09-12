"use client";
import { useState, useEffect } from 'react';
import CommentsSection from '@/components/CommentsSection';

export default function AdminPage({ params }: { params: { secret: string } }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('🎩');

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(setPlayers);
  }, []);

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/win', { 
      method: 'POST', 
      body: JSON.stringify({ name, nickname, avatar, action: 'init' }) 
    });
    window.location.reload();
  };

  const addWin = async (playerName: string) => {
    await fetch('/api/win', { method: 'POST', body: JSON.stringify({ name: playerName, action: 'win' }) });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black text-red-500 mb-8 uppercase tracking-widest border-b-4 border-red-900/50 pb-4">Banker's Vault (Admin)</h1>
        
        <div className="bg-gray-900 p-8 rounded-xl border-2 border-gray-800 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400 uppercase tracking-widest">Register New Tycoon</h2>
          <form onSubmit={addPlayer} className="flex flex-col md:flex-row gap-4">
            <input placeholder="Real Name" value={name} onChange={e => setName(e.target.value)} required className="flex-1 p-4 rounded bg-gray-800 border-2 border-gray-700 text-white font-bold" />
            <input placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} required className="flex-1 p-4 rounded bg-gray-800 border-2 border-gray-700 text-white font-bold" />
            <select value={avatar} onChange={e => setAvatar(e.target.value)} className="p-4 rounded bg-gray-800 border-2 border-gray-700 text-3xl">
              <option value="🎩">🎩</option>
              <option value="🚗">🚗</option>
              <option value="🐕">🐕</option>
              <option value="🚢">🚢</option>
              <option value="👟">👟</option>
              <option value="🦖">🦖</option>
              <option value="🐈">🐈</option>
            </select>
            <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded font-black uppercase tracking-widest transition-colors">Add</button>
          </form>
        </div>

        <div className="bg-gray-900 p-8 rounded-xl border-2 border-gray-800 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-green-400 uppercase tracking-widest">Distribute Properties (+1 Win)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map(p => (
              <button key={p.name} onClick={() => addWin(p.name)} className="p-6 bg-green-900/30 hover:bg-green-600 border-2 border-green-700 rounded-lg text-center transition-all hover:scale-105 group">
                <div className="text-4xl mb-2">{p.avatar}</div>
                <div className="font-black text-lg uppercase">{p.name}</div>
                <div className="text-sm text-green-300 italic group-hover:text-white font-serif">"{p.nickname}"</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t-4 border-red-900/50 pt-12">
          <h2 className="text-3xl font-black text-red-500 text-center mb-2 uppercase tracking-widest">Moderate Community Chest</h2>
          <p className="text-center text-gray-400 mb-8">Delete unauthorized messages below.</p>
          <CommentsSection isAdmin={true} />
        </div>
      </div>
    </div>
  );
}