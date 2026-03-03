export const CELL_SIZE = 60; // px
export const GRID_ROWS = 7;
export const GRID_COLS = 7;

export const EMOJIS = {
  CORGI: "🐶",
  BLOCK: "🟫",
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

/*
__________Mechanics__________
- Things to make the corgi dirty ~ can't go home while dirty
    - Mud 🟫
    - Puddles 🟦

- Things to clean the corgi 💦💧
    - Sprinkler 🚿⛲
    - River 🌊
    - Rain 🌧️☔

- Obstacles
    - Cars 🚗🚙🚕🚓🚐🛻
    - Logs 🪵

- Acheivement system

__________Assets__________
- Background assets
    - Grass 🟩
    - Paths
        - Dirt
        - Tile/brick
        - Sidewalk

- Wall assets
    - Trees 🌳🌲
        - Vary between different trees?
    - Bush

- Pushable block assets
    - Toy ball (Tennis ball) ⚽🔵🏀🟡
    - Sticks

- Sprite assests
    - Customizable corgi sprites (colour, etc.)

- Misc.
    - Ambient birds flying away when corgi passes by

__________Misc.__________
- Per-level tutorial instructions

- Lock next levels until current level completion

- Change flag emojis everywhere to the house, including repo bio

*/