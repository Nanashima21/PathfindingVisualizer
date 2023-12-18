import React, { useEffect, useState } from "react";
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
import { useGridGenerator, getInitialGrid } from "../hooks/useGridGenerator";

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

export const PathfindingVisualizer = () => {
  const [startNode, setStartNode] = useState({ Row: 1, Col: 1 });
  const [endNode, setEndNode] = useState({ Row: 1, Col: 1 });

  const [numRows, numColumns, Initgrid, initGrid1, initGrid2] =
    useGridGenerator();

  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);

  const [mazeAlgo, setMazeAlgo] = useState(mazeItems[0]);
  const handleChangeMaze = (e) => setMazeAlgo(e.target.value);
  const [pathAlgo, setPathAlgo] = useState(pathItems[0]);
  const handleChangePath = (e) => setPathAlgo(e.target.value);

  useEffect(() => {
    setGrid(Initgrid);
    setStartNode({ Row: 1, Col: 1 });
    setEndNode({ Row: numRows - 2, Col: numColumns - 2 });
  }, [numRows, numColumns]);

  useEffect(() => {
    setGrid(getInitialGrid(numRows, numColumns, startNode, endNode));
  }, [startNode, endNode]);

  // const [chosenSort1, setSelectSort1] = useState("Bubble Sort");
  // const handleChange1 = (e) => setSelectSort1(e.target.value);
  // const [chosenSort2, setSelectSort2] = useState("Bubble Sort");
  // const handleChange2 = (e) => setSelectSort2(e.target.value);

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
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          !(
            (row === startNode.Row && col === startNode.Col) ||
            (row === endNode.Row && col === endNode.Col)
          )
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    setGrid(getInitialGrid(numRows, numColumns, startNode, endNode));
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  const clearPath = () => {
    if (generatingMaze) return;
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
    if (visualizingAlgorithm || generatingMaze) return;
    const nextStartRow = Math.floor(Math.random() * (numRows - 2)) + 1;
    const nextStartCol = Math.floor(Math.random() * (numColumns - 2)) + 1;
    const nextEndRow = Math.floor(Math.random() * (numRows - 2)) + 1;
    const nextEndCol = Math.floor(Math.random() * (numColumns - 2)) + 1;
    if (nextStartRow === nextEndRow && nextStartCol === nextEndCol)
      resetPosition();
    else {
      setStartNode({ Row: nextStartRow, Col: nextStartCol });
      setEndNode({ Row: nextEndRow, Col: nextEndCol });
      setVisualizingAlgorithm(false);
      setGeneratingMaze(false);
    }
  };

  //Pathfinding
  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      // eslint-disable-next-line
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (
          !(
            (node.row === startNode.Row && node.col === startNode.Col) ||
            (node.row === endNode.Row && node.col === endNode.Col)
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
            (node.row === startNode.Row && node.col === startNode.Col) ||
            (node.row === endNode.Row && node.col === endNode.Col)
          )
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
      }, speed * i);
    }
  };

  const visualizePathfinding = () => {
    setVisualizingAlgorithm(true);
    const startNodeCell = grid[startNode.Row][startNode.Col];
    const finishNodeCell = grid[endNode.Row][endNode.Col];
    let visitedNodesInOrder, nodesInShortestPathOrder;
    if (pathAlgo === "Dijkstra's Algorithm") {
      visitedNodesInOrder = dijkstra(grid, startNodeCell, finishNodeCell);
      nodesInShortestPathOrder =
        getNodesInShortestPathOrderDijkstra(finishNodeCell);
    }
    if (pathAlgo === "Depth First Search") {
      visitedNodesInOrder = dfs(grid, startNodeCell, finishNodeCell);
      nodesInShortestPathOrder = getNodesInShortestPathOrderdfs(finishNodeCell);
    }
    if (pathAlgo === "A* Algorithm") {
      visitedNodesInOrder = astar(grid, startNodeCell, finishNodeCell);
      nodesInShortestPathOrder =
        getNodesInShortestPathOrderAstar(finishNodeCell);
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
            (node.row === startNode.Row && node.col === startNode.Col) ||
            (node.row === endNode.Row && node.col === endNode.Col)
          )
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-wall-animated";
      }, i * mazeSpeed);
    }
    setGeneratingMaze(false);
  };

  const generateMaze = () => {
    clearPath();
    clearGrid();
    setGeneratingMaze(true);
    setTimeout(() => {
      const startNodeCell = grid[startNode.Row][startNode.Col];
      const finishNodeCell = grid[endNode.Row][endNode.Col];
      let walls;
      if (mazeAlgo === "Random")
        walls = randomMaze(grid, startNodeCell, finishNodeCell);
      if (mazeAlgo === "Recursive Division")
        walls = recursiveDivisionMaze(grid, startNodeCell, finishNodeCell);
      if (mazeAlgo === "Lay Down Rod")
        walls = laydownrod(grid, startNodeCell, finishNodeCell);
      if (mazeAlgo === "Extend Wall")
        walls = extendwall(grid, startNodeCell, finishNodeCell);
      animateMaze(walls);
    }, mazeSpeed);
  };

  return (
    <>
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

      <button onClick={() => clearGrid()}>Clear Grid</button>
      <button onClick={() => clearPath()}>Clear Path</button>
      <button onClick={() => resetPosition()}>Reset Position</button>
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
      </div>
    </>
  );
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
