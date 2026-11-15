import type { TomatoDef } from './types';

/**
 * Six ripe tomatoes and three green ones, hanging on the central tomato vine
 * in the greenhouse. The numbers are percentages of the 16:9 game stage.
 */
export const TOMATOES: TomatoDef[] = [
  {
    id: 'vine-1',
    x: 32,
    y: 24,
    size: 4.8,
    ripe: true,
    rotation: 5,
  },
  {
    id: 'vine-2',
    x: 43,
    y: 18,
    size: 4.2,
    ripe: false,
    rotation: -6,
  },
  {
    id: 'vine-3',
    x: 55,
    y: 27,
    size: 4.9,
    ripe: true,
    rotation: -4,
  },
  {
    id: 'vine-4',
    x: 38,
    y: 40,
    size: 4.5,
    ripe: true,
    rotation: 3,
  },
  {
    id: 'vine-5',
    x: 50,
    y: 43,
    size: 4.3,
    ripe: false,
    rotation: 6,
  },
  {
    id: 'vine-6',
    x: 63,
    y: 38,
    size: 4.7,
    ripe: true,
    rotation: -5,
  },
  {
    id: 'vine-7',
    x: 34,
    y: 56,
    size: 4.6,
    ripe: true,
    rotation: 4,
  },
  {
    id: 'vine-8',
    x: 46,
    y: 60,
    size: 4.1,
    ripe: false,
    rotation: -3,
  },
  {
    id: 'vine-9',
    x: 58,
    y: 55,
    size: 4.8,
    ripe: true,
    rotation: 2,
  },
];

export const RIPE_COUNT = TOMATOES.filter((tomato) => tomato.ripe).length;
export const GREEN_COUNT = TOMATOES.length - RIPE_COUNT;
