import React from "react";
import { EMOJIS } from "./constants";
import corgi_up from "../assets/corgi_up.png";
import corgi_down from "../assets/corgi_down.png";
import corgi_left from "../assets/corgi_left.png";
import corgi_right from "../assets/corgi_right.png";

const CELL_SIZE = 60; // keep consistent with your grid

const Cell = ({ content, direction = "down" }) => {
  // Determine background color
  let bgColor = "#1e1e1e"; // default
  if (content.some(obj => obj.properties.includes("WALL"))) bgColor = "#333";
  if (content.some(obj => obj.properties.includes("PUSH"))) bgColor = "#795548";
  if (content.some(obj => obj.properties.includes("COLLECTIBLE"))) bgColor = "#ffcc00";
  if (content.some(obj => obj.properties.includes("WIN"))) bgColor = "#00aaff";
  if (content.some(obj => obj.properties.includes("DEFEAT"))) bgColor = "#cc3333";

  // Map directions to images
  const playerImages = {
    up: corgi_up,
    down: corgi_down,
    left: corgi_left,
    right: corgi_right
  };

  return (
    <div
      style={{
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
        borderRadius: "12px",
        border: "2px solid #444",
        backgroundColor: bgColor,
        boxShadow: "inset 0 -3px 5px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.4)",
        position: "relative", // container for stacking
        userSelect: "none",
        cursor: content.some(obj => obj.properties.includes("YOU")) ? "grab" : "default",
      }}
    >
      {content.map((obj, idx) => {
        const isPlayer = obj.properties.includes("YOU");
        const zIndex = isPlayer ? 10 : 1; // corgi on top
        const size = isPlayer ? "90%" : "80%"; // slightly smaller for others
        const offset = isPlayer ? 0 : "10%"; // center others
        if (isPlayer) {
          return (
            <img
              key={idx}
              src={playerImages[direction] || corgi_down}
              alt="corgi"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
                imageRendering: "pixelated",
                pointerEvents: "none",
                zIndex
              }}
            />
          );
        }

        // Everything else uses emojis
        return (
          <span
            key={idx}
            style={{
              position: "absolute",
              top: offset,
              left: offset,
              width: size,
              height: size,
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex
            }}
          >
            {EMOJIS[obj.type] || ""}
          </span>
        );
      })}
    </div>
  );
};

export default Cell;