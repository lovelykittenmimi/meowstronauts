import type { TomatoDef } from './types';

/**
 * Six ripe tomatoes and three green ones, hanging on the central tomato vine
 * in the greenhouse. The numbers are percentages of the 16:9 game stage.
 */
export const TOMATOES: TomatoDef[] = [
  {
    id: 'vine-1',
    x: 40,
    y: 36,
    size: 4.8,
    ripe: true,
    rotation: 5,
  },
  {
    id: 'vine-2',
    x: 52,
    y: 30,
    size: 4.2,
    ripe: false,
    rotation: -6,
  },
  {
    id: 'vine-3',
    x: 64,
    y: 40,
    size: 4.9,
    ripe: true,
    rotation: -4,
  },
  {
    id: 'vine-4',
    x: 46,
    y: 52,
    size: 4.5,
    ripe: true,
    rotation: 3,
  },
  {
    id: 'vine-5',
    x: 59,
    y: 55,
    size: 4.3,
    ripe: false,
    rotation: 6,
  },
  {
    id: 'vine-6',
    x: 72,
    y: 49,
    size: 4.7,
    ripe: true,
    rotation: -5,
  },
  {
    id: 'vine-7',
    x: 42,
    y: 68,
    size: 4.6,
    ripe: true,
    rotation: 4,
  },
  {
    id: 'vine-8',
    x: 55,
    y: 72,
    size: 4.1,
    ripe: false,
    rotation: -3,
  },
  {
    id: 'vine-9',
    x: 68,
    y: 66,
    size: 4.8,
    ripe: true,
    rotation: 2,
  },
];

export const RIPE_COUNT = TOMATOES.filter((tomato) => tomato.ripe).length;
export const GREEN_COUNT = TOMATOES.length - RIPE_COUNT;
