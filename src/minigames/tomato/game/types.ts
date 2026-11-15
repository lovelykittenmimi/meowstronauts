export interface TomatoDef {
  id: string;
  /** Position as a percentage of the 16:9 harvest stage. */
  x: number;
  y: number;
  /** Width as a percentage of the stage width. */
  size: number;
  ripe: boolean;
  rotation: number;
}
