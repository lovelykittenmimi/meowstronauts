interface ShipProps {
  thrusting?: boolean;
  size?: number;
}

export default function Ship({ thrusting = false, size = 52 }: ShipProps) {
  return (
    <svg
      className="ship-svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Mars lander"
    >
      <defs>
        <linearGradient id="shipBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.62" stopColor="#f3ead9" />
          <stop offset="1" stopColor="#d9cbb6" />
        </linearGradient>
        <linearGradient id="shipNavy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b4380" />
          <stop offset="1" stopColor="#131f46" />
        </linearGradient>
      </defs>

      {thrusting && (
        <g className="ship-flame">
          <path d="M27 50 L32 64 L37 50 Z" fill="#e8a33d" opacity="0.95" />
          <path d="M29.5 50 L32 58 L34.5 50 Z" fill="#fff3c4" />
        </g>
      )}

      {/* Cat-ear fins, a small nod to the Meowstronauts crew. */}
      <path d="M21 15 L24 4 L31 13 Z" fill="#4e8c8a" stroke="#1b2a5b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M43 15 L40 4 L33 13 Z" fill="#4e8c8a" stroke="#1b2a5b" strokeWidth="2" strokeLinejoin="round" />

      <path
        d="M14 36 L8 46 L17 51 L23 44 Z"
        fill="#e8a33d"
        stroke="#1b2a5b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M50 36 L56 46 L47 51 L41 44 Z"
        fill="#e8a33d"
        stroke="#1b2a5b"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M32 8 C41 8 47 18 47 31 C47 43 42 52 32 52 C22 52 17 43 17 31 C17 18 23 8 32 8 Z"
        fill="url(#shipBody)"
        stroke="#1b2a5b"
        strokeWidth="3"
      />
      <path d="M19 34 C25 38 39 38 45 34" fill="none" stroke="#4e8c8a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="26" r="8" fill="url(#shipNavy)" stroke="#e8a33d" strokeWidth="2.5" />
      <circle cx="29" cy="23.5" r="2.1" fill="#d9f6f1" opacity="0.85" />
      <path d="M27 43 L37 43" stroke="#b85c38" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
