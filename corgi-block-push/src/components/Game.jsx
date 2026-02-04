import React, { useState, useEffect, useRef } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS } from "./constants";
import LEVELS from "../levels";

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState(
    LEVELS[0].grid.map(row => row.map(cell => [...cell]))
  );
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);
  const [moves, setMoves] = useState(0);
  const [shake, setShake] = useState(false);

  const [bestMoves, setBestMoves] = useState(() => {
    const saved = localStorage.getItem("bestMoves");
    return saved ? JSON.parse(saved) : {};
  });

  const [showNewBest, setShowNewBest] = useState(false);

  const gridRef = useRef(grid);
  const hasTreatRef = useRef(hasTreat);
  const hasWonRef = useRef(hasWon);
  const shakeTimeoutRef = useRef(null);

  useEffect(() => {
    gridRef.current = grid;
    hasTreatRef.current = hasTreat;
    hasWonRef.current = hasWon;
  }, [grid, hasTreat, hasWon]);

  const triggerShake = () => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setShake(true);
    shakeTimeoutRef.current = setTimeout(() => setShake(false), 250);
  };

  const resetGame = (levelIndex = currentLevel) => {
    const newGrid = LEVELS[levelIndex].grid.map(row =>
      row.map(cell => [...cell])
    );

    setGrid(newGrid);
    setHasWon(false);
    setHasTreat(false);
    setMoves(0);
    setShake(false);
    setShowNewBest(false);
  };

  useEffect(() => resetGame(currentLevel), [currentLevel]);

  const findPlayerInGrid = g => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (g[y][x].some(o => o.properties.includes("YOU"))) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const cellHas = (cell, prop) =>
    cell.some(o => o.properties.includes(prop));

  const movePlayerSafe = dir => {
    if (hasWonRef.current) return;

    const g = gridRef.current;
    const pos = findPlayerInGrid(g);
    if (!pos) return;

    const nx = pos.x + dir.x;
    const ny = pos.y + dir.y;

    if (nx < 0 || ny < 0 || nx >= GRID_COLS || ny >= GRID_ROWS) return triggerShake();

    if (cellHas(g[ny][nx], "WALL")) return triggerShake();

    const newGrid = g.map(r => r.map(c => [...c]));

    const pushable = newGrid[ny][nx].find(o => o.properties.includes("PUSH"));
    if (pushable) {
      const px = nx + dir.x;
      const py = ny + dir.y;

      if (px < 0 || py < 0 || px >= GRID_COLS || py >= GRID_ROWS) return triggerShake();

      if (newGrid[py][px].some(o =>
        o.properties.includes("WALL") || o.properties.includes("PUSH")
      )) return triggerShake();

      newGrid[py][px].push(pushable);
      newGrid[ny][nx] = newGrid[ny][nx].filter(o => o !== pushable);
    }

    const player = newGrid[pos.y][pos.x].find(o => o.properties.includes("YOU"));
    newGrid[pos.y][pos.x] = newGrid[pos.y][pos.x].filter(o => o !== player);
    newGrid[ny][nx].push(player);

    let gotTreat = hasTreatRef.current;
    const landed = newGrid[ny][nx];
    const treat = landed.find(o => o.properties.includes("COLLECTIBLE"));

    if (treat) {
      newGrid[ny][nx] = landed.filter(o => o !== treat);
      gotTreat = true;
      setHasTreat(true);
    }

    const nextMoves = moves + 1;
    const win = landed.some(o => o.properties.includes("WIN"));

    if (win && gotTreat) {
      setHasWon(true);
      setBestMoves(prev => {
        const key = String(currentLevel);
        const best = prev[key] ?? Infinity;
        if (nextMoves < best) {
          const updated = { ...prev, [key]: nextMoves };
          localStorage.setItem("bestMoves", JSON.stringify(updated));
          setShowNewBest(true);
          return updated;
        }
        return prev;
      });
    }

    setMoves(nextMoves);
    setGrid(newGrid);
  };

  useEffect(() => {
    const handleKey = e => {
      if (["INPUT", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowUp") movePlayerSafe(DIRECTIONS.UP);
      if (e.key === "ArrowDown") movePlayerSafe(DIRECTIONS.DOWN);
      if (e.key === "ArrowLeft") movePlayerSafe(DIRECTIONS.LEFT);
      if (e.key === "ArrowRight") movePlayerSafe(DIRECTIONS.RIGHT);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moves]);

  const isCompleted = i => bestMoves[String(i)] !== undefined;

  return (
    <div style={{ display: "flex", gap: 24, padding: 20 }}>

      {/* Sidebar */}
      <div style={{
        width: 260,
        background: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        gap: 14
      }}>

        {LEVELS.map((lvl, i) => (
          <button
            key={i}
            onClick={() => setCurrentLevel(i)}
            style={{
              padding: "8px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background: i === currentLevel
                ? "linear-gradient(135deg,#ffdd57,#ffb347)"
                : "#333",
              color: i === currentLevel ? "#121212" : "#fff"
            }}
          >
            {lvl.name} {isCompleted(i) ? "✅" : ""}
          </button>
        ))}

        <button onClick={() => resetGame()}>🔄 Reset Game</button>

        <button onClick={() => {
          localStorage.removeItem("bestMoves");
          setBestMoves({});
        }}>
          🗑️ Reset All Progress
        </button>

        <div>
          Moves: {moves}<br />
          Best: {bestMoves[String(currentLevel)] ?? "-"}<br />
          {hasTreat ? "🦴 Treat collected!" : "Collect the treat"}
        </div>

        {hasWon && <div>🎉 You Win!</div>}
      </div>

      {/* Game */}
      <div className={shake ? "shake" : ""} style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
        gap: 10,
        background: "#1a1a1a",
        padding: 20,
        borderRadius: 15
      }}>
        {grid.map((row,y)=>row.map((cell,x)=>(
          <Cell key={`${x}-${y}`} content={cell}/>
        )))}
      </div>

    </div>
  );
};

export default Game;