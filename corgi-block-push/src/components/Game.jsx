import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, EMOJIS, DIRECTIONS } from "./constants";

const initialGrid = [
  [EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY],
  [EMOJIS.EMPTY, EMOJIS.BLOCK, EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY],
  [EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.CORGI, EMOJIS.EMPTY, EMOJIS.EMPTY],
  [EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.BLOCK, EMOJIS.EMPTY],
  [EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY, EMOJIS.EMPTY],
];

const Game = () => {
  const [grid, setGrid] = useState(initialGrid);

  // Track corgi position
  const findCorgi = () => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (grid[y][x] === EMOJIS.CORGI) return { x, y };
      }
    }
    return { x: 0, y: 0 };
  };

  const moveCorgi = (dir) => {
    const { x: cx, y: cy } = findCorgi();
    const nx = cx + dir.x;
    const ny = cy + dir.y;

    // Check bounds
    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) return;

    const targetCell = grid[ny][nx];

    // If empty, move corgi
    if (targetCell === EMOJIS.EMPTY) {
      const newGrid = grid.map((row) => [...row]);
      newGrid[cy][cx] = EMOJIS.EMPTY;
      newGrid[ny][nx] = EMOJIS.CORGI;
      setGrid(newGrid);
    }

    // If block, attempt to push
    if (targetCell === EMOJIS.BLOCK) {
      const pushX = nx + dir.x;
      const pushY = ny + dir.y;

      // Check if push target is valid
      if (
        pushX >= 0 &&
        pushX < GRID_COLS &&
        pushY >= 0 &&
        pushY < GRID_ROWS &&
        grid[pushY][pushX] === EMOJIS.EMPTY
      ) {
        const newGrid = grid.map((row) => [...row]);
        newGrid[pushY][pushX] = EMOJIS.BLOCK;
        newGrid[ny][nx] = EMOJIS.CORGI;
        newGrid[cy][cx] = EMOJIS.EMPTY;
        setGrid(newGrid);
      }
    }
  };

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          moveCorgi(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          moveCorgi(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          moveCorgi(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          moveCorgi(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid]);

  return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${GRID_COLS}, 60px)`,
      gridTemplateRows: `repeat(${GRID_ROWS}, 60px)`,
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
    );
};

export default Game;
