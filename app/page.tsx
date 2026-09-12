"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CommentsSection from "@/components/CommentsSection";

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [maxWins, setMaxWins] = useState(1);

  useEffect(() => {
    fetch("/api/leaderboard").then(res => res.json()).then(data => {
      setPlayers(data);
      setMaxWins(Math.max(...data.map((p: any) => p.wins), 1));
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-hidden relative font-sans pb-24">
      
      {/* BOUNCING / MOVING TOY ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-7xl animate-float opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🎲</div>
        <div className="absolute top-60 right-20 text-7xl animate-[float_4s_infinite] opacity-30 delay-100">🎩</div>
        <div className="absolute bottom-40 left-1/4 text-7xl animate-[float_5s_infinite] opacity-20">🚗</div>
        <div className="absolute top-1/3 right-1/3 text-7xl animate-[float_7s_infinite] opacity-20 delay-200">🐕</div>
        <div className="absolute bottom-20 right-1/4 text-7xl animate-[float_6s_infinite] opacity-20 delay-300">💰</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 mb-4 uppercase tracking-tighter shadow-black">
            Monopoly Vault
          </h1>
          <p className="text-xl text-gray-400 tracking-widest uppercase font-bold">Global Domination Leaderboard</p>
        </header>

        {/* CREATIVE DASHBOARD - ANIMATED CHARTS */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-24 h-64 border-b-4 border-green-600/30 pb-4 max-w-4xl mx-auto">
          {players.map((player: any) => {
            const h = (player.wins / maxWins) * 100;
            return (
              <div key={player.name} className="flex flex-col items-center group w-24">
                <span className="mb-2 font-black text-2xl opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400 drop-shadow-md">
                  {player.wins}
                </span>
                <div 
                  className="w-full bg-gradient-to-t from-green-800 to-green-400 rounded-t-md relative transition-all duration-1000 ease-out hover:brightness-125 border-x-2 border-t-2 border-black/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                  style={{ height: `${h}%`, minHeight: '15%' }}
                />
                <div className="mt-4 flex flex-col items-center">
                   <div className="text-3xl drop-shadow-lg">{player.avatar}</div>
                   <span className="text-sm font-bold truncate mt-1 text-white">{player.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D PRODUCT SHOWCASE CARDS (TITLE DEEDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000 max-w-6xl mx-auto mb-20">
          {players.map((player: any) => (
            <Link href={`/players/${player.name}`} key={player.name}>
              <div className="group relative w-full h-64 transform-style-3d transition-transform duration-500 hover:-translate-y-4 hover:rotate-x-12 hover:rotate-y-12 cursor-pointer">
                <div className="absolute inset-0 bg-white border-[6px] border-black rounded-lg shadow-2xl overflow-hidden flex flex-col">
                  {/* Deed Header - Matches classic Monopoly card style */}
                  <div className="h-20 bg-blue-600 w-full border-b-4 border-black flex flex-col items-center justify-center p-2">
                     <span className="font-black text-[10px] uppercase tracking-[0.2em] text-black">TITLE DEED</span>
                     <h2 className="text-xl font-black text-black uppercase text-center leading-tight shadow-white drop-shadow-sm">{player.name}</h2>
                  </div>
                  
                  <div className="p-4 flex flex-col items-center text-center flex-1 justify-center bg-[#D8E8D8]">
                    <div className="text-4xl mb-2 drop-shadow-md">{player.avatar}</div>
                    <p className="text-lg text-gray-800 italic font-serif font-bold">"{player.nickname}"</p>
                    <div className="mt-auto w-full border-t-2 border-black pt-2">
                      <p className="text-black font-black uppercase text-sm">Rent (Wins): {player.wins}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <CommentsSection />
      </div>
    </main>
  );
}