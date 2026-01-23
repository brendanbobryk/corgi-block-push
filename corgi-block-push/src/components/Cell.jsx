import React from "react";
import { EMOJIS } from "./constants";

const Cell = ({ content }) => {
  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        border: "2px solid #333",
        backgroundColor: "#1e1e1e",
        boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
        fontSize: "2rem",
        transition: "all 0.2s ease",
        userSelect: "none",
        cursor: "default",
      }}
    >
      {content.map((obj, idx) => EMOJIS[obj.type] || "")}
    </div>
  );
};

export default Cell;
