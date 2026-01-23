// Game constants
export const CELL_SIZE = 60; // px
export const GRID_ROWS = 5;
export const GRID_COLS = 5;

export const EMOJIS = {
  CORGI: "🐶",
  BLOCK: "🟫",
  EMPTY: "⬜",
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Properties for objects
export const PROPERTIES = {
  YOU: "YOU",   // Controllable object
  PUSH: "PUSH", // Pushable object
};
