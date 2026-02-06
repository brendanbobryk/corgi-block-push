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
    difficulty: "Easy",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), CORGI(), WALL(), EMPTY(), EMPTY(), GOAL(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), EMPTY(), WALL(), WALL(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), WALL(), EMPTY(), TREAT(), WALL() ],
      [ WALL(), WALL(), EMPTY(), WALL(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 2",
    difficulty: "Easy",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), WALL(), GOAL(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), WALL(), WALL(), EMPTY(), WALL() ],
      [ WALL(), TREAT(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), WALL(), EMPTY(), WALL(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), CORGI(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 3",
    difficulty: "Easy",
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
    name: "Level 4",
    difficulty: "Medium",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), GOAL(), WALL() ],
      [ WALL(), EMPTY(), WALL(), BLOCK(), WALL(), WALL(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), WALL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), CORGI(), WALL(), EMPTY(), TREAT(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 5",
    difficulty: "Medium",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), CORGI(), EMPTY(), BLOCK(), EMPTY(), TREAT(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), GOAL(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 6",
    difficulty: "Medium",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), GOAL(), WALL() ],
      [ WALL(), EMPTY(), WALL(), EMPTY(), WALL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), WALL(), TREAT(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), WALL(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), CORGI(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 7",
    difficulty: "Hard",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), CORGI(), TREAT(), GOAL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 8",
    difficulty: "Hard",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), CORGI(), TREAT(), GOAL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 9",
    difficulty: "Hard",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), CORGI(), TREAT(), GOAL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level X",
    difficulty: "Expert",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), CORGI(), TREAT(), GOAL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },
];

export default LEVELS;