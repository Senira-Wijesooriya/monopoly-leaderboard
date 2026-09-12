import redis from '@/lib/redis';
import Link from 'next/link';

// Massive Randomized Caption Library
const CAPTIONS = [
  // Wealth & Business
  "Today's profit is tomorrow's yacht.",
  "Buy the rumor, sell the yacht.",
  "Diversifying my portfolio by buying two different colored Ferraris.",
  "I don't play the market, the market plays my game.",
  "My financial strategy is mostly confidence.",
  "A million dollars isn't cool. You know what's cool? This leaderboard.",
  "Just acquired my competitor just to fire their CEO.",
  "Real estate is just Monopoly in 4K.",
  "Bulls make money, bears make money, I make monopolies.",
  // Saving & Advice
  "Saving money is easy. Not spending it is the hard part.",
  "Spend like a billionaire, save like you still have rent.",
  "I put my money where my mouth is... mostly on expensive food.",
  "A penny saved is a penny I didn't use to crush my enemies.",
  "Budgeting is just telling your money where to go instead of wondering where it went.",
  // Billionaire Humor
  "I have enough money to live comfortably for the rest of my life... if I die next Tuesday.",
  "Just bought a bank so I don't have to wait in line.",
  "Inflation just means I need to make more millions.",
  "I don't need a receipt, I need an offshore account.",
  "My favorite color is gold. Second favorite is platinum.",
  "I asked my accountant how much money I have. He just cried.",
  // Comedy / Random
  "Started with $10. Emotionally I'm already a billionaire.",
  "One more win and I'm buying the island.",
  "CEO of Bad Decisions, but somehow it's working.",
  "My wallet is like an onion. Opening it makes me cry.",
  "I'm not saying I'm Batman, but have you ever seen me and Bruce Wayne in the same room?",
  "Financial status: Waiting for a rich relative I didn't know I had.",
  "My net worth is mostly emotional support.",
  "I consider buying coffee as a business expense."
];

// Determine Background Gradient based on Country
function getCountryGradient(country: string) {
  if (country.includes("Brazil")) return "from-green-400/30 via-[#cfe0e0] to-yellow-400/30";
  if (country.includes("Israel")) return "from-blue-600/30 via-[#cfe0e0] to-white/50";
  if (country.includes("Italy")) return "from-green-600/20 via-white/40 to-red-600/20";
  if (country.includes("Germany")) return "from-gray-800/20 via-red-600/20 to-yellow-500/20";
  if (country.includes("China")) return "from-red-600/30 via-[#cfe0e0] to-yellow-500/20";
  if (country.includes("France")) return "from-blue-600/20 via-white/40 to-red-600/20";
  if (country.includes("UK")) return "from-blue-800/20 via-red-600/20 to-[#cfe0e0]";
  if (country.includes("USA")) return "from-red-600/20 via-[#cfe0e0] to-blue-600/20";
  return "from-gray-400/20 via-[#cfe0e0] to-gray-400/20"; // Government / Default
}

export default async function PlayerPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const data = await redis.hgetall(`player:${name}`) as Record<string, string>;
  const wins = parseInt(data?.wins || '0');
  const nickname = data?.nickname || 'The Tycoon';
  const avatar = data?.avatar || '🎩';
  const country = data?.country || '🏛️ Government';
  
  const history = await redis.lrange(`history:${name}`, 0, -1) as string[];
  
  // Select a random caption strictly on render
  const randomCaption = CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];
  const backgroundGradient = getCountryGradient(country);

  return (
    <main className={`min-h-screen bg-gradient-to-br ${backgroundGradient} text-black p-8 relative overflow-hidden font-sans`}>
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none px-6 py-2 text-black font-black mb-8 inline-block uppercase tracking-widest transition-all">
          &larr; Back to Board
        </Link>
        
        <div className="bg-white/90 backdrop-blur-sm border-4 border-black rounded-sm p-10 mb-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
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

        {/* RANDOM CAPTION BUBBLE */}
        <div className="bg-blue-100 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 mb-12 relative rounded-xl rounded-tl-none">
          <div className="absolute -top-4 -left-1 text-4xl">💬</div>
          <p className="text-2xl font-black font-serif italic text-gray-800 text-center px-4">
            "{randomCaption}"
          </p>
        </div>

        {/* MATCH HISTORY */}
        <h2 className="text-3xl font-black mb-6 border-b-4 border-black pb-4 uppercase tracking-tighter text-black flex items-center gap-3">
          <span className="bg-black text-white px-3 py-1 rounded shadow-[2px_2px_0px_rgba(255,255,255,1)]">⚔️</span> Match History
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