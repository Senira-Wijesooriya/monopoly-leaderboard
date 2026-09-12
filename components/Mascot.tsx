export default function Mascot() {
  return (
    <div className="relative w-48 h-48 animate-[float_4s_ease-in-out_infinite] z-20 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          {/* 3D Skin Gradient */}
          <radialGradient id="skin" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="70%" stopColor="#990000" />
            <stop offset="100%" stopColor="#4d0000" />
          </radialGradient>
          {/* 3D Gold Gradient for Crown & Chain */}
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3cd" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="75%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          {/* 3D Suit Gradient */}
          <linearGradient id="suit" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
        </defs>

        {/* Demon Horns */}
        <path d="M40 70 Q20 30 50 15 Q55 45 65 60 Z" fill="url(#gold)" stroke="#78350f" strokeWidth="2"/>
        <path d="M160 70 Q180 30 150 15 Q145 45 135 60 Z" fill="url(#gold)" stroke="#78350f" strokeWidth="2"/>

        {/* Head */}
        <circle cx="100" cy="85" r="50" fill="url(#skin)" />
        <path d="M50 85 Q100 150 150 85 Z" fill="url(#skin)" /> {/* Jaw */}

        {/* Royal Crown */}
        <path d="M45 40 L60 10 L80 30 L100 0 L120 30 L140 10 L155 40 Z" fill="url(#gold)" stroke="#000" strokeWidth="2"/>
        <path d="M45 40 L155 40 L145 55 L55 55 Z" fill="url(#gold)" stroke="#000" strokeWidth="2"/>
        {/* Crown Jewels */}
        <circle cx="100" cy="15" r="4" fill="#ef4444" stroke="#000"/>
        <circle cx="65" cy="25" r="3" fill="#3b82f6" stroke="#000"/>
        <circle cx="135" cy="25" r="3" fill="#3b82f6" stroke="#000"/>
        <circle cx="100" cy="47" r="4" fill="#22c55e" stroke="#000"/>

        {/* Confident / Intimidating Face */}
        <path d="M70 70 Q85 60 95 75" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M130 70 Q115 60 105 75" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Glowing Eyes */}
        <circle cx="82" cy="80" r="5" fill="#facc15" />
        <circle cx="118" cy="80" r="5" fill="#facc15" />
        <circle cx="82" cy="80" r="2" fill="#fff" />
        <circle cx="118" cy="80" r="2" fill="#fff" />
        
        {/* Mischievous Smirk */}
        <path d="M75 110 Q100 125 125 100" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M115 103 L120 115 L125 100 Z" fill="#fff" /> {/* Sharp fang */}

        {/* Tycoon Suit & Shirt */}
        <path d="M45 130 Q100 110 155 130 L170 200 Q100 210 30 200 Z" fill="url(#suit)" stroke="#000" strokeWidth="3"/>
        {/* Dress Shirt */}
        <path d="M75 122 L100 150 L125 122 L100 200 Z" fill="#f3f4f6" stroke="#000" strokeWidth="2"/>
        
        {/* MIT text on shirt */}
        <text x="100" y="165" fontFamily="sans-serif" fontSize="24" fontWeight="900" fill="#dc2626" textAnchor="middle" transform="scale(1, 1.2)">MIT</text>

        {/* Gold Chain */}
        <path d="M60 135 Q100 160 140 135" stroke="url(#gold)" strokeWidth="6" fill="none" strokeDasharray="8 4" strokeLinecap="round"/>

        {/* Holding Stack of Cash */}
        <rect x="20" y="140" width="45" height="25" rx="2" fill="#22c55e" stroke="#000" strokeWidth="2" transform="rotate(-15 40 150)"/>
        <rect x="25" y="135" width="45" height="25" rx="2" fill="#4ade80" stroke="#000" strokeWidth="2" transform="rotate(-15 40 150)"/>
        <text x="35" y="165" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#064e3b" transform="rotate(-15 40 150)">$$$</text>
      </svg>
    </div>
  );
}