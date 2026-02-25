// src/levels/index.js

// IMPORTANT:
// Levels are PURE DATA.
// No hooks, no state, no event logic.
// This keeps the game stable and future-proof.

const WALL = () => [{ type: "WALL", properties: ["WALL", "NO_PUSH"] }];
const BLOCK = () => [{ type: "BLOCK", properties: ["PUSH"] }];
const CORGI = () => [{ type: "CORGI", properties: ["YOU"] }];
const TREAT = () => [{ type: "TREAT", properties: ["COLLECTIBLE", "NO_PUSH"] }];
const GOAL = () => [{ type: "GOAL", properties: ["WIN", "NO_PUSH"] }];
const POOP = () => [{type: "POOP", properties: ["DEFEAT", "NO_PUSH"] }];
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
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), WALL(), POOP(), WALL() ],
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

      [ WALL(), CORGI(), EMPTY(), WALL(), EMPTY(), TREAT(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), WALL(), EMPTY(), WALL(), EMPTY(), WALL(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), WALL(), EMPTY(), GOAL(), WALL() ],

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

      [ WALL(), EMPTY(), GOAL(), WALL(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), WALL(), EMPTY(), BLOCK(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), WALL(), BLOCK(), WALL(), WALL(), EMPTY(), WALL() ],
      [ WALL(), TREAT(), EMPTY(), CORGI(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 8",
    difficulty: "Hard",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), WALL(), EMPTY(), GOAL(), WALL() ],
      [ WALL(), BLOCK(), EMPTY(), WALL(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), WALL(), EMPTY(), WALL(), EMPTY(), WALL(), WALL() ],
      [ WALL(), TREAT(), EMPTY(), CORGI(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 9",
    difficulty: "Hard",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), GOAL(), EMPTY(), BLOCK(), EMPTY(), TREAT(), WALL() ],
      [ WALL(), WALL(), EMPTY(), WALL(), EMPTY(), WALL(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), EMPTY(), WALL() ],
      [ WALL(), BLOCK(), WALL(), EMPTY(), WALL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), BLOCK(), EMPTY(), CORGI(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level 10",
    difficulty: "Expert",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), TREAT(), EMPTY(), EMPTY(), WALL(), GOAL(), WALL() ],
      [ WALL(), WALL(), EMPTY(), BLOCK(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), WALL(), WALL() ],
      [ WALL(), WALL(), WALL(), EMPTY(), WALL(), EMPTY(), WALL() ],
      [ WALL(), CORGI(), EMPTY(), BLOCK(), EMPTY(), BLOCK(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },

  {
    name: "Level X",
    difficulty: "Dev Levels",
    grid: [
      Array(7).fill(null).map(WALL),

      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), CORGI(), TREAT(), GOAL(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), BLOCK(), POOP(), EMPTY(), WALL() ],
      [ WALL(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), EMPTY(), WALL() ],

      Array(7).fill(null).map(WALL),
    ],
  },
];

export default LEVELS;