"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CommentsSection from "@/components/CommentsSection";
import Mascot from "@/components/Mascot";
import ParticleBackground from "@/components/ParticleBackground";
import TiltCard from "@/components/TiltCard";

// Rank Title Generator
function getRankTitle(rank: number, total: number) {
  if (rank === 1) return "UndeFeated Tycoon";
  if (rank === 2) return "Billionaire Beast";
  if (rank === 3) return "Market Monster";
  if (rank === 4) return "Money Mogul";
  if (rank === 5) return "Fortune Hunter";
  if (rank === 6) return "Cash Commander";
  if (rank === 7) return "Profit Player";
  if (rank === 8) return "Wealth Warrior";
  if (rank === 9) return "Deal Maker";
  if (rank === 10) return "Rising Tycoon";
  
  if (rank === total && total > 10) return "CEO of Broke";
  if (rank === total - 1 && total > 10) return "Financial Intern";
  if (rank === total - 2 && total > 10) return "Discount Tycoon";
  if (rank === total - 3 && total > 10) return "Wallet Warrior";
  
  return "Aspiring Tycoon";
}

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [rankColors, setRankColors] = useState<Record<string, string>>({});
  const [topCountry, setTopCountry] = useState("🏛️ Government");

  useEffect(() => {
    // Fetch leaderboard
    fetch("/api/leaderboard").then(res => res.json()).then(data => {
      setPlayers(data);
      if (data.length > 0) {
        const countryCounts = data.reduce((acc: any, p: any) => {
          const c = p.country || "🏛️ Government";
          acc[c] = (acc[c] || 0) + p.wins;
          return acc;
        }, {});
        const max = Object.keys(countryCounts).reduce((a, b) => countryCounts[a] > countryCounts[b] ? a : b);
        setTopCountry(max);
      }
    });

    // Fetch Custom Colors
    fetch("/api/settings").then(res => res.json()).then(colors => {
      setRankColors(colors);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#cfe0e0] text-gray-900 relative font-sans pb-24 overflow-x-hidden">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-center mb-8">
          <div className="bg-red-600 border-2 border-black px-6 py-2 rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <span className="text-white font-bold uppercase tracking-widest text-sm">Most Demanding Region:</span>
            <span className="text-2xl font-black bg-white px-3 py-1 rounded text-black border border-black shadow-inner">{topCountry}</span>
          </div>
        </div>

        <header className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <Mascot />
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
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

        <div className="space-y-6 mb-20">
          {players.sort((a, b) => b.wins - a.wins).map((player: any, index: number) => {
            const rank = index + 1;
            // Determine box color from Admin settings, with fallbacks
            const boxColor = rankColors[rank] || (rank === 1 ? '#facc15' : rank === 2 ? '#d1d5db' : rank === 3 ? '#fb923c' : '#dbeafe');

            return (
              <div key={player.name}>
                <Link href={`/players/${player.name}`}>
                  <TiltCard className="group relative cursor-pointer block">
                    <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_rgba(220,38,38,1)] group-hover:-translate-y-1 rounded-xl p-4 flex items-center gap-4 transition-all">
                      
                      <div 
                        className="w-16 h-16 rounded flex items-center justify-center font-black text-3xl border-2 border-black text-black"
                        style={{ backgroundColor: boxColor }}
                      >
                        #{rank}
                      </div>

                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black flex items-center justify-center text-4xl bg-gray-100 shrink-0">
                         {player.avatar?.startsWith('data:image') ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover"/> : (player.avatar || '🎩')}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="text-2xl font-black text-black truncate uppercase tracking-tight">{player.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {/* New Dynamic Rank Title */}
                          <span className="text-sm text-gray-900 font-bold bg-gray-200 px-2 py-0.5 rounded border border-gray-400 uppercase tracking-widest shadow-sm">
                            {getRankTitle(rank, players.length)}
                          </span>
                          <span className="text-sm font-bold">{player.country || "🏛️ Government"}</span>
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
            )
          })}
        </div>

        <CommentsSection />
      </div>
    </main>
  );
}