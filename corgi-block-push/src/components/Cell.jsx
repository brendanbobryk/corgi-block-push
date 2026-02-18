import React from "react";
import { EMOJIS } from "./constants";
import corgi from "../assets/corgi.png";

const Cell = ({ content }) => {
  // Determine background color
  let bgColor = "#1e1e1e"; // default
  if (content.some(obj => obj.properties.includes("WALL"))) bgColor = "#333";
  if (content.some(obj => obj.properties.includes("PUSH"))) bgColor = "#795548";
  if (content.some(obj => obj.properties.includes("COLLECTIBLE"))) bgColor = "#ffcc00";
  if (content.some(obj => obj.properties.includes("WIN"))) bgColor = "#00aaff";

  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        border: "2px solid #444",
        backgroundColor: bgColor,
        boxShadow: "inset 0 -3px 5px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.4)",
        fontSize: "2rem",
        transition: "all 0.2s ease",
        userSelect: "none",
        cursor: content.some(obj => obj.properties.includes("YOU")) ? "grab" : "default",
        position: "relative"
      }}
    >
      {content.map((obj, idx) => {
        // PLAYER = CORGI
        if (obj.properties.includes("YOU")) {
          return (
            <img
              key={idx}
              src={corgi}
              alt="corgi"
              style={{
                width: "90%",
                height: "90%",
                imageRendering: "pixelated",
                pointerEvents: "none"
              }}
            />
          );
        }

        // Everything else uses emojis
        return (
          <span key={idx}>
            {EMOJIS[obj.type] || ""}
          </span>
        );
      })}
    </div>
  );
};

export default Cell;
