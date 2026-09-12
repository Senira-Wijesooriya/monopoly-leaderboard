"use client";
import { useState, useEffect } from 'react';
import CommentsSection from '@/components/CommentsSection';

const COUNTRIES = [
  "🇧🇷 Brazil", "🇮🇱 Israel", "🇮🇹 Italy", "🇩🇪 Germany", 
  "🇨🇳 China", "🇫🇷 France", "🇬🇧 UK", "🇺🇸 USA", "🏛️ Government"
];

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('🎩'); 
  
  // Track inline edits for Country & Color
  const [editStates, setEditStates] = useState<Record<string, { country: string, color: string }>>({});

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(data => {
      setPlayers(data);
      // Initialize edit states for each player
      const initialEdits: Record<string, { country: string, color: string }> = {};
      data.forEach((p: any) => {
        initialEdits[p.name] = { country: p.country || COUNTRIES[8], color: p.color || '#ffffff' };
      });
      setEditStates(initialEdits);
    });
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
      body: JSON.stringify({ name, nickname, avatar: avatarBase64, action: 'add' }) 
    });
    window.location.reload();
  };

  const savePlayerProfile = async (playerName: string) => {
    const state = editStates[playerName];
    await fetch('/api/players', { 
      method: 'POST', 
      body: JSON.stringify({ name: playerName, country: state.country, color: state.color, action: 'update_profile' }) 
    });
    alert(`${playerName}'s Profile Saved!`);
    window.location.reload();
  };

  const updateWin = async (playerName: string, action: 'win' | 'lose') => {
    await fetch('/api/players', { method: 'POST', body: JSON.stringify({ name: playerName, action }) });
    window.location.reload();
  };

  const deletePlayer = async (playerName: string) => {
    if (!confirm(`WARNING: Are you sure you want to PERMANENTLY destroy ${playerName}?`)) return;
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
            </div>
            
            <div className="flex items-center gap-4 bg-gray-100 p-4 rounded border-2 border-black">
              <label className="font-black text-black uppercase tracking-wider">Profile Picture:</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} className="text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:text-sm file:font-black file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 cursor-pointer"/>
              <div className="ml-auto w-12 h-12 rounded-full border-2 border-black overflow-hidden flex items-center justify-center text-2xl bg-white shadow-inner">
                {avatarBase64.startsWith('data:image') ? <img src={avatarBase64} alt="preview" className="w-full h-full object-cover"/> : avatarBase64}
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white rounded font-black uppercase tracking-widest hover:translate-y-1 hover:shadow-none transition-all mt-2">Create Player</button>
          </form>
        </div>

        {/* MANAGE PLAYERS */}
        <div className="bg-white p-8 rounded-xl border-4 border-black mb-12 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-6 text-black uppercase tracking-tight">Manage Player Profiles & Rents</h2>
          <div className="grid grid-cols-1 gap-6">
            {players.map(p => (
              <div key={p.name} className="flex flex-col md:flex-row items-center justify-between p-4 bg-yellow-100 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-lg">
                
                {/* Player Identity */}
                <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black flex items-center justify-center text-2xl bg-white shrink-0">
                    {p.avatar?.startsWith('data:image') ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover"/> : (p.avatar || '🎩')}
                  </div>
                  <div>
                    <div className="font-black text-lg uppercase leading-none">{p.name}</div>
                    <div className="text-sm font-bold text-gray-700">Wins: {p.wins}</div>
                  </div>
                </div>

                {/* Profile Controls (Country & Color) */}
                {editStates[p.name] && (
                  <div className="flex items-center gap-2 bg-white p-2 border-2 border-black rounded w-full md:w-auto mb-4 md:mb-0">
                    <select 
                      value={editStates[p.name].country} 
                      onChange={e => setEditStates({...editStates, [p.name]: { ...editStates[p.name], country: e.target.value }})}
                      className="p-2 border-2 border-black font-bold cursor-pointer bg-gray-100"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                      type="color" 
                      title="Player Box Color"
                      value={editStates[p.name].color}
                      onChange={e => setEditStates({...editStates, [p.name]: { ...editStates[p.name], color: e.target.value }})}
                      className="w-10 h-10 border-2 border-black p-0 cursor-pointer"
                    />
                    <button onClick={() => savePlayerProfile(p.name)} className="bg-blue-600 text-white px-4 py-2 font-black border-2 border-black uppercase text-sm">Save</button>
                  </div>
                )}

                {/* Match Controls */}
                <div className="flex gap-2 w-full md:w-auto justify-end">
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