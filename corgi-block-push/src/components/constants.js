export const CELL_SIZE = 60; // px
export const GRID_ROWS = 7;
export const GRID_COLS = 7;

export const EMOJIS = {
  CORGI: "🐶",
  BLOCK: "🔵",
  WALL: "🌳",
  EMPTY: "⬜",
  GOAL: "🏡",
  TREAT: "🦴",
  POOP: "💩",
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const PROPERTIES = {
  YOU: "YOU",                 // Controllable object
  PUSH: "PUSH",               // Pushable object
  WIN: "WIN",                 // Reaching this triggers win
  COLLECTIBLE: "COLLECTIBLE", // Items to pick up
  BLOCK: "BLOCK",             // Normal block
  WALL: "WALL",               // Impassable obstacle
  DEFEAT: "DEFEAT",           // Reaching this triggers loss
};