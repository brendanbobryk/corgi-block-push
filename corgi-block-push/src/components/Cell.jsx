import React from "react";

const Cell = ({ content }) => {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        fontSize: "2rem",
        userSelect: "none",
      }}
    >
      {content}
    </div>
  );
};

export default Cell;
