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
  const [showMoney, setShowMoney] = useState(false);
  const [topCountry, setTopCountry] = useState("🌍 Global");

  useEffect(() => {
    fetch("/api/leaderboard").then(res => res.json()).then(data => {
      // Bug fixed: data comes perfectly clean now from our true delete
      setPlayers(data);
      if (data.length > 0) {
        setMaxWins(Math.max(...data.map((p: any) => p.wins), 1));
        
        // Calculate Most Demanding Country
        const countryCounts = data.reduce((acc: any, p: any) => {
          const c = p.country || "🌍 Global";
          acc[c] = (acc[c] || 0) + p.wins;
          return acc;
        }, {});
        const max = Object.keys(countryCounts).reduce((a, b) => countryCounts[a] > countryCounts[b] ? a : b);
        setTopCountry(max);
      }
    });
    setMounted(true);
  }, []);

  const triggerMoneyAnimation = (index: number) => {
    if (index === 0) {
      setShowMoney(true);
      setTimeout(() => setShowMoney(false), 3500); // Stop after 3.5s
    }
  };

  const topPlayers = [...players].sort((a, b) => b.wins - a.wins).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#cfe0e0] text-gray-900 relative font-sans pb-24 overflow-x-hidden">
      <ParticleBackground />

      {/* MONEY ANIMATION LAYER */}
      {showMoney && (
        <>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`fall-${i}`} className="animate-money-fall" style={{ left: `${Math.random() * 100}vw`, animationDelay: `${Math.random() * 2}s` }}>
              💵
            </div>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`shoot-${i}`} className="animate-money-shoot" style={{ animationDelay: `${Math.random() * 1.5}s` }}>
              💰
            </div>
          ))}
        </>
      )}

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        
        {/* TOP BANNER: MOST DEMANDING COUNTRY */}
        <div className="flex justify-center mb-8">
          <div className="bg-red-600 border-2 border-black px-6 py-2 rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <span className="text-white font-bold uppercase tracking-widest text-sm">Most Demanding Region:</span>
            <span className="text-2xl font-black bg-white px-3 py-1 rounded text-black border border-black shadow-inner">{topCountry}</span>
          </div>
        </div>

        {/* HEADER & MASCOT (CLASSIC MONOPOLY STYLE) */}
        <header className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <Mascot />
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            {/* Classic Red Box White Text */}
            <div className="bg-red-600 border-4 border-white outline outline-4 outline-black shadow-[8px_8px_0px_rgba(0,0,0,1)] px-8 py-2 transform -rotate-2 mb-4 hover:rotate-0 transition-transform cursor-pointer">
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">
                MONOPOLY
              </h1>
            </div>
            <p className="text-2xl text-black tracking-widest uppercase font-black bg-yellow-400 border-2 border-black px-4 py-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              MIT Ranking
            </p>
          </div>
        </header>

        {/* 3D HOVER LEADERBOARD LIST */}
        <div className="space-y-6 mb-20">
          {players.sort((a, b) => b.wins - a.wins).map((player: any, index: number) => (
            <div key={player.name} onClick={() => triggerMoneyAnimation(index)}>
              <Link href={`/players/${player.name}`}>
                <TiltCard className="group relative cursor-pointer block">
                  <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_rgba(220,38,38,1)] group-hover:-translate-y-1 rounded-xl p-4 flex items-center gap-4 transition-all">
                    
                    {/* Rank Badge */}
                    <div className={`w-16 h-16 rounded flex items-center justify-center font-black text-3xl border-2 border-black ${index === 0 ? 'bg-yellow-400 text-black' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-orange-400' : 'bg-blue-100'}`}>
                      #{index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black flex items-center justify-center text-4xl bg-gray-100 shrink-0">
                       {player.avatar?.startsWith('data:image') ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover"/> : (player.avatar || '🎩')}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="text-2xl font-black text-black truncate uppercase tracking-tight">{player.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600 font-bold bg-gray-200 px-2 py-0.5 rounded border border-gray-400">"{player.nickname}"</span>
                        <span className="text-sm font-bold">{player.country || "🌍 Global"}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right pr-4">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Properties</div>
                      <div className="text-4xl font-black font-mono text-green-600 drop-shadow-sm">
                        {player.wins}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </div>
          ))}
        </div>

        <CommentsSection />
      </div>
    </main>
  );
}