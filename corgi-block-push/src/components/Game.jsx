import React, { useState, useEffect, useCallback } from "react";
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
  }
];

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState(LEVELS[0].grid.map(r => r.map(c => [...c])));
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);
  const [moves, setMoves] = useState(0);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 250);
  };

  const changeLevel = (e) => {
    const levelIndex = Number(e.target.value);
    if (!LEVELS[levelIndex]) return;

    setCurrentLevel(levelIndex);
    setGrid(LEVELS[levelIndex].grid.map(r => r.map(c => [...c])));
    setHasWon(false);
    setHasTreat(false);
    setMoves(0);
  };

  const findPlayer = () => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (grid[y][x].some(o => o.properties.includes("YOU"))) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const movePlayer = useCallback((dir) => {
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
  }, [grid, hasWon, hasTreat]);

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
    setGrid(LEVELS[currentLevel].grid.map(r => r.map(c => [...c])));
    setHasWon(false);
    setHasTreat(false);
    setMoves(0);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") movePlayer(DIRECTIONS.UP);
      if (e.key === "ArrowDown") movePlayer(DIRECTIONS.DOWN);
      if (e.key === "ArrowLeft") movePlayer(DIRECTIONS.LEFT);
      if (e.key === "ArrowRight") movePlayer(DIRECTIONS.RIGHT);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [movePlayer]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <select value={currentLevel} onChange={changeLevel}>
        {LEVELS.map((lvl, i) => (
          <option key={i} value={i}>{lvl.name}</option>
        ))}
      </select>

      <button onClick={resetGame}>🔄 Reset Game</button>

      <div>Moves: {moves}</div>
      <div>{hasTreat ? "🦴 Treat collected!" : "Collect the treat 🦴 first"}</div>

      {hasWon && <div>🎉 You Win! 🎉</div>}

      <div
        className={shake ? "shake" : ""}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
          gap: "10px",
        }}
      >
        {grid.flat().map((cell, i) => (
          <Cell key={i} content={cell} />
        ))}
      </div>
    </div>
  );
};

export default Game;
