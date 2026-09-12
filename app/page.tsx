"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CommentsSection from "@/components/CommentsSection";
import Mascot from "@/components/Mascot";
import ParticleBackground from "@/components/ParticleBackground";
import TiltCard from "@/components/TiltCard";

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [maxWins, setMaxWins] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/leaderboard").then(res => res.json()).then(data => {
      const activePlayers = data.filter((p: any) => p.wins !== -999);
      setPlayers(activePlayers);
      setMaxWins(Math.max(...activePlayers.map((p: any) => p.wins), 1));
    });
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const topPlayers = [...players].sort((a, b) => b.wins - a.wins).slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-950 text-white relative font-sans pb-24 overflow-x-hidden selection:bg-green-500/30">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        
        {/* HEADER & MASCOT */}
        <header className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <Mascot />
          <div className="text-center md:text-left">
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 mb-2 uppercase tracking-tighter drop-shadow-lg">
              Monopoly Vault
            </h1>
            <p className="text-xl text-green-400 tracking-widest uppercase font-bold flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Live Global Rankings
            </p>
          </div>
        </header>

        {/* ANIMATED STATS DASHBOARD (Top 3) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-yellow-500/10 pointer-events-none" />
          <h2 className="text-xl font-bold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
            <span className="text-2xl">👑</span> Board Tycoons
          </h2>
          
          <div className="space-y-6 relative z-10">
            {topPlayers.map((player, index) => {
              const widthPercent = mounted ? (player.wins / maxWins) * 100 : 0;
              return (
                <div key={player.name} className="relative">
                  <div className="flex justify-between text-sm mb-2 font-black uppercase tracking-widest">
                    <span className="text-gray-200 flex items-center gap-2">
                      {index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                      {index === 1 && <span className="text-gray-300 text-lg">🥈</span>}
                      {index === 2 && <span className="text-amber-700 text-lg">🥉</span>}
                      {player.nickname}
                    </span>
                    <span className="text-green-400">{player.wins} Wins</span>
                  </div>
                  <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${
                        index === 0 ? 'from-yellow-600 to-yellow-300' : 
                        index === 1 ? 'from-gray-500 to-gray-300' : 
                        'from-amber-800 to-amber-500'
                      } transition-all duration-[1500ms] ease-out relative`}
                      style={{ width: `${widthPercent}%`, minWidth: '5%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D HOVER LEADERBOARD LIST */}
        <div className="space-y-4 mb-20">
          {players.sort((a, b) => b.wins - a.wins).map((player: any, index: number) => (
            <Link href={`/players/${player.name}`} key={player.name}>
              <TiltCard className="group relative cursor-pointer block">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
                <div className="relative bg-black/40 backdrop-blur-sm border border-gray-800 group-hover:border-green-500/50 rounded-xl p-4 flex items-center gap-4">
                  
                  <div className="w-12 text-center font-black text-2xl text-gray-600 group-hover:text-yellow-400 transition-colors">
                    #{index + 1}
                  </div>

                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-green-400 flex items-center justify-center text-3xl bg-gray-900 shrink-0">
                     {player.avatar?.startsWith('data:image') ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover"/> : (player.avatar || '🎩')}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="text-xl font-black text-gray-200 truncate uppercase">{player.name}</h3>
                    <span className="text-sm text-green-400 italic font-serif">"{player.nickname}"</span>
                  </div>

                  <div className="shrink-0 text-right pr-4">
                    <div className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                      {player.wins}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Link>
          ))}
        </div>

        <CommentsSection />
      </div>
    </main>
  );
}