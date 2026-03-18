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

- Achievement system
    - [Come Here Boy!] Level completed with minimum move count
    - [Explore the Backyard] Traversed every space in a level
    - [Stinker] Attempt to enter the house while dirty
    - [Fetch!] Push a ball 25 spaces
    - [Snack Time] Eat 25 treats
    - [Bath Time] Ran through 25 sprinklers
    - [Bark Bark!] Scare 25 birds/cats
    - Hidden achievements / easter eggs
        - Escape the map
        - A reference to Ein, from Cowboy Bebop
        - A reference to the Queen's corgis

- Grid size increase as levels progressively climb

- Main menu
    - Play
    - Customizations (see assets)
    - Achievements (show completed + locked)
    - Options/Settings (also add accessibility to this menu in-game - settings cog icon)
        - Volume
            - Music (+ on/off)
            - Sound effects (+ on/off)
        - Controls
            - < v ^ > to wasd?
    - Credits
    - Quit/Exit

__________Assets__________
- Background assets
    - Grass 🟩
    - Paths
        - Dirt
        - Tile/brick
        - Sidewalk

- Wall assets
    - Backyard fence border
    - Trees 🌳🌲
        - Vary between different trees?
    - Bush

- Pushable block assets
    - Toy ball (Tennis ball) ⚽🔵🏀🟡
    - Sticks
    - Rope

- Sprite assests
    - Customizable corgi sprites (colour, etc.)
        - Default customizations
            - Corgi colour (Orange or Tri-colour)
            - Hats?
                - Crown from Queen achievement
                - Propeller hat
                - Pirate hat
                - Bucket hat
        - Unlock customizations through achievements
            - Raincoat
            - Boots
            - Bow/bowtie
            - Sweater

- Misc.
    - Ambient birds flying away when corgi passes by
    - Ambient cats that run into bushes/trees whe ncorgi passes near

    - Music
        - Background level song
        - Main menu song

    - Sounds effects
        - Level complete/loss
        - Bark when treat is obtained or arriving home
        - Misc. car horns
        - Birds chirping

__________Misc.__________
- Per-level tutorial instructions

- Lock next levels until current level completion
*/