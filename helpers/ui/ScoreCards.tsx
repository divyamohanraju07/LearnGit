
import React from "react";

export const Scorecards = ({ title, Score }) => {
  return (
    <div className="numberWidget">
      <span>{title}</span>
      <span style={{ fontSize: "30px", color: "black" }}>
        {Score}
      </span>
    </div>
  );
};
