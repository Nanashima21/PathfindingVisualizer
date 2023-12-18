import React, { useState } from "react";
import Node from "./Node/Node";

//Pathfinding
import {
  dijkstra,
  getNodesInShortestPathOrderDijkstra,
} from "../Algorithms/dijkstra";
import { dfs, getNodesInShortestPathOrderdfs } from "../Algorithms/dfs";
import { astar, getNodesInShortestPathOrderAstar } from "../Algorithms/astar";

//Maze
import { randomMaze } from "../MazeAlgorithms/randomMaze";
import { recursiveDivisionMaze } from "../MazeAlgorithms/recursiveDivision";
// import { border } from "../MazeAlgorithms/border";
import { laydownrod } from "../MazeAlgorithms/laydownrod";
import { extendwall } from "../MazeAlgorithms/extendwall";

import "./PathFindingVisualizer.css";

let START_NODE_ROW = 1;
let START_NODE_COL = 1;
let FINISH_NODE_ROW = 45;
let FINISH_NODE_COL = 75;

const mazeItems = [
  "Random",
  "Recursive Division",
  "Lay Down Rod",
  "Extend Wall",
];
const pathItems = [
  "Dijkstra's Algorithm",
  "Depth First Search",
  "A* Algorithm",
];

const ROW_RANGE = 47;
const COL_RANGE = 77;

const initialNum = getInitialNum(window.innerWidth, window.innerHeight);
const initialNumRows = initialNum[0];
const initialNumColumns = initialNum[1];

export const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState(getInitialGrid());
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);

  const [mazeAlgo, setMazeAlgo] = useState(mazeItems[0]);
  const handleChangeMaze = (e) => setMazeAlgo(e.target.value);
  const [pathAlgo, setPathAlgo] = useState(pathItems[0]);
  const handleChangePath = (e) => setPathAlgo(e.target.value);

  // const [chosenSort1, setSelectSort1] = useState("Bubble Sort");
  // const handleChange1 = (e) => setSelectSort1(e.target.value);
  // const [chosenSort2, setSelectSort2] = useState("Bubble Sort");
  // const handleChange2 = (e) => setSelectSort2(e.target.value);

  // const width = window.innerWidth;
  // const height = window.innerHeight;
  const numRows = initialNumRows;
  const numColumns = initialNumColumns;
  const speed = 10;
  const mazeSpeed = 10;

  //HandleMouse
  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  //Clear
  const clearGrid = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          !(
            (row === START_NODE_ROW && col === START_NODE_COL) ||
            (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
          )
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newGrid = getInitialGrid(numRows, numColumns);
    setGrid(newGrid);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  const clearPath = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
            "node node-visited" ||
          document.getElementById(`node-${row}-${col}`).className ===
            "node node-shortest-path"
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newGrid = getGridWithoutPath(grid);
    setGrid(newGrid);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  const resetPosition = () => {
    clearGrid();
    if (visualizingAlgorithm || generatingMaze) return;
    START_NODE_ROW = Math.floor(Math.random() * (ROW_RANGE - 2)) + 1;
    START_NODE_COL = Math.floor(Math.random() * (COL_RANGE - 2)) + 1;
    FINISH_NODE_ROW = Math.floor(Math.random() * (ROW_RANGE - 2)) + 1;
    FINISH_NODE_COL = Math.floor(Math.random() * (COL_RANGE - 2)) + 1;
    if (
      START_NODE_ROW === FINISH_NODE_ROW &&
      START_NODE_COL === FINISH_NODE_COL
    )
      resetPosition();
    else getInitialGrid();
  };

  //Pathfinding
  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      // eslint-disable-next-line
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (
          !(
            (node.row === START_NODE_ROW && node.col === START_NODE_COL) ||
            (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
          )
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
      }, 50 * i);
    }
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      // eslint-disable-next-line
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (
          !(
            (node.row === START_NODE_ROW && node.col === START_NODE_COL) ||
            (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
          )
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
      }, speed * i);
    }
  };

  const visualizePathfinding = () => {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    let visitedNodesInOrder, nodesInShortestPathOrder;
    if (pathAlgo === "Dijkstra's Algorithm") {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      nodesInShortestPathOrder =
        getNodesInShortestPathOrderDijkstra(finishNode);
    }
    if (pathAlgo === "Depth First Search") {
      visitedNodesInOrder = dfs(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrderdfs(finishNode);
    }
    if (pathAlgo === "A* Algorithm") {
      visitedNodesInOrder = astar(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
    }
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  //Maze
  const animateMaze = (walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          clearGrid();
          let newGrid = getNewGridWithMaze(grid, walls);
          setGrid(newGrid);
          setGeneratingMaze(false);
        }, i * mazeSpeed);
        return;
      }
      let wall = walls[i];
      let node = grid[wall[0]][wall[1]];
      // eslint-disable-next-line
      setTimeout(() => {
        if (
          !(
            (node.row === START_NODE_ROW && node.col === START_NODE_COL) ||
            (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
          )
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-wall-animated";
      }, i * mazeSpeed);
    }
  };

  const generateMaze = () => {
    clearPath();
    clearGrid();
    setGeneratingMaze(true);
    setTimeout(() => {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      let walls;
      if (mazeAlgo === "Random")
        walls = randomMaze(grid, startNode, finishNode);
      if (mazeAlgo === "Recursive Division")
        walls = recursiveDivisionMaze(grid, startNode, finishNode);
      if (mazeAlgo === "Lay Down Rod")
        walls = laydownrod(grid, startNode, finishNode);
      if (mazeAlgo === "Extend Wall")
        walls = extendwall(grid, startNode, finishNode);
      animateMaze(walls);
    }, mazeSpeed);
  };

  return (
    <>
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isStart, isFinish, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    row={row}
                  ></Node>
                );
              })}
            </div>
          );
        })}

        <select className="button" value={mazeAlgo} onChange={handleChangeMaze}>
          {mazeItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          className="button"
          onClick={generateMaze}
          disabled={generatingMaze || visualizingAlgorithm}
        >
          Create Maze
        </button>

        <select className="button" value={pathAlgo} onChange={handleChangePath}>
          {pathItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          className="button"
          onClick={visualizePathfinding}
          disabled={generatingMaze || visualizingAlgorithm}
        >
          Start Pathfinding!
        </button>

        <button
          onClick={() => clearGrid()}
          disabled={generatingMaze || visualizingAlgorithm}
        >
          Clear Grid
        </button>
        <button
          onClick={() => clearPath()}
          disabled={generatingMaze || visualizingAlgorithm}
        >
          Clear Path
        </button>
        <button
          onClick={() => resetPosition()}
          disabled={generatingMaze || visualizingAlgorithm}
        >
          Reset Position
        </button>
      </div>
    </>
  );
};

//Init
function getInitialNum(width, height) {
  let numColumns;
  if (width > 1500) {
    numColumns = Math.floor(width / 25);
  } else if (width > 1250) {
    numColumns = Math.floor(width / 22.5);
  } else if (width > 1000) {
    numColumns = Math.floor(width / 20);
  } else if (width > 750) {
    numColumns = Math.floor(width / 17.5);
  } else if (width > 500) {
    numColumns = Math.floor(width / 15);
  } else if (width > 250) {
    numColumns = Math.floor(width / 12.5);
  } else if (width > 0) {
    numColumns = Math.floor(width / 10);
  }
  let cellWidth = Math.floor(width / numColumns);
  let numRows = Math.floor(height / cellWidth);
  return [numRows, numColumns];
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < ROW_RANGE; row++) {
    const currentRow = [];
    for (let col = 0; col < COL_RANGE; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
};

const getGridWithoutPath = (grid) => {
  let newGrid = grid.slice();
  for (let row of grid) {
    for (let node of row) {
      let newNode = {
        ...node,
        distance: Infinity,
        totalDistance: Infinity,
        isVisited: false,
        isShortest: false,
        previousNode: null,
      };
      newGrid[node.row][node.col] = newNode;
    }
  }
  return newGrid;
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
