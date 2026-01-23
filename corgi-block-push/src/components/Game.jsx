import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS, EMOJIS, PROPERTIES } from "./constants";

// Initial grid: corgi, blocks, treat, and goal
const initialGrid = [
  [[], [], [], [], [], [], []],
  [[], [{ type: "BLOCK", properties: ["PUSH"] }], [], [], [], [], []],
  [[], [], [{ type: "CORGI", properties: ["YOU"] }], [], [], [], []],
  [[], [], [], [{ type: "TREAT", properties: ["COLLECTIBLE"] }], [], [], []],
  [[], [], [], [], [{ type: "BLOCK", properties: ["PUSH"] }], [], []],
  [[], [], [], [], [], [], []],
  [[], [], [], [], [], [{ type: "GOAL", properties: ["WIN"] }], []],
];

const Game = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);

  // Find the player object
  const findPlayer = () => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const cell = grid[y][x];
        if (cell.some((obj) => obj.properties.includes("YOU"))) return { x, y };
      }
    }
    return null;
  };

  // Move player and push objects
  const movePlayer = (dir) => {
    if (hasWon) return; // Disable movement after winning
    const pos = findPlayer();
    if (!pos) return;
    const { x: cx, y: cy } = pos;
    const nx = cx + dir.x;
    const ny = cy + dir.y;

    // Check bounds
    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) return;

    const targetCell = grid[ny][nx];
    const newGrid = grid.map((row) => row.map((cell) => [...cell]));

    // Check for pushable object
    const pushable = targetCell.find((obj) => obj.properties.includes("PUSH"));

    if (pushable) {
      const pushX = nx + dir.x;
      const pushY = ny + dir.y;
      if (
        pushX >= 0 &&
        pushX < GRID_COLS &&
        pushY >= 0 &&
        pushY < GRID_ROWS &&
        newGrid[pushY][pushX].length === 0
      ) {
        // Move pushable
        newGrid[pushY][pushX].push(pushable);
        newGrid[ny][nx] = newGrid[ny][nx].filter((o) => o !== pushable);

        // Move player
        const player = newGrid[cy][cx].find((obj) => obj.properties.includes("YOU"));
        newGrid[cy][cx] = newGrid[cy][cx].filter((o) => o !== player);
        newGrid[ny][nx].push(player);
        setGrid(newGrid);
        checkPickup(newGrid, nx, ny);
        checkWin(newGrid, nx, ny);
      }
    } else {
      // Move player to empty or collectible cell
      const player = newGrid[cy][cx].find((obj) => obj.properties.includes("YOU"));
      newGrid[cy][cx] = newGrid[cy][cx].filter((o) => o !== player);
      newGrid[ny][nx].push(player);

      setGrid(newGrid);
      checkPickup(newGrid, nx, ny);
      checkWin(newGrid, nx, ny);
    }
  };

  // Check if player picked up treat
  const checkPickup = (currentGrid, x, y) => {
    const cell = currentGrid[y][x];
    const treat = cell.find((obj) => obj.properties.includes("COLLECTIBLE"));
    if (treat) {
      // Remove treat from grid
      currentGrid[y][x] = cell.filter((o) => o !== treat);
      setHasTreat(true);
    }
  };

  // Check if player reached a WIN tile with treat
  const checkWin = (currentGrid, x, y) => {
    const cell = currentGrid[y][x];
    if (cell.some((obj) => obj.properties.includes("WIN")) && hasTreat) {
      setHasWon(true);
    }
  };

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          movePlayer(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          movePlayer(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          movePlayer(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, hasTreat, hasWon]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ fontSize: "1.2rem", color: "#fff" }}>
        {hasTreat ? "🦴 Treat collected!" : "Collect the treat 🦴 first"}
      </div>
      {hasWon && (
        <div
          style={{
            fontSize: "2rem",
            color: "#00ff99",
            textShadow: "0 2px 6px rgba(0,0,0,0.7)",
          }}
        >
          🎉 You Win! 🎉
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
          gap: "10px",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
        }}
      >
        {grid.flat().map((cell, idx) => (
          <Cell key={idx} content={cell} />
        ))}
      </div>
    </div>
  );
};

export default Game;
