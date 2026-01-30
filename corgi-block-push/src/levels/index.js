// src/levels/index.js

// IMPORTANT:
// Levels are PURE DATA.
// No hooks, no state, no event logic.
// This keeps the game stable and future-proof.

const WALL = () => [{ type: "WALL", properties: ["WALL"] }];
const BLOCK = () => [{ type: "BLOCK", properties: ["PUSH"] }];
const CORGI = () => [{ type: "CORGI", properties: ["YOU"] }];
const TREAT = () => [{ type: "TREAT", properties: ["COLLECTIBLE"] }];
const GOAL = () => [{ type: "GOAL", properties: ["WIN"] }];
const EMPTY = () => [];

// Grid size is still controlled by constants in Game
// These layouts assume the same GRID_ROWS / GRID_COLS

const LEVELS = [
  {
    name: "Level 1",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), GOAL(), EMPTY(), EMPTY(), WALL(), BLOCK(), WALL() ],
      [ WALL(), WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), WALL(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), WALL(), BLOCK(), WALL(), WALL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), CORGI(), WALL(), TREAT(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 2",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), GOAL(), WALL() ],
      [ WALL(), WALL(), WALL(), EMPTY(), WALL(), WALL(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), TREAT(), WALL() ],
      [ WALL(), EMPTY(), WALL(), WALL(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), CORGI(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
  name: "Level 3",
  grid: [
    Array(7).fill(null).map(WALL),

    [ WALL(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), GOAL(), WALL() ],
    [ WALL(), WALL(), EMPTY(), EMPTY(), WALL(), WALL(), WALL() ],
    [ WALL(), TREAT(), EMPTY(), WALL(), BLOCK(), EMPTY(), WALL() ],
    [ WALL(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
    [ WALL(), CORGI(), EMPTY(), EMPTY(), WALL(), EMPTY(), WALL() ],

    Array(7).fill(null).map(WALL),
  ],
}
];

export default LEVELS;
