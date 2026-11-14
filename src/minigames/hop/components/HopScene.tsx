import type { Lang } from '../../../game/types';
import { hopT } from '../game/i18n';
import {
  FINISH_X,
  TERRAIN,
  VIEW_H,
  VIEW_W,
  WORLD_W,
  groundY,
} from '../game/physics';
import type { HopDevil, HopPlayer, HopSample } from '../game/types';

interface HopSceneProps {
  player: HopPlayer;
  samples: HopSample[];
  devils: HopDevil[];
  cameraX: number;
  lang: Lang;
}

const TERRAIN_LINE = TERRAIN.map(
  (point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`,
).join(' ');

const TERRAIN_FILL = `${TERRAIN_LINE} L${WORLD_W} ${VIEW_H} L0 ${VIEW_H} Z`;

const STARS: ReadonlyArray<[number, number, number]> = [
  [40, 48, 1.4], [96, 96, 1], [150, 40, 1.8], [212, 120, 1],
  [268, 62, 1.2], [330, 30, 1], [382, 104, 1.5], [436, 52, 1],
  [492, 132, 1.2], [548, 36, 1.6], [602, 88, 1], [660, 128, 1.3],
  [714, 58, 1], [768, 150, 1.1], [824, 42, 1.5], [878, 100, 1],
  [922, 68, 1.2], [130, 168, 1], [286, 156, 1.1], [470, 176, 1],
  [640, 170, 1.2], [800, 186, 1], [900, 160, 1.3], [58, 140, 1],
];

const ROCKS: ReadonlyArray<{ x: number; scale: number; tone: string }> = [
  { x: 168, scale: 0.7, tone: '#4a2c28' },
  { x: 632, scale: 0.55, tone: '#5a342c' },
  { x: 760, scale: 0.8, tone: '#452823' },
  { x: 1064, scale: 0.6, tone: '#57332b' },
  { x: 1302, scale: 0.75, tone: '#412624' },
  { x: 1756, scale: 0.9, tone: '#4b2b26' },
  { x: 2144, scale: 0.6, tone: '#59352c' },
  { x: 2382, scale: 0.85, tone: '#432722' },
  { x: 2658, scale: 0.65, tone: '#50302a' },
];

function Rock({ x, scale, tone }: { x: number; scale: number; tone: string }) {
  const base = groundY(x);
  return (
    <g transform={`translate(${x} ${base}) scale(${scale})`}>
      <polygon
        points="-20,0 -14,-18 -2,-27 12,-20 20,0"
        fill={tone}
        stroke="#2b1a1c"
        strokeWidth={2}
      />
      <polygon points="-14,-18 -2,-27 2,-16 -8,-10" fill="#6d4133" opacity={0.7} />
    </g>
  );
}

function SampleCluster({ sample }: { sample: HopSample }) {
  if (sample.taken) return null;
  const { x, y } = sample;
  return (
    <g className="hop-sample" data-testid={`hop-sample-${sample.id}`}>
      <circle cx={x} cy={y} r={30} fill="url(#hop-sample-glow)" />
      <polygon
        points={`${x - 20},${y + 12} ${x - 10},${y - 16} ${x - 2},${y + 12}`}
        fill="#b8452f"
        stroke="#f2a07f"
        strokeWidth={2}
      />
      <polygon
        points={`${x - 4},${y + 12} ${x + 4},${y - 22} ${x + 12},${y + 12}`}
        fill="#d4573f"
        stroke="#ffc3a6"
        strokeWidth={2}
      />
      <polygon
        points={`${x + 6},${y + 12} ${x + 15},${y - 8} ${x + 22},${y + 12}`}
        fill="#9c3a2a"
        stroke="#e88f72"
        strokeWidth={2}
      />
      <circle cx={x + 4} cy={y - 10} r={3} fill="#ffe9d2" />
    </g>
  );
}

function SampleSpire({ sample }: { sample: HopSample }) {
  const base = groundY(sample.x);
  return (
    <g opacity={sample.taken ? 0.35 : 0.9}>
      <path
        d={`M${sample.x - 12} ${base} L${sample.x - 3} ${sample.y + 14} L${sample.x + 5} ${sample.y + 18} L${sample.x + 13} ${base} Z`}
        fill="#3d282b"
        stroke="#2a1a1d"
        strokeWidth={2}
      />
      <path
        d={`M${sample.x - 3} ${sample.y + 14} L${sample.x + 2} ${base}`}
        stroke="#6b4436"
        strokeWidth={2}
        opacity={0.6}
      />
    </g>
  );
}

function DustDevil({ devil }: { devil: HopDevil }) {
  const { x, y } = devil;
  const ground = groundY(x);
  return (
    <g className="hop-devil" data-testid={`hop-devil-${devil.id}`}>
      <path
        d={`M${x - 30} ${y - 52} C${x - 20} ${y - 16} ${x - 12} ${y + 20} ${x - 10} ${ground} L${x + 10} ${ground} C${x + 14} ${y + 18} ${x + 22} ${y - 14} ${x + 30} ${y - 52} Z`}
        fill="url(#hop-devil-fill)"
        opacity={0.72}
      />
      <ellipse cx={x} cy={y - 52} rx={30} ry={10} fill="#d8a16f" opacity={0.55} />
      <ellipse cx={x} cy={ground - 4} rx={20} ry={7} fill="#c28a5c" opacity={0.45} />
      <circle cx={x - 16} cy={y - 20} r={3.2} fill="#f5d3ac" opacity={0.7} />
      <circle cx={x + 13} cy={y + 6} r={2.4} fill="#f5d3ac" opacity={0.6} />
      <circle cx={x - 5} cy={y - 40} r={2} fill="#f5d3ac" opacity={0.65} />
    </g>
  );
}

function Airlock({ lang }: { lang: Lang }) {
  // Stop the cat just short of the door so the airlock stays readable.
  const x = FINISH_X + 40;
  const base = groundY(x);
  return (
    <g data-testid="hop-airlock">
      <ellipse cx={x} cy={base + 2} rx={84} ry={9} fill="#1c1116" opacity={0.35} />
      <rect x={x - 46} y={base - 16} width={92} height={16} rx={6} fill="#39435c" />
      <path
        d={`M${x - 50} ${base - 16} A50 72 0 0 1 ${x + 50} ${base - 16} Z`}
        fill="#cfd8e2"
        stroke="#1b2a5b"
        strokeWidth={4}
      />
      <path
        d={`M${x - 50} ${base - 16} A50 72 0 0 1 ${x + 50} ${base - 16}`}
        fill="none"
        stroke="#8fa1b5"
        strokeWidth={2}
        opacity={0.7}
      />
      <rect
        x={x - 17}
        y={base - 58}
        width={34}
        height={58}
        rx={10}
        fill="#1b2a5b"
        stroke="#0e1738"
        strokeWidth={3}
      />
      <circle cx={x} cy={base - 38} r={8} fill="#4e8c8a" stroke="#244a49" strokeWidth={2} />
      <line x1={x} y1={base - 88} x2={x} y2={base - 130} stroke="#8fa1b5" strokeWidth={3} />
      <rect x={x - 50} y={base - 160} width={100} height={30} rx={7} fill="#1b2a5b" />
      <text
        x={x}
        y={base - 139}
        textAnchor="middle"
        fill="#f7f3ea"
        fontSize={16}
        fontWeight={700}
        letterSpacing={1}
      >
        {hopT(lang, 'baseName')}
      </text>
      <circle className="hop-beacon" cx={x} cy={base - 168} r={5} fill="#e8a33d" />
      <text
        x={x}
        y={base + 24}
        textAnchor="middle"
        fill="#f7f3ea"
        fontSize={13}
        opacity={0.75}
      >
        {hopT(lang, 'finishLabel')}
      </text>
    </g>
  );
}

function HopCat({ player, moving }: { player: HopPlayer; moving: boolean }) {
  const { x, y, facing, grounded } = player;
  return (
    <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
      <g className={moving && grounded ? 'hop-cat hop-cat-walking' : 'hop-cat'}>
        <path
          className="hop-cat-tail"
          d="M-16 -30 C-30 -34 -34 -48 -26 -58"
          fill="none"
          stroke="#c9d2dc"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <path
          d="M-26 -58 C-24 -62 -20 -62 -19 -57"
          fill="none"
          stroke="#e8a33d"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <rect x={-20} y={-50} width={16} height={28} rx={6} fill="#8fa1b5" stroke="#1b2a5b" strokeWidth={2} />
        <rect x={-11} y={-20} width={9} height={20} rx={4} fill="#dfe6ee" stroke="#1b2a5b" strokeWidth={2} />
        <rect x={2} y={-20} width={9} height={20} rx={4} fill="#dfe6ee" stroke="#1b2a5b" strokeWidth={2} />
        <ellipse cx={-9} cy={-1} rx={7} ry={4} fill="#e8a33d" />
        <ellipse cx={5} cy={-1} rx={7} ry={4} fill="#e8a33d" />
        <ellipse cx={-1} cy={-32} rx={19} ry={21} fill="#e9eef4" stroke="#1b2a5b" strokeWidth={3} />
        <circle cx={-2} cy={-33} r={5} fill="#4e8c8a" />
        <path d="M-4 -35 L-2 -31 L0 -35" fill="none" stroke="#f7f3ea" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={5} cy={-60} r={18} fill="#dfe8f2" stroke="#1b2a5b" strokeWidth={3} />
        <polygon points="-8,-74 0,-88 6,-72" fill="#dfe8f2" stroke="#1b2a5b" strokeWidth={2.5} />
        <polygon points="0,-86 4,-78 -1,-75" fill="#e8a33d" />
        <polygon points="6,-73 15,-84 17,-66" fill="#dfe8f2" stroke="#1b2a5b" strokeWidth={2.5} />
        <polygon points="8,-72 13,-78 13,-69" fill="#e8a33d" />
        <ellipse cx={7} cy={-60} rx={13} ry={12} fill="#22305f" />
        <circle cx={4} cy={-62} r={3} fill="#ffe6a8" />
        <circle cx={13} cy={-61} r={3} fill="#ffe6a8" />
        <circle cx={4} cy={-62} r={1.2} fill="#1b2a5b" />
        <circle cx={13} cy={-61} r={1.2} fill="#1b2a5b" />
        <path d="M7 -54 Q10 -52 13 -54" fill="none" stroke="#ffe6a8" strokeWidth={1.4} strokeLinecap="round" />
        <ellipse cx={-12} cy={-64} rx={4} ry={3} fill="#b9c6d4" opacity={0.85} />
      </g>
    </g>
  );
}

export default function HopScene({ player, samples, devils, cameraX, lang }: HopSceneProps) {
  const moving = Math.abs(player.vx) > 20;
  return (
    <svg
      className="hop-world"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={hopT(lang, 'heroLabel')}
      data-testid="hop-game-world"
    >
      <defs>
        <linearGradient id="hop-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141129" />
          <stop offset="52%" stopColor="#3a2746" />
          <stop offset="82%" stopColor="#8a4b44" />
          <stop offset="100%" stopColor="#c07a4f" />
        </linearGradient>
        <linearGradient id="hop-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f4e37" />
          <stop offset="30%" stopColor="#5d3529" />
          <stop offset="100%" stopColor="#241619" />
        </linearGradient>
        <radialGradient id="hop-sun">
          <stop offset="0%" stopColor="#ffe9c4" />
          <stop offset="55%" stopColor="#f1c58c" />
          <stop offset="100%" stopColor="#f1c58c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hop-sample-glow">
          <stop offset="0%" stopColor="#ffb38f" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb38f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hop-devil-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2b183" />
          <stop offset="100%" stopColor="#a76b46" />
        </linearGradient>
        <linearGradient id="hop-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d08a5c" stopOpacity="0" />
          <stop offset="100%" stopColor="#d08a5c" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill="url(#hop-sky)" />

      <g className="hop-stars" transform={`translate(${-cameraX * 0.04} 0)`}>
        {STARS.map(([x, y, r], index) => (
          <circle
            key={`${x}-${y}`}
            className="hop-star"
            style={{ animationDelay: `${(index % 5) * 0.7}s` }}
            cx={x}
            cy={y}
            r={r}
            fill="#f7f3ea"
          />
        ))}
      </g>

      <circle cx={782} cy={112} r={86} fill="url(#hop-sun)" opacity={0.55} />
      <circle cx={782} cy={112} r={34} fill="#f8dfb6" opacity={0.9} />

      <g transform={`translate(${-cameraX * 0.18} 0)`}>
        <path
          d="M0 372 L110 300 L206 338 L318 258 L430 330 L548 276 L672 340 L796 286 L922 346 L1060 282 L1188 344 L1310 300 L1450 352 L1600 300 L1740 350 L1900 296 L2040 348 L2200 302 L2360 350 L2500 306 L2660 352 L2820 304 L2980 350 L3140 292 L3300 356 L3300 540 L0 540 Z"
          fill="#5c3040"
          opacity={0.55}
        />
      </g>
      <g transform={`translate(${-cameraX * 0.38} 0)`}>
        <path
          d="M0 400 L120 360 L240 392 L360 344 L500 396 L640 352 L780 398 L920 356 L1060 400 L1200 350 L1340 398 L1480 358 L1620 402 L1780 354 L1940 400 L2100 358 L2260 402 L2420 356 L2580 400 L2740 352 L2900 398 L3060 354 L3220 400 L3220 540 L0 540 Z"
          fill="#45283a"
          opacity={0.8}
        />
      </g>

      <rect y={330} width={VIEW_W} height={210} fill="url(#hop-haze)" />

      <g transform={`translate(${-cameraX} 0)`}>
        <path d={TERRAIN_FILL} fill="url(#hop-ground)" />
        <path d={TERRAIN_LINE} fill="none" stroke="#d08a5c" strokeWidth={3.5} />
        <path d={TERRAIN_LINE} fill="none" stroke="#f2c39b" strokeWidth={1} opacity={0.5} />

        <ellipse cx={400} cy={482} rx={62} ry={7} fill="#1b1114" opacity={0.28} />
        <ellipse cx={1465} cy={482} rx={90} ry={8} fill="#1b1114" opacity={0.3} />
        <ellipse cx={2095} cy={466} rx={72} ry={7} fill="#1b1114" opacity={0.28} />

        {ROCKS.map((rock) => (
          <Rock key={rock.x} {...rock} />
        ))}

        {samples.map((sample) => (
          <SampleSpire key={`spire-${sample.id}`} sample={sample} />
        ))}
        {samples.map((sample) => (
          <SampleCluster key={`sample-${sample.id}`} sample={sample} />
        ))}

        {devils.map((devil) => (
          <DustDevil key={devil.id} devil={devil} />
        ))}

        <Airlock lang={lang} />

        {player.grounded ? (
          <ellipse cx={player.x} cy={player.y + 2} rx={22} ry={5} fill="#140d10" opacity={0.35} />
        ) : null}
        <HopCat player={player} moving={moving} />
      </g>
    </svg>
  );
}
