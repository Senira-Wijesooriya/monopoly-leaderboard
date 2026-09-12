"use client";
import { useState, useEffect } from 'react';
import CommentsSection from '@/components/CommentsSection';

const COUNTRIES = ["🌍 Global", "🇱🇰 Sri Lanka", "🇺🇸 USA", "🇬🇧 UK", "🇦🇺 Australia", "🇯🇵 Japan", "🇦🇪 UAE"];

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [avatarBase64, setAvatarBase64] = useState('🎩'); 

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(setPlayers);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nickname.trim()) return alert("Name and Nickname required");
    await fetch('/api/players', { 
      method: 'POST', 
      body: JSON.stringify({ name, nickname, avatar: avatarBase64, country, action: 'add' }) 
    });
    window.location.reload();
  };

  const updateWin = async (playerName: string, action: 'win' | 'lose') => {
    await fetch('/api/players', { method: 'POST', body: JSON.stringify({ name: playerName, action }) });
    window.location.reload();
  };

  const deletePlayer = async (playerName: string) => {
    if (!confirm(`WARNING: Are you sure you want to PERMANENTLY destroy ${playerName}'s properties?`)) return;
    await fetch('/api/players', { method: 'DELETE', body: JSON.stringify({ name: playerName }) });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#cfe0e0] text-black p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="bg-red-600 border-4 border-white outline outline-4 outline-black shadow-[8px_8px_0px_rgba(0,0,0,1)] px-8 py-4 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            MONOPOLY Administrator
          </h1>
        </div>
        
        {/* ADD PLAYER */}
        <div className="bg-white p-8 rounded-xl border-4 border-black mb-12 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-6 text-black uppercase tracking-tight">Register New Tycoon</h2>
          <form onSubmit={addPlayer} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input placeholder="Real Name" value={name} onChange={e => setName(e.target.value)} required className="flex-1 p-4 rounded bg-gray-100 border-2 border-black font-bold focus:bg-white" />
              <input placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} required className="flex-1 p-4 rounded bg-gray-100 border-2 border-black font-bold focus:bg-white" />
              <select value={country} onChange={e => setCountry(e.target.value)} className="flex-1 p-4 rounded bg-gray-100 border-2 border-black font-bold cursor-pointer">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-100 p-4 rounded border-2 border-black">
              <label className="font-black text-black uppercase tracking-wider">Profile Picture (JPG/PNG):</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} className="text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:text-sm file:font-black file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 cursor-pointer"/>
              <div className="ml-auto w-12 h-12 rounded-full border-2 border-black overflow-hidden flex items-center justify-center text-2xl bg-white shadow-inner">
                {avatarBase64.startsWith('data:image') ? <img src={avatarBase64} alt="preview" className="w-full h-full object-cover"/> : avatarBase64}
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none text-white rounded font-black uppercase tracking-widest transition-all mt-2">Create Player Account</button>
          </form>
        </div>

        {/* MANAGE PLAYERS */}
        <div className="bg-white p-8 rounded-xl border-4 border-black mb-12 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-6 text-black uppercase tracking-tight">Manage Properties & Rents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {players.map(p => (
              <div key={p.name} className="flex items-center justify-between p-4 bg-yellow-100 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black flex items-center justify-center text-2xl bg-white shrink-0">
                    {p.avatar?.startsWith('data:image') ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover"/> : (p.avatar || '🎩')}
                  </div>
                  <div>
                    <div className="font-black text-lg uppercase leading-none">{p.name}</div>
                    <div className="text-sm font-bold text-gray-700">{p.country} | Wins: {p.wins}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateWin(p.name, 'win')} className="w-10 h-10 bg-green-500 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none rounded font-black text-xl flex items-center justify-center text-black" title="Add Win">+</button>
                  <button onClick={() => updateWin(p.name, 'lose')} className="w-10 h-10 bg-orange-500 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none rounded font-black text-xl flex items-center justify-center text-black" title="Remove Win">-</button>
                  <button onClick={() => deletePlayer(p.name)} className="w-10 h-10 bg-red-600 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none rounded font-black text-xl flex items-center justify-center text-white ml-2" title="Delete Player">X</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-8 border-black pt-12">
          <CommentsSection isAdmin={true} />
        </div>
      </div>
    </div>
  );
}