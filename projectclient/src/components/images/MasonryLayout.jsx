import React from "react";

const MasonryLayout = ({ id, columns = 3, gap = 24, children }) => {
  const columnWrapper = {};
  const result = [];

  // create columns
  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  // divide children into columns
  for (let i = 0; i < children.length; i++) {
    const columnIndex = i % columns;
    columnWrapper[`column${columnIndex}`].push(
      <div key={`${Math.random() * children.length}`} style={{ marginBottom: `${gap}px` }}>
        {children[i]}
      </div>
    );
  }

  // wrap children in each column with a div
  for (let i = 0; i < columns; i++) {
    result.push(
      <div
        key={`column${i}`}
        style={{
          marginLeft: `${i > 0 ? gap : 0}px`,
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return (
    <div id={id} style={{ display: "flex" }}>
      {result}
    </div>
  );
};

export default MasonryLayout;
