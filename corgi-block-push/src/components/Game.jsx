import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS } from "./constants";

// Define levels as grids
const LEVELS = [
  {
    name: "Level 1",
    grid: [
      Array(GRID_COLS).fill(null).map(() => [{ type: "WALL", properties: ["WALL"] }]),
      [ [{ type: "WALL", properties: ["WALL"] }], [{ type: "GOAL", properties: ["WIN"] }], [], [], [{ type: "WALL", properties: ["WALL"] }], [{ type: "BLOCK", properties: ["PUSH"] }], [{ type: "WALL", properties: ["WALL"] }] ],
      [ [{ type: "WALL", properties: ["WALL"] }], [{ type: "WALL", properties: ["WALL"] }], [], [], [], [], [{ type: "WALL", properties: ["WALL"] }] ],
      [ [{ type: "WALL", properties: ["WALL"] }], [{ type: "WALL", properties: ["WALL"] }], [], [{ type: "BLOCK", properties: ["PUSH"] }], [], [], [{ type: "WALL", properties: ["WALL"] }] ],
      [ [{ type: "WALL", properties: ["WALL"] }], [{ type: "WALL", properties: ["WALL"] }], [{ type: "BLOCK", properties: ["PUSH"] }], [{ type: "WALL", properties: ["WALL"] }], [{ type: "WALL", properties: ["WALL"] }], [], [{ type: "WALL", properties: ["WALL"] }] ],
      [ [{ type: "WALL", properties: ["WALL"] }], [], [], [{ type: "CORGI", properties: ["YOU"] }], [{ type: "WALL", properties: ["WALL"] }], [{ type: "TREAT", properties: ["COLLECTIBLE"] }], [{ type: "WALL", properties: ["WALL"] }] ],
      Array(GRID_COLS).fill(null).map(() => [{ type: "WALL", properties: ["WALL"] }]),
    ]
  },
  // Future levels can be added here
  // { name: "Level 2", grid: [ ... ] }
];

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState(LEVELS[currentLevel].grid.map(r => r.map(c => [...c])));
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);
  const [moves, setMoves] = useState(0);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 250);
  };

  // Change level
  const changeLevel = (e) => {
    const levelIndex = parseInt(e.target.value);
    setCurrentLevel(levelIndex);
    const newGrid = LEVELS[levelIndex].grid.map(r => r.map(c => [...c]));
    setGrid(newGrid);
    setHasWon(false);
    setHasTreat(false);
    setMoves(0);
  };

  const findPlayer = () => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (grid[y][x].some(o => o.properties.includes("YOU"))) return { x, y };
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

    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) {
      triggerShake();
      return;
    }

    const targetCell = grid[ny][nx];
    const newGrid = grid.map(row => row.map(cell => [...cell]));

    if (targetCell.some(o => o.properties.includes("WALL"))) {
      triggerShake();
      return;
    }

    const pushable = targetCell.find(o => o.properties.includes("PUSH"));
    if (pushable) {
      const px = nx + dir.x;
      const py = ny + dir.y;

      if (
        px < 0 || px >= GRID_COLS ||
        py < 0 || py >= GRID_ROWS ||
        newGrid[py][px].length !== 0 ||
        newGrid[py][px].some(o => o.properties.includes("WALL"))
      ) {
        triggerShake();
        return;
      }

      newGrid[py][px].push(pushable);
      newGrid[ny][nx] = newGrid[ny][nx].filter(o => o !== pushable);
    }

    const player = newGrid[cy][cx].find(o => o.properties.includes("YOU"));
    newGrid[cy][cx] = newGrid[cy][cx].filter(o => o !== player);
    newGrid[ny][nx].push(player);

    setGrid(newGrid);
    setMoves(m => m + 1);
    checkPickup(newGrid, nx, ny);
    checkWin(newGrid, nx, ny);
  };

  const checkPickup = (g, x, y) => {
    const cell = g[y][x];
    const treat = cell.find(o => o.properties.includes("COLLECTIBLE"));
    if (treat) {
      g[y][x] = cell.filter(o => o !== treat);
      setHasTreat(true);
    }
  };

  const checkWin = (g, x, y) => {
    if (g[y][x].some(o => o.properties.includes("WIN")) && hasTreat) {
      setHasWon(true);
    }
  };

  const resetGame = () => {
    const newGrid = LEVELS[currentLevel].grid.map(r => r.map(c => [...c]));
    setGrid(newGrid);
    setHasWon(false);
    setHasTreat(false);
    setMoves(0);
  };

  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowUp") movePlayer(DIRECTIONS.UP);
      if (e.key === "ArrowDown") movePlayer(DIRECTIONS.DOWN);
      if (e.key === "ArrowLeft") movePlayer(DIRECTIONS.LEFT);
      if (e.key === "ArrowRight") movePlayer(DIRECTIONS.RIGHT);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, hasTreat, hasWon, currentLevel]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <style>
        {`
          @keyframes winPop {
            0% { opacity: 0; transform: scale(0.8); }
            60% { opacity: 1; transform: scale(1.15); }
            100% { transform: scale(1); }
          }

          @keyframes glow {
            from { box-shadow: 0 0 0 rgba(255,221,87,0); }
            to { box-shadow: 0 0 20px rgba(255,221,87,0.8); }
          }
        `}
      </style>

      {/* Level Selector */}
      <select
        value={currentLevel}
        onChange={changeLevel}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: "10px",
          backgroundColor: "#ffdd57",
          color: "#121212",
          boxShadow: "0 3px 6px rgba(0,0,0,0.3)"
        }}
      >
        {LEVELS.map((lvl, idx) => <option key={idx} value={idx}>{lvl.name}</option>)}
      </select>

      {/* Reset Button */}
      <button
        onClick={resetGame}
        style={{
          padding: "12px 24px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          borderRadius: "12px",
          border: "none",
          background: "linear-gradient(135deg, #ffdd57, #ffb347)",
          color: "#121212",
          cursor: "pointer",
          boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
          transition: "all 0.2s ease",
        }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        🔄 Reset Game
      </button>

      <div className="status">Moves: {moves}</div>
      <div className="status">
        {hasTreat ? "🦴 Treat collected!" : "Collect the treat 🦴 first"}
      </div>

      {hasWon && (
        <div
          style={{
            animation: "winPop 0.6s cubic-bezier(.34,1.56,.64,1), glow 0.6s ease-out",
            background: "#ffdd57",
            color: "#121212",
            padding: "12px 20px",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
        >
          🎉 You Win! 🎉
        </div>
      )}

      <div
        className={shake ? "shake" : ""}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
          gap: "10px",
          backgroundColor: "#1a1a1a",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
        }}
      >
        {grid.flat().map((cell, i) => <Cell key={i} content={cell} />)}
      </div>
    </div>
  );
};

export default Game;
