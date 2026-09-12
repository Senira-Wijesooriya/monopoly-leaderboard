import redis from '@/lib/redis';
import Link from 'next/link';

export default async function PlayerPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const data = await redis.hgetall(`player:${name}`) as Record<string, string>;
  const wins = parseInt(data?.wins || '0');
  const nickname = data?.nickname || 'The Tycoon';
  const avatar = data?.avatar || '🎩';
  
  const history = await redis.lrange(`history:${name}`, 0, -1) as string[];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 text-[20rem] animate-float opacity-20">💰</div>
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="text-green-400 hover:text-green-300 font-black mb-8 inline-block uppercase tracking-widest transition-colors">
          &larr; Back to Board
        </Link>
        
        <div className="bg-[#D8E8D8] border-8 border-black rounded-sm p-10 mb-12 shadow-[15px_15px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-6 bg-blue-600 border-b-4 border-black"></div>
          <div className="text-8xl mb-4 mt-6 drop-shadow-xl">{avatar}</div>
          <h1 className="text-6xl font-black uppercase text-black tracking-tighter">{name}</h1>
          <p className="text-3xl text-gray-700 italic mt-2 font-serif font-bold mb-6">"{nickname}"</p>
          <div className="inline-block bg-black text-green-400 text-3xl font-black px-8 py-3 rounded uppercase border-4 border-green-600">
            {wins} Total Properties
          </div>
        </div>

        <h2 className="text-3xl font-black mb-6 border-b-4 border-green-600/30 pb-4 uppercase tracking-widest text-green-400">Transaction History</h2>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-500 italic font-serif text-xl">No properties acquired yet. Do not pass GO.</p>
          ) : (
            history.map((date, i) => (
              <div key={i} className="p-6 bg-gray-900 border-l-4 border-green-500 rounded-r-lg flex items-center justify-between transform transition-transform hover:scale-[1.02] hover:bg-gray-800 shadow-lg">
                <span className="text-yellow-400 font-black text-xl uppercase tracking-widest">Victory #{history.length - i}</span>
                <span className="text-gray-300 font-mono">{new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}