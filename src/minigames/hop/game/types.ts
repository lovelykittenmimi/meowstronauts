export interface HopInput {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface HopPlayer {
  /** Horizontal center, world pixels. */
  x: number;
  /** Feet height, world pixels. The ground surface is `y`. */
  y: number;
  vx: number;
  vy: number;
  grounded: boolean;
  facing: 1 | -1;
}

export interface HopSample {
  id: number;
  x: number;
  y: number;
  taken: boolean;
}

export interface HopDevilPatrol {
  minX: number;
  maxX: number;
  /** Radians per second for the back-and-forth sweep. */
  speed: number;
  phase: number;
}

export interface HopDevil extends HopDevilPatrol {
  id: number;
  x: number;
  y: number;
  /** World time (seconds) before this devil can shove the player again. */
  cooldownUntil: number;
}

export type HopEvent =
  | { type: 'sample'; id: number; collected: number; total: number }
  | { type: 'devil'; id: number; hits: number }
  | { type: 'finish'; samples: number; hits: number };

export interface HopWorld {
  elapsed: number;
  player: HopPlayer;
  samples: HopSample[];
  devils: HopDevil[];
  collected: number;
  hits: number;
  finished: boolean;
  /** Jump edge detection so holding Space does not auto-bounce. */
  prevJump: boolean;
  /** Events produced by the last step; the component drains these. */
  events: HopEvent[];
}
