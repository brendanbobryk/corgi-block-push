# Corgi Block Push 🐶🟦

A Sokoban-style puzzle game built with React where you guide a corgi 🐕 through block-pushing challenges, collect treats 🦴, reach the goal 🚩, and avoid hazards 💩.

## Features

- Maze-style grid with walls and corridors
- Directional corgi sprite (faces up, down, left, right based on movement)
- Pushable blocks to solve puzzles and open paths
- Collect a treat 🦴 before reaching the goal 🚩
- Win state when the goal is reached with the treat
- Defeat state if the corgi steps in poop 💩
- Blocks cannot be pushed into poop, the goal, or treat tiles
- Layered tile rendering (corgi visually appears on top of other objects)
- Animated win and defeat notifications
- New Record 🏆 notification when a better move count is achieved
- Reset button to restart the level at any time
- Clean, modern, game-like UI with friendly, lighthearted visuals
- Keyboard controls: arrow keys to move the corgi

## Technologies Used

- React (with hooks)
- JavaScript
- CSS (inline styling, transitions, and animations)
- Custom sprite assets for the corgi character

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/brendanbobryk/corgi-block-push.git

2. Navigate to the project folder:
    ```bash
    cd corgi-block-push

3. Install dependencies:
    ```bash
    npm install

4. Start the development server:
    ```bash
    npm run dev

5. Open your browser at the local address shown in the terminal (usually http://localhost:5173) to play!

## License

MIT License
