import React, { useState, useEffect, useRef } from "react";
import Cell from "./Cell";
import { CELL_SIZE, GRID_ROWS, GRID_COLS, DIRECTIONS } from "./constants";
import LEVELS from "../levels";
import confetti from "canvas-confetti";

const SIDEBAR_WIDTH = 260;

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState(
    LEVELS[0].grid.map(row => row.map(cell => [...cell]))
  );
  const [hasWon, setHasWon] = useState(false);
  const [hasTreat, setHasTreat] = useState(false);
  const [moves, setMoves] = useState(0);
  const [shake, setShake] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [instructionPulse, setInstructionPulse] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const hasLostRef = useRef(false);

  // NEW: Track player direction
  const [playerDirection, setPlayerDirection] = useState("down");

  const [bestMoves, setBestMoves] = useState(() => {
    const saved = localStorage.getItem("bestMoves");
    return saved ? JSON.parse(saved) : {};
  });

  const gridRef = useRef(grid);
  const hasTreatRef = useRef(hasTreat);
  const hasWonRef = useRef(hasWon);
  const shakeTimeoutRef = useRef(null);
  const winBannerRef = useRef(null);

  useEffect(() => {
    gridRef.current = grid;
    hasTreatRef.current = hasTreat;
    hasWonRef.current = hasWon;
  }, [grid, hasTreat, hasWon]);

  useEffect(() => {
    if (!hasWon || !winBannerRef.current) return;

    const rect = winBannerRef.current.getBoundingClientRect();

    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 200,
      spread: 70,
      origin: { x, y },
      scalar: 1.3
    });

    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      startVelocity: 35,
      gravity: 0.9,
      scalar: 0.9,
      origin: { x: 0.01, y: 0.99 }
    });

    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      startVelocity: 35,
      gravity: 0.9,
      scalar: 0.9,
      origin: { x: 0.99, y: 0.99 }
    });
  }, [hasWon]);

  useEffect(() => {
    setInstructionPulse(true);
    const t = setTimeout(() => setInstructionPulse(false), 300);
    return () => clearTimeout(t);
  }, [hasTreat]);

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
    setIsNewRecord(false);
    setHasLost(false);
    hasLostRef.current = false;
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
    if (hasWonRef.current || hasLostRef.current) return;

    // NEW: Update player direction on move
    if (dir === DIRECTIONS.UP) setPlayerDirection("up");
    else if (dir === DIRECTIONS.DOWN) setPlayerDirection("down");
    else if (dir === DIRECTIONS.LEFT) setPlayerDirection("left");
    else if (dir === DIRECTIONS.RIGHT) setPlayerDirection("right");

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
        o.properties.includes("NO_PUSH") ||
        o.properties.includes("PUSH")
      )) return triggerShake();

      newGrid[py][px].push(pushable);
      newGrid[ny][nx] = newGrid[ny][nx].filter(o => o !== pushable);
    }

    const player = newGrid[pos.y][pos.x].find(o => o.properties.includes("YOU"));
    newGrid[pos.y][pos.x] = newGrid[pos.y][pos.x].filter(o => o !== player);
    newGrid[ny][nx].push(player);

    let gotTreat = hasTreatRef.current;
    const landed = newGrid[ny][nx];

    // DEFEAT CONDITION (stepped in poop 💩)
    if (landed.some(o => o.properties.includes("DEFEAT"))) {
    setHasLost(true);
    triggerShake();
    hasLostRef.current = true;
    return;
    }

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
          setIsNewRecord(true);
          return updated;
        }
        setIsNewRecord(false);
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

  const grouped = LEVELS.reduce((acc, lvl, idx) => {
    const diff = lvl.difficulty || "Other";
    if (!acc[diff]) acc[diff] = [];
    acc[diff].push({ ...lvl, index: idx });
    return acc;
  }, {});

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#121212" }}>
      {/* LEFT SIDEBAR */}
      <div style={{ position: "fixed", left: 0, top: 0, width: SIDEBAR_WIDTH, height: "100vh", background: "#1a1a1a", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {Object.entries(grouped).map(([difficulty, levels]) => (
          <div key={difficulty}>
            <div style={{ fontWeight: "bold", marginBottom: 6, color: "#ffdd57" }}>{difficulty}</div>

            {levels.map(lvl => (
              <button
                key={lvl.index}
                onClick={() => setCurrentLevel(lvl.index)}
                style={{
                  width: "100%",
                  marginBottom: 6,
                  padding: 8,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: lvl.index === currentLevel ? "linear-gradient(135deg,#ffdd57,#ffb347)" : "#333",
                  color: lvl.index === currentLevel ? "#121212" : "#fff"
                }}
              >
                {lvl.name} {isCompleted(lvl.index) ? "✅" : ""}
              </button>
            ))}
          </div>
        ))}

        {/* Dividing line */}
        <div style={{ height: 1, background: "#333", margin: "6px 0" }} />

        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              flex: 1,
              background: "#333",
              borderRadius: 12,
              padding: "10px 6px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,.4)"
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#ffdd57", fontWeight: "bold" }}>
              🐾 MOVES 🐾
            </div>

            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff" }}>
              {moves}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "#333",
              borderRadius: 12,
              padding: "10px 6px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,.4)"
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#ffdd57", fontWeight: "bold" }}>
              🏆 RECORD 🏆
            </div>

            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff" }}>
              {bestMoves[String(currentLevel)] ?? "-"}
            </div>
          </div>
        </div>

        {/* Dividing line */}
        <div style={{ height: 1, background: "#333", margin: "6px 0" }} />

        {/* Reset Button */}
        <button
          onClick={() => resetGame()}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 800,
            background: "linear-gradient(135deg,#66ccff,#3399ff)",
            color: "#121212",
            boxShadow: "0 4px 10px rgba(0,0,0,.4)",
            transition: "transform .15s ease, box-shadow .15s ease"
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(.96)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
        🔄 Reset Level 🔄
        </button>

        {/* Record Reset Button */}
        <button
          onClick={() => {
            localStorage.removeItem("bestMoves");
            setBestMoves({});
          }}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 800,
            background: "linear-gradient(135deg,#ff6666,#ff3333)",
            color: "#121212",
            boxShadow: "0 4px 10px rgba(0,0,0,.4)",
            transition: "transform .15s ease, box-shadow .15s ease"
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(.96)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
        🗑️ Reset All Progress 🗑️
        </button>

      </div>

      {/* RIGHT CONTROLS PANEL */}
      <div style={{ position: "fixed", right: 0, top: 0, width: SIDEBAR_WIDTH, height: "100vh", background: "#1a1a1a", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

        <div>
          <div style={{ fontWeight: "bold", marginBottom: 6, color: "#ffdd57" }}>Instructions</div>

          <div style={{ background: "#333", borderRadius: 10, padding: 8, marginBottom: 6, color: "#fff", fontWeight: "bold", lineHeight: 1.8 }}>
            1️⃣: Collect Treat 🦴<br />
            2️⃣: Reach Goal 🚩
          </div>
        </div>

        {/* Dividing line */}
        <div style={{ height: 1, background: "#333", margin: "6px 0" }} />

        <div>
          <div style={{ fontWeight: "bold", marginBottom: 6, color: "#ffdd57" }}>Controls</div>

          <div style={{ background: "#333", borderRadius: 10, padding: 8, marginBottom: 6, color: "#fff", fontWeight: "bold", lineHeight: 1.8 }}>
            ⬆️: Move Up<br />
            ⬇️: Move Down<br />
            ⬅️: Move Left<br />
            ➡️: Move Right<br />
          </div>
        </div>

      </div>

      {/* MAIN AREA */}
      <div style={{ marginLeft: SIDEBAR_WIDTH, marginRight: SIDEBAR_WIDTH, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "20px 0", background: "linear-gradient(90deg,#ffdd57,#ffb347)", boxShadow: "0 2px 8px rgba(0,0,0,.4)", marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: "#121212" }}>🟫🐕 Corgi Block Push 🦴🚩</h1>
        </div>

        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ height: 60, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                transform: instructionPulse ? "scale(1.1)" : "scale(1)",
                opacity: 1,
                pointerEvents: "none",
                padding: "12px 28px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#ffaa00,#ffdd57)",
                color: "#121212",
                fontWeight: 800,
                fontSize: "1.4rem",
                boxShadow: "0 6px 16px rgba(0,0,0,.4)",
                transition: "transform 0.3s ease, opacity 0.3s ease"
              }}
            >
              {hasTreat ? "Get to the goal! 🚩" : "Collect the treat! 🦴"}
            </div>
          </div>

          <div className={shake ? "shake" : ""} style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`, gap: 10, background: "#1a1a1a", padding: 20, borderRadius: 15 }}>
            {grid.map((row, y) => row.map((cell, x) => <Cell key={`${x}-${y}`} content={cell} direction={playerDirection}/>))}
          </div>

          <div style={{ height: 100, marginTop: 39, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div
              ref={winBannerRef}
              style={{
                transform: hasWon ? "scale(1)" : "scale(0.5)",
                opacity: hasWon ? 1 : 0,
                pointerEvents: "none",
                padding: "16px 32px",
                borderRadius: 16,
                background: "linear-gradient(135deg,#00ff99,#00cc77)",
                color: "#121212",
                fontWeight: 900,
                fontSize: "1.8rem",
                boxShadow: "0 6px 16px rgba(0,0,0,.4)",
                transition: "opacity 0.5s ease, transform 0.5s ease"
              }}
            >
              🎉 LEVEL COMPLETE! 🎉
            </div>

            <div
              style={{
                transform: hasLost ? "scale(1)" : "scale(0.5)",
                opacity: hasLost ? 1 : 0,
                pointerEvents: "none",
                padding: "16px 32px",
                borderRadius: 16,
                background: "linear-gradient(135deg,#8b4513,#5a2d0c)",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "1.8rem",
                boxShadow: "0 6px 16px rgba(0,0,0,.4)",
                transition: "opacity 0.5s ease, transform 0.5s ease"
              }}
            >
              💩 OH NO! YOU STEPPED IN POOP! 💩
            </div>

            <div
              style={{
                transform: isNewRecord ? "scale(1)" : "scale(0.5)",
                opacity: isNewRecord ? 1 : 0,
                pointerEvents: "none",
                padding: "10px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#ffd700,#ffb700)",
                color: "#121212",
                fontWeight: 800,
                fontSize: "1.2rem",
                boxShadow: "0 4px 12px rgba(0,0,0,.4)",
                transition: "opacity 0.4s ease, transform 0.4s ease"
              }}
            >
              🏆 NEW RECORD! 🏆
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
