export default function Mascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 270"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Team mascot"
    >
      {/* arms */}
      <ellipse
        cx="46"
        cy="192"
        rx="18"
        ry="44"
        fill="#C6362E"
        stroke="#221C10"
        strokeWidth="5"
        transform="rotate(-16 46 192)"
      />
      <circle cx="35" cy="228" r="14" fill="#C6362E" stroke="#221C10" strokeWidth="5" />

      <ellipse
        cx="174"
        cy="192"
        rx="18"
        ry="44"
        fill="#C6362E"
        stroke="#221C10"
        strokeWidth="5"
        transform="rotate(16 174 192)"
      />
      <circle cx="185" cy="228" r="14" fill="#C6362E" stroke="#221C10" strokeWidth="5" />

      {/* torso */}
      <path
        d="M52,162 Q52,142 72,142 L148,142 Q168,142 168,162 L168,236 Q168,252 148,252 L72,252 Q52,252 52,236 Z"
        fill="#C6362E"
        stroke="#221C10"
        strokeWidth="5"
      />

      {/* shirt */}
      <path
        d="M66,152 Q110,172 154,152 L159,246 Q110,257 61,246 Z"
        fill="#F6ECD2"
        stroke="#221C10"
        strokeWidth="4"
      />
      <text
        x="110"
        y="214"
        textAnchor="middle"
        fontFamily="Bevan, serif"
        fontSize="42"
        fill="#E31B23"
        letterSpacing="2"
      >
        MIT
      </text>

      {/* tail — drawn on top so it reads clearly against the body/arm */}
      <path
        d="M150,238 Q185,255 178,215 Q176,203 190,208 Q180,190 160,212 Q152,224 150,238 Z"
        fill="#C6362E"
        stroke="#221C10"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* horns (drawn before the head so the head covers their base) */}
      <polygon points="72,46 54,10 87,42" fill="#221C10" />
      <polygon points="148,46 166,10 133,42" fill="#221C10" />

      {/* head */}
      <circle cx="110" cy="95" r="68" fill="#C6362E" stroke="#221C10" strokeWidth="5" />

      {/* face */}
      <path d="M72,73 L97,66" stroke="#221C10" strokeWidth="6" strokeLinecap="round" />
      <path d="M148,73 L123,66" stroke="#221C10" strokeWidth="6" strokeLinecap="round" />

      <circle cx="87" cy="91" r="8" fill="#221C10" />
      <circle cx="90" cy="88" r="2.5" fill="#F6ECD2" />
      <circle cx="133" cy="91" r="8" fill="#221C10" />
      <circle cx="136" cy="88" r="2.5" fill="#F6ECD2" />

      <circle cx="110" cy="105" r="3" fill="#221C10" />

      <path
        d="M100,127 Q110,133 120,127"
        stroke="#221C10"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* mustache */}
      <path
        d="M75,123 C85,109 100,119 110,121 C120,119 135,109 145,123 C133,117 122,127 110,121 C98,127 87,117 75,123 Z"
        fill="#221C10"
      />

      {/* goatee */}
      <path d="M100,129 L120,129 L110,156 Z" fill="#221C10" />
    </svg>
  );
}
