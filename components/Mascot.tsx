export default function Mascot() {
  return (
    <div className="relative w-40 h-40 animate-[float_4s_ease-in-out_infinite] z-20 drop-shadow-2xl">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Devil Horns */}
        <path d="M50 80 Q40 30 70 40 Q65 60 75 75 Z" fill="#dc2626" />
        <path d="M150 80 Q160 30 130 40 Q135 60 125 75 Z" fill="#dc2626" />
        
        {/* Head */}
        <circle cx="100" cy="90" r="45" fill="#ef4444" />
        
        {/* Eyes (Mischievous) */}
        <path d="M75 80 Q85 70 95 85" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M125 80 Q115 70 105 85" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="85" cy="85" r="4" fill="#000" />
        <circle cx="115" cy="85" r="4" fill="#000" />
        
        {/* Smirk */}
        <path d="M85 110 Q100 125 120 105" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M115 105 L120 115 L125 105 Z" fill="#fff" /> {/* Little fang */}
        
        {/* MIT Shirt (Body) */}
        <path d="M60 130 Q100 120 140 130 L150 190 Q100 210 50 190 Z" fill="#111827" />
        
        {/* MIT Text on Shirt */}
        <text x="100" y="170" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="#facc15" textAnchor="middle" letterSpacing="2">MIT</text>
        
        {/* Pitchfork */}
        <path d="M160 190 L180 90 M165 90 L180 90 L195 90 M165 90 L165 70 M180 90 L180 60 M195 90 L195 70" stroke="#4b5563" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}