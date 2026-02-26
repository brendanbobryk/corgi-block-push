// Game constants
export const CELL_SIZE = 60; // px
export const GRID_ROWS = 7;
export const GRID_COLS = 7;

export const EMOJIS = {
  CORGI: "🐶",
  BLOCK: "🟫",
  WALL: "🌳",   // Impassable obstacle
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

// Properties for objects
export const PROPERTIES = {
  YOU: "YOU",          // Controllable object
  PUSH: "PUSH",        // Pushable object
  WIN: "WIN",          // Reaching this triggers win
  COLLECTIBLE: "COLLECTIBLE", // Items to pick up
  BLOCK: "BLOCK",      // Normal block
  WALL: "WALL",        // Impassable
  DEFEAT: "DEFEAT",    // Reaching this triggers loss
};

/*
__Mechanics__
- Things to make the corgi dirty: Mud, puddle
    ~ can't go home while dirty

- Things to clean the corgi: Sprinkler, river, rain
    Emojis: 🚿

__Assets__
- Grass background

- Bush/tree walls

- Toy balls/sticks as pushable blocks

- Ambient birds flying away when corgi passes by
*/