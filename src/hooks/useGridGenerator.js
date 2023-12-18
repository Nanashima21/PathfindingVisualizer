import { useLayoutEffect, useState } from "react";

export const useGridGenerator = () => {
  const [size, setSize] = useState([0, 0, [], [], []]);

  useLayoutEffect(() => {
    const updateSize = () => {
      const [numRows, numColumns] = getInitialNum(
        window.innerHeight,
        window.innerWidth
      );
      const startNode = { Row: 1, Col: 1 };
      const endNode = { Row: numRows - 2, Col: numColumns - 2 };
      const endNode12 = {
        Row: numRows - 2,
        Col: Math.floor(numColumns / 3) - 1,
      };
      const grid = getInitialGrid(numRows, numColumns, startNode, endNode);
      const grid1 = getInitialGrid(
        numRows,
        Math.floor(numColumns / 3) + 1,
        startNode,
        endNode12
      );
      const grid2 = getInitialGrid(
        numRows,
        Math.floor(numColumns / 3) + 1,
        startNode,
        endNode12
      );
      setSize([numRows, numColumns, grid, grid1, grid2]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.addEventListener("resize", updateSize);
  }, []);
  return size;
};

const getInitialNum = (height, width) => {
  const numColumns = Math.floor(width / (width / 100 + 10));
  const cellWidth = Math.floor(width / numColumns);
  const numRows = Math.floor(height / cellWidth);
  return [numRows, numColumns];
};

export const getInitialGrid = (numRows, numColumns, startNode, endNode) => {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const currentRow = [];
    for (let col = 0; col < numColumns; col++) {
      currentRow.push(createNode(row, col, startNode, endNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col, startNode, endNode) => {
  return {
    col,
    row,
    isStart: row === startNode.Row && col === startNode.Col,
    isFinish: row === endNode.Row && col === endNode.Col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
