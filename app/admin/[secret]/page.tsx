"use client";
import { useState, useEffect } from 'react';
import CommentsSection from '@/components/CommentsSection';

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('🎩'); // Default emoji if no image

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(data => {
      // Filter out deleted players (marked by -999 wins from our delete route)
      setPlayers(data.filter((p: any) => p.wins !== -999));
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

  const updateWin = async (playerName: string, action: 'win' | 'lose') => {
    await fetch('/api/players', { method: 'POST', body: JSON.stringify({ name: playerName, action }) });
    window.location.reload();
  };

  const deletePlayer = async (playerName: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${playerName}?`)) return;
    await fetch('/api/players', { method: 'DELETE', body: JSON.stringify({ name: playerName }) });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black text-red-500 mb-8 uppercase tracking-widest border-b-4 border-red-900/50 pb-4">MIT ESP Banker's Vault (Admin)</h1>
        
        {/* ADD PLAYER */}
        <div className="bg-gray-900 p-8 rounded-xl border-2 border-gray-800 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400 uppercase tracking-widest">Register New Tycoon</h2>
          <form onSubmit={addPlayer} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input placeholder="Real Name" value={name} onChange={e => setName(e.target.value)} required className="flex-1 p-4 rounded bg-gray-800 border-2 border-gray-700 text-white font-bold" />
              <input placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} required className="flex-1 p-4 rounded bg-gray-800 border-2 border-gray-700 text-white font-bold" />
            </div>
            
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded border-2 border-gray-700">
              <label className="font-bold text-gray-300">Profile Picture (JPG/PNG):</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-black file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500 cursor-pointer"/>
              <div className="ml-auto w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden flex items-center justify-center text-2xl bg-black">
                {avatarBase64.startsWith('data:image') ? <img src={avatarBase64} alt="preview" className="w-full h-full object-cover"/> : avatarBase64}
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded font-black uppercase tracking-widest transition-colors mt-2">Add Player</button>
          </form>
        </div>

        {/* MANAGE PLAYERS */}
        <div className="bg-gray-900 p-8 rounded-xl border-2 border-gray-800 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-green-400 uppercase tracking-widest">Manage Properties & Rents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map(p => (
              <div key={p.name} className="flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500 flex items-center justify-center text-2xl bg-black shrink-0">
                    {p.avatar?.startsWith('data:image') ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover"/> : (p.avatar || '🎩')}
                  </div>
                  <div>
                    <div className="font-black text-lg uppercase">{p.name}</div>
                    <div className="text-sm text-green-400">Wins: {p.wins}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateWin(p.name, 'win')} className="w-10 h-10 bg-green-600 hover:bg-green-500 rounded font-black text-xl flex items-center justify-center text-white" title="Add Win">+</button>
                  <button onClick={() => updateWin(p.name, 'lose')} className="w-10 h-10 bg-orange-600 hover:bg-orange-500 rounded font-black text-xl flex items-center justify-center text-white" title="Remove Win">-</button>
                  <button onClick={() => deletePlayer(p.name)} className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded font-black text-xl flex items-center justify-center text-white ml-4" title="Delete Player">X</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-4 border-red-900/50 pt-12">
          <h2 className="text-3xl font-black text-red-500 text-center mb-2 uppercase tracking-widest">Moderate Community Chest</h2>
          <CommentsSection isAdmin={true} />
        </div>
      </div>
    </div>
  );
}