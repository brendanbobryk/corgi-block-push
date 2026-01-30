import React, { useState, useEffect, useRef } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS } from "./constants";
import LEVELS from "../levels";

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState(
    LEVELS[currentLevel].grid.map(row => row.map(cell => [...cell]))
  );
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState(() => {
    const stored = localStorage.getItem("bestMoves");
    return stored ? JSON.parse(stored) : {};
  });
  const [shake, setShake] = useState(false);

  // --- Refs to hold latest state ---
  const gridRef = useRef(grid);
  const hasTreatRef = useRef(hasTreat);
  const hasWonRef = useRef(hasWon);

  // Ref for level selector (Fix #1)
  const levelSelectRef = useRef(null);

  useEffect(() => {
    gridRef.current = grid;
    hasTreatRef.current = hasTreat;
    hasWonRef.current = hasWon;
  }, [grid, hasTreat, hasWon]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 250);
  };

  const resetGame = (levelIndex = currentLevel) => {
    const newGrid = LEVELS[levelIndex].grid.map(row =>
      row.map(cell => [...cell])
    );
    setGrid(newGrid);
    setHasWon(false);
    setHasTreat(false);
    setMoves(0);
  };

  const changeLevel = (e) => {
    const levelIndex = parseInt(e.target.value, 10);
    setCurrentLevel(levelIndex);

    // Fix #1: remove focus so arrow keys stop changing levels
    if (levelSelectRef.current) {
      levelSelectRef.current.blur();
    }
  };

  useEffect(() => {
    resetGame(currentLevel);
  }, [currentLevel]);

  const findPlayerInGrid = (g) => {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (g[y][x].some(o => o.properties.includes("YOU"))) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const movePlayerSafe = (dir) => {
    if (hasWonRef.current) return;

    const currentGrid = gridRef.current;
    const currentHasTreat = hasTreatRef.current;

    const pos = findPlayerInGrid(currentGrid);
    if (!pos) return;

    const { x: cx, y: cy } = pos;
    const nx = cx + dir.x;
    const ny = cy + dir.y;

    if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) {
      triggerShake();
      return;
    }

    const targetCell = currentGrid[ny][nx];
    const newGrid = currentGrid.map(row => row.map(cell => [...cell]));

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

    let newHasTreat = currentHasTreat;
    const cell = newGrid[ny][nx];
    const treat = cell.find(o => o.properties.includes("COLLECTIBLE"));
    if (treat) {
      newGrid[ny][nx] = cell.filter(o => o !== treat);
      newHasTreat = true;
      setHasTreat(true);
    }

    // ✅ Corrected moves increment with functional updater
    setMoves(prevMoves => {
      const nextMoveCount = prevMoves + 1;

      // Update bestMoves if we win
      if (cell.some(o => o.properties.includes("WIN")) && newHasTreat) {
        setHasWon(true);
        setBestMoves(prev => {
          const currentBest = prev[currentLevel] ?? Infinity;
          if (nextMoveCount < currentBest) {
            const updated = { ...prev, [currentLevel]: nextMoveCount };
            localStorage.setItem("bestMoves", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }

      return nextMoveCount;
    });

    setGrid(newGrid);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") movePlayerSafe(DIRECTIONS.UP);
      if (e.key === "ArrowDown") movePlayerSafe(DIRECTIONS.DOWN);
      if (e.key === "ArrowLeft") movePlayerSafe(DIRECTIONS.LEFT);
      if (e.key === "ArrowRight") movePlayerSafe(DIRECTIONS.RIGHT);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
        ref={levelSelectRef}
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
        {LEVELS.map((lvl, idx) => (
          <option key={idx} value={idx}>{lvl.name}</option>
        ))}
      </select>

      {/* Reset Button */}
      <button
        onClick={() => resetGame()}
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
      <div className="status">
        Best Moves: {bestMoves[currentLevel] ?? "-"}
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
        {grid.flat().map((cell, i) => (
          <Cell key={i} content={cell} />
        ))}
      </div>
    </div>
  );
};

export default Game;