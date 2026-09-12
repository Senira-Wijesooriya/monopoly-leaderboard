import redis from '@/lib/redis';
import Link from 'next/link';

export default async function PlayerPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const data = await redis.hgetall(`player:${name}`) as Record<string, string>;
  const wins = parseInt(data?.wins || '0');
  const nickname = data?.nickname || 'The Tycoon';
  const avatar = data?.avatar || '🎩';
  const country = data?.country || '🌍 Global';
  
  const history = await redis.lrange(`history:${name}`, 0, -1) as string[];

  return (
    <main className="min-h-screen bg-[#cfe0e0] text-black p-8 relative overflow-hidden font-sans">
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none px-6 py-2 text-black font-black mb-8 inline-block uppercase tracking-widest transition-all">
          &larr; Back to Board
        </Link>
        
        <div className="bg-white border-4 border-black rounded-sm p-10 mb-12 shadow-[12px_12px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-red-600 border-b-4 border-black flex items-center justify-center">
             <span className="text-white font-black text-xs uppercase tracking-[0.3em]">TITLE DEED</span>
          </div>
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-black overflow-hidden flex items-center justify-center text-6xl bg-gray-100 mb-6 mt-6">
             {avatar.startsWith('data:image') ? <img src={avatar} alt={name} className="w-full h-full object-cover"/> : avatar}
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase text-black tracking-tighter">{name}</h1>
          <p className="text-2xl text-gray-700 italic mt-2 font-serif font-bold mb-2">"{nickname}"</p>
          <div className="inline-block bg-yellow-400 border-2 border-black font-black px-4 py-1 uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6">
            Primary Market: {country}
          </div>
          <br/>
          <div className="inline-block bg-green-500 text-black text-3xl font-black px-8 py-3 uppercase border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            {wins} Total Properties
          </div>
        </div>

        <h2 className="text-3xl font-black mb-6 border-b-4 border-black pb-4 uppercase tracking-tighter text-black flex items-center gap-3">
          <span className="bg-black text-white px-3 py-1 rounded shadow-[2px_2px_0px_rgba(255,255,255,1)]">🏛️</span> Transaction History
        </h2>
        
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white p-6 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-gray-500 font-bold text-xl uppercase text-center">No properties acquired yet. Do not pass GO.</p>
            </div>
          ) : (
            history.map((date, i) => {
              const d = new Date(date);
              return (
                <div key={i} className="p-6 bg-yellow-100 border-4 border-black flex flex-col md:flex-row items-center justify-between transform transition-transform hover:-translate-y-1 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  <span className="text-black font-black text-2xl uppercase tracking-tighter">Victory #{history.length - i}</span>
                  <div className="text-right">
                    <div className="text-gray-900 font-bold text-lg">{d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-gray-600 font-black font-mono">{d.toLocaleTimeString()}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  );
}