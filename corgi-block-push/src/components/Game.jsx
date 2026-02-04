import React, { useState, useEffect, useRef } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS } from "./constants";
import LEVELS from "../levels";

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert"];

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState(
    LEVELS[currentLevel].grid.map(row => row.map(cell => [...cell]))
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

  const isLevelCompleted = (idx) =>
    bestMoves[String(idx)] !== undefined;

  const resetGame = (levelIndex = currentLevel) => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);

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

  useEffect(() => {
    resetGame(currentLevel);
  }, [currentLevel]);

  const triggerShake = () => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setShake(true);
    shakeTimeoutRef.current = setTimeout(() => setShake(false), 250);
  };

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

  const cellHas = (cell, prop) =>
    cell.some(o => o.properties.includes(prop));

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
    if (cellHas(targetCell, "WALL")) {
      triggerShake();
      return;
    }

    const newGrid = currentGrid.map(row => row.map(cell => [...cell]));

    const pushable = targetCell.find(o => o.properties.includes("PUSH"));
    if (pushable) {
      const px = nx + dir.x;
      const py = ny + dir.y;
      if (px < 0 || px >= GRID_COLS || py < 0 || py >= GRID_ROWS) return triggerShake();

      const pushTarget = newGrid[py][px];
      if (pushTarget.some(o => o.properties.includes("WALL") || o.properties.includes("PUSH")))
        return triggerShake();

      newGrid[py][px].push(pushable);
      newGrid[ny][nx] = newGrid[ny][nx].filter(o => o !== pushable);
    }

    const player = newGrid[cy][cx].find(o => o.properties.includes("YOU"));
    newGrid[cy][cx] = newGrid[cy][cx].filter(o => o !== player);
    newGrid[ny][nx].push(player);

    let newHasTreat = currentHasTreat;
    const landedCell = newGrid[ny][nx];
    const treat = landedCell.find(o => o.properties.includes("COLLECTIBLE"));

    if (treat) {
      newGrid[ny][nx] = landedCell.filter(o => o !== treat);
      newHasTreat = true;
      setHasTreat(true);
    }

    const isWinCell = landedCell.some(o => o.properties.includes("WIN"));
    const nextMoves = moves + 1;
    const levelKey = String(currentLevel);

    if (isWinCell && newHasTreat) {
      setHasWon(true);
      setBestMoves(prev => {
        const best = prev[levelKey] ?? Infinity;
        if (nextMoves < best) {
          const updated = { ...prev, [levelKey]: nextMoves };
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
    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowUp") movePlayerSafe(DIRECTIONS.UP);
      if (e.key === "ArrowDown") movePlayerSafe(DIRECTIONS.DOWN);
      if (e.key === "ArrowLeft") movePlayerSafe(DIRECTIONS.LEFT);
      if (e.key === "ArrowRight") movePlayerSafe(DIRECTIONS.RIGHT);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moves]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

      {/* LEVEL SELECTOR */}
      <div style={{
        background: "#1a1a1a",
        padding: "12px 16px",
        borderRadius: "14px",
        boxShadow: "0 5px 15px rgba(0,0,0,.4)",
        width: "100%",
        maxWidth: "420px"
      }}>
        {DIFFICULTIES.map(diff => (
          <div key={diff} style={{ marginBottom: "10px" }}>
            <div style={{ color: "#ffdd57", fontWeight: "bold", marginBottom: "6px" }}>
              {diff}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {LEVELS.map((lvl, idx) =>
                lvl.difficulty === diff ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentLevel(idx)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      background: idx === currentLevel
                        ? "linear-gradient(135deg,#ffdd57,#ffb347)"
                        : "#333",
                      color: idx === currentLevel ? "#121212" : "#fff",
                      boxShadow: isLevelCompleted(idx)
                        ? "0 0 8px rgba(255,221,87,.7)"
                        : "none"
                    }}
                  >
                    {lvl.name} {isLevelCompleted(idx) ? "✅" : ""}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => resetGame()} style={{
        padding: "12px 24px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg,#ffdd57,#ffb347)",
        cursor: "pointer"
      }}>
        🔄 Reset Game
      </button>

      <button onClick={() => {
        localStorage.removeItem("bestMoves");
        setBestMoves({});
        setShowNewBest(false);
      }} style={{
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#ff6b6b",
        color: "#fff",
        fontWeight: "bold"
      }}>
        🗑️ Reset All Progress
      </button>

      <div>Moves: {moves} {showNewBest && "🎉 New Best!"}</div>
      <div>{hasTreat ? "🦴 Treat collected!" : "Collect the treat 🦴 first"}</div>
      <div>Best Moves: {bestMoves[String(currentLevel)] ?? "-"}</div>

      {hasWon && <div style={{ background:"#ffdd57", padding:12, borderRadius:10 }}>🎉 You Win!</div>}

      <div className={shake ? "shake" : ""} style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
        gap: "10px",
        backgroundColor: "#1a1a1a",
        padding: "20px",
        borderRadius: "15px"
      }}>
        {grid.map((row,y)=>row.map((cell,x)=><Cell key={`${x}-${y}`} content={cell}/>))}
      </div>
    </div>
  );
};

export default Game;