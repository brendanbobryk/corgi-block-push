import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS } from "./constants";

// Maze layout: walls, pushable blocks, treat, goal
const initialGrid = [
  Array(GRID_COLS).fill(null).map(() => [{ type: "WALL", properties: ["WALL"] }]),
  [ [{ type: "WALL", properties: ["WALL"] }], [], [], [{ type: "BLOCK", properties: ["PUSH"] }], [], [], [{ type: "WALL", properties: ["WALL"] }] ],
  [ [{ type: "WALL", properties: ["WALL"] }], [{ type: "WALL", properties: ["WALL"] }], [], [{ type: "WALL", properties: ["WALL"] }], [], [], [{ type: "WALL", properties: ["WALL"] }] ],
  [ [{ type: "WALL", properties: ["WALL"] }], [], [], [], [], [{ type: "TREAT", properties: ["COLLECTIBLE"] }], [{ type: "WALL", properties: ["WALL"] }] ],
  [ [{ type: "WALL", properties: ["WALL"] }], [], [{ type: "BLOCK", properties: ["PUSH"] }], [{ type: "WALL", properties: ["WALL"] }], [], [], [{ type: "WALL", properties: ["WALL"] }] ],
  [ [{ type: "WALL", properties: ["WALL"] }], [], [], [], [{ type: "BLOCK", properties: ["PUSH"] }], [], [{ type: "WALL", properties: ["WALL"] }] ],
  [ [{ type: "WALL", properties: ["WALL"] }], [], [], [{ type: "CORGI", properties: ["YOU"] }], [], [{ type: "GOAL", properties: ["WIN"] }], [{ type: "WALL", properties: ["WALL"] }] ],
];

const Game = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);

  const findPlayer = () => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (grid[y][x].some(obj => obj.properties.includes("YOU"))) return { x, y };
      }
    }
    return null;
  };

  const movePlayer = (dir) => {
    if (hasWon) return;
    const pos = findPlayer();
    if (!pos) return;
    const { x: cx, y: cy } = pos;
    const nx = cx + dir.x;
    const ny = cy + dir.y;

    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) return;

    const targetCell = grid[ny][nx];
    const newGrid = grid.map(row => row.map(cell => [...cell]));

    if (targetCell.some(obj => obj.properties.includes("WALL"))) return;

    const pushable = targetCell.find(obj => obj.properties.includes("PUSH"));
    if (pushable) {
      const pushX = nx + dir.x;
      const pushY = ny + dir.y;
      if (
        pushX >= 0 &&
        pushX < GRID_COLS &&
        pushY >= 0 &&
        pushY < GRID_ROWS &&
        newGrid[pushY][pushX].length === 0 &&
        !newGrid[pushY][pushX].some(obj => obj.properties.includes("WALL"))
      ) {
        newGrid[pushY][pushX].push(pushable);
        newGrid[ny][nx] = newGrid[ny][nx].filter(o => o !== pushable);

        const player = newGrid[cy][cx].find(o => o.properties.includes("YOU"));
        newGrid[cy][cx] = newGrid[cy][cx].filter(o => o !== player);
        newGrid[ny][nx].push(player);

        setGrid(newGrid);
        checkPickup(newGrid, nx, ny);
        checkWin(newGrid, nx, ny);
      }
    } else {
      const player = newGrid[cy][cx].find(o => o.properties.includes("YOU"));
      newGrid[cy][cx] = newGrid[cy][cx].filter(o => o !== player);
      newGrid[ny][nx].push(player);

      setGrid(newGrid);
      checkPickup(newGrid, nx, ny);
      checkWin(newGrid, nx, ny);
    }
  };

  const checkPickup = (currentGrid, x, y) => {
    const cell = currentGrid[y][x];
    const treat = cell.find(obj => obj.properties.includes("COLLECTIBLE"));
    if (treat) {
      currentGrid[y][x] = cell.filter(o => o !== treat);
      setHasTreat(true);
    }
  };

  const checkWin = (currentGrid, x, y) => {
    const cell = currentGrid[y][x];
    if (cell.some(obj => obj.properties.includes("WIN")) && hasTreat) {
      setHasWon(true);
    }
  };

  // Reset function
  const resetGame = () => {
    // Deep copy to prevent mutation issues
    const newGrid = initialGrid.map(row => row.map(cell => [...cell]));
    setGrid(newGrid);
    setHasTreat(false);
    setHasWon(false);
  };

  useEffect(() => {
    const handleKey = e => {
      switch(e.key) {
        case "ArrowUp": movePlayer(DIRECTIONS.UP); break;
        case "ArrowDown": movePlayer(DIRECTIONS.DOWN); break;
        case "ArrowLeft": movePlayer(DIRECTIONS.LEFT); break;
        case "ArrowRight": movePlayer(DIRECTIONS.RIGHT); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, hasTreat, hasWon]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      {/* Reset button */}
      <button
        onClick={resetGame}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#ffdd57",
          color: "#121212",
          cursor: "pointer",
          boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
          transition: "all 0.2s ease",
        }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      >
        🔄 Reset Game
      </button>

      <div className="status">
        {hasTreat ? "🦴 Treat collected!" : "Collect the treat 🦴 first"}
      </div>
      {hasWon && <div className="win-message">🎉 You Win! 🎉</div>}

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
        gap: "10px",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
      }}>
        {grid.flat().map((cell, idx) => <Cell key={idx} content={cell} />)}
      </div>
    </div>
  );
};

export default Game;
