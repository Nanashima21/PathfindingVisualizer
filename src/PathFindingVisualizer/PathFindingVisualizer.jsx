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
  // "Extend Wall",
];
const pathItems = [
  "Dijkstra's Algorithm",
  "Depth First Search",
  "A* Algorithm",
];

export const PathfindingVisualizer = () => {
  const [isClicked, setIsClicked] = useState(true);
  const onClickSwitch = () => setIsClicked(!isClicked);

  const [numRows, numColumns, initGrid, initGrid1, initGrid2] =
    useGridGenerator();

  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState({ Row: 1, Col: 1 });
  const [endNode, setEndNode] = useState({ Row: 1, Col: 1 });

  const [grid1, setGrid1] = useState([]);
  const [grid2, setGrid2] = useState([]);
  const [startNode1, setStartNode1] = useState({ Row: 1, Col: 1 });
  const [endNode1, setEndNode1] = useState({ Row: 1, Col: 1 });
  const [startNode2, setStartNode2] = useState({ Row: 1, Col: 1 });
  const [endNode2, setEndNode2] = useState({ Row: 1, Col: 1 });

  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);

  const [mazeAlgo, setMazeAlgo] = useState(mazeItems[0]);
  const handleChangeMaze = (e) => setMazeAlgo(e.target.value);
  const [pathAlgo, setPathAlgo] = useState(pathItems[0]);
  const handleChangePath = (e) => setPathAlgo(e.target.value);

  const [pathAlgo1, setPathAlgo1] = useState(pathItems[0]);
  const handleChangePath1 = (e) => setPathAlgo1(e.target.value);
  const [pathAlgo2, setPathAlgo2] = useState(pathItems[0]);
  const handleChangePath2 = (e) => setPathAlgo2(e.target.value);

  useEffect(() => {
    setGrid(initGrid);
    setStartNode({ Row: 1, Col: 1 });
    setEndNode({ Row: numRows - 2, Col: numColumns - 2 });

    setGrid1(initGrid1);
    setGrid2(initGrid2);
    setStartNode1({ Row: 1, Col: 1 });
    setEndNode1({ Row: numRows - 2, Col: Math.floor(numColumns / 3) - 1 });
    setStartNode2({ Row: 1, Col: 1 });
    setEndNode2({ Row: numRows - 2, Col: Math.floor(numColumns / 3) - 1 });
  }, [, numRows, numColumns]);

  useEffect(() => {
    if (isClicked)
      setGrid(getInitialGrid(numRows, numColumns, startNode, endNode));
    else {
      setGrid1(
        getInitialGrid(
          numRows,
          Math.floor(numColumns / 3) + 1,
          startNode1,
          endNode1
        )
      );
      setGrid2(
        getInitialGrid(
          numRows,
          Math.floor(numColumns / 3) + 1,
          startNode2,
          endNode2
        )
      );
    }
  }, [startNode, endNode, startNode1, endNode1, startNode2, endNode2]);

  const speed = 10;
  const mazeSpeed = 10;

  const makeMaze = () => {
    if (isClicked) {
      clearGrid(grid, startNode, endNode, 0);
      generateMaze(grid, startNode, endNode, 0);
    } else {
      clearGrid(grid1, startNode1, endNode2, 1);
      clearGrid(grid2, startNode1, endNode2, 2);
      generateMaze(grid1, startNode1, endNode1, 1);
    }
  };

  const doPath = () => {
    setVisualizingAlgorithm(true);
    if (isClicked) visualizePathfinding(pathAlgo, grid, startNode, endNode, 0);
    else {
      visualizePathfinding(pathAlgo1, grid1, startNode1, endNode1, 1);
      visualizePathfinding(pathAlgo2, grid2, startNode2, endNode2, 2);
    }
  };

  //HandleMouse
  const handleMouseDown = (grid, row, col, gridnum) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    if (gridnum === 0) setGrid(newGrid);
    if (gridnum === 1) setGrid1(newGrid);
    if (gridnum === 2) setGrid2(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (grid, row, col, gridnum) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    if (gridnum === 0) setGrid(newGrid);
    if (gridnum === 1) setGrid1(newGrid);
    if (gridnum === 2) setGrid2(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  //Clear
  const clearGrid = (grid, startNode, endNode, gridnum) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          !(
            (row === startNode.Row && col === startNode.Col) ||
            (row === endNode.Row && col === endNode.Col)
          )
        ) {
          document.getElementById(`node-${row}-${col}-${gridnum}`).className =
            "node";
        }
      }
    }
    if (gridnum === 0) {
      setGrid(getInitialGrid(numRows, numColumns, startNode, endNode));
    } else if (gridnum === 1) {
      setGrid1(
        getInitialGrid(
          numRows,
          Math.floor(numColumns / 3) + 1,
          startNode,
          endNode
        )
      );
    } else {
      setGrid2(
        getInitialGrid(
          numRows,
          Math.floor(numColumns / 3) + 1,
          startNode,
          endNode
        )
      );
    }
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  const clearPath = (grid, gridnum) => {
    if (generatingMaze) return;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          document.getElementById(`node-${row}-${col}-${gridnum}`).className ===
            "node node-visited" ||
          document.getElementById(`node-${row}-${col}-${gridnum}`).className ===
            "node node-shortest-path"
        ) {
          document.getElementById(`node-${row}-${col}-${gridnum}`).className =
            "node";
        }
      }
    }
    setGrid(getGridWithoutPath(grid));
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  };

  const resetPosition = () => {
    if (visualizingAlgorithm || generatingMaze) return;
    const nextStartRow = Math.floor(Math.random() * (numRows - 2)) + 1;
    const nextEndRow = Math.floor(Math.random() * (numRows - 2)) + 1;
    if (isClicked) {
      const nextStartCol = Math.floor(Math.random() * (numColumns - 2)) + 1;
      const nextEndCol = Math.floor(Math.random() * (numColumns - 2)) + 1;
      if (nextStartRow === nextEndRow && nextStartCol === nextEndCol)
        resetPosition();
      else {
        setStartNode({ Row: nextStartRow, Col: nextStartCol });
        setEndNode({ Row: nextEndRow, Col: nextEndCol });
        setVisualizingAlgorithm(false);
        setGeneratingMaze(false);
      }
    } else {
      const nextStartCol = Math.floor(
        Math.random() * Math.floor(numColumns / 3 - 2) + 1
      );
      const nextEndCol = Math.floor(
        Math.random() * Math.floor(numColumns / 3 - 2) + 1
      );
      if (nextStartRow === nextEndRow && nextStartCol === nextEndCol)
        resetPosition();
      else {
        setStartNode1({ Row: nextStartRow, Col: nextStartCol });
        setEndNode1({ Row: nextEndRow, Col: nextEndCol });
        setStartNode2({ Row: nextStartRow, Col: nextStartCol });
        setEndNode2({ Row: nextEndRow, Col: nextEndCol });
        setVisualizingAlgorithm(false);
        setGeneratingMaze(false);
      }
    }
  };

  //Pathfinding
  const animateShortestPath = (
    nodesInShortestPathOrder,
    startNode,
    endNode,
    gridnum
  ) => {
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
          document.getElementById(
            `node-${node.row}-${node.col}-${gridnum}`
          ).className = "node node-shortest-path";
      }, 50 * i);
    }
  };

  const animateAlgorithm = (
    startNode,
    endNode,
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    gridnum
  ) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(
            nodesInShortestPathOrder,
            startNode,
            endNode,
            gridnum
          );
        }, speed * i);
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
          document.getElementById(
            `node-${node.row}-${node.col}-${gridnum}`
          ).className = "node node-visited";
      }, speed * i);
    }
  };

  const visualizePathfinding = (
    pathType,
    grid,
    startNode,
    endNode,
    gridnum
  ) => {
    const startNodeCell = grid[startNode.Row][startNode.Col];
    const finishNodeCell = grid[endNode.Row][endNode.Col];

    if (pathType === "Dijkstra's Algorithm") {
      animateAlgorithm(
        startNode,
        endNode,
        dijkstra(grid, startNodeCell, finishNodeCell),
        getNodesInShortestPathOrderDijkstra(finishNodeCell),
        gridnum
      );
    }
    if (pathType === "Depth First Search") {
      animateAlgorithm(
        startNode,
        endNode,
        dfs(grid, startNodeCell, finishNodeCell),
        getNodesInShortestPathOrderdfs(finishNodeCell),
        gridnum
      );
    }
    if (pathType === "A* Algorithm") {
      animateAlgorithm(
        startNode,
        endNode,
        astar(grid, startNodeCell, finishNodeCell),
        getNodesInShortestPathOrderAstar(finishNodeCell),
        gridnum
      );
    }
  };

  //Maze
  const animateMaze = (walls, grid, startNode, endNode, gridnum) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          clearGrid(grid, startNode, endNode, gridnum);
          if (gridnum === 0) setGrid(getNewGridWithMaze(grid, walls));
          else {
            setGrid1(getNewGridWithMaze(grid, walls));
            setGrid2(getNewGridWithMaze(grid2, walls));
          }
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
          document.getElementById(
            `node-${node.row}-${node.col}-${gridnum}`
          ).className = "node node-wall-animated";
        if (gridnum === 1) {
          document.getElementById(`node-${node.row}-${node.col}-2`).className =
            "node node-wall-animated";
        }
      }, i * mazeSpeed);
    }
    setGeneratingMaze(false);
  };

  const generateMaze = (grid, startNode, endNode, gridnum) => {
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
      animateMaze(walls, grid, startNode, endNode, gridnum);
    }, mazeSpeed);
  };

  return (
    <>
      <button
        className="button"
        onClick={onClickSwitch}
        disabled={generatingMaze || visualizingAlgorithm}
      >
        {isClicked ? "Compare" : "Single Grid"}
      </button>

      <select className="button" value={mazeAlgo} onChange={handleChangeMaze}>
        {mazeItems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button
        className="button"
        onClick={makeMaze}
        disabled={generatingMaze || visualizingAlgorithm}
      >
        Create Maze
      </button>

      {isClicked ? (
        <select className="button" value={pathAlgo} onChange={handleChangePath}>
          {pathItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : (
        <>
          <select
            className="button"
            value={pathAlgo1}
            onChange={handleChangePath1}
          >
            {pathItems.map((item) => (
              <option key={item} value={item}>
                Left: {item}
              </option>
            ))}
          </select>
          <select
            className="button"
            value={pathAlgo2}
            onChange={handleChangePath2}
          >
            {pathItems.map((item) => (
              <option key={item} value={item}>
                Right: {item}
              </option>
            ))}
          </select>
        </>
      )}

      <button
        className="button"
        onClick={doPath}
        disabled={generatingMaze || visualizingAlgorithm}
      >
        Start Pathfinding!
      </button>

      <button
        onClick={() => {
          if (isClicked) clearGrid(grid, startNode, endNode, 0);
          else {
            clearGrid(grid1, startNode1, endNode1, 1);
            clearGrid(grid2, startNode2, endNode2, 2);
          }
        }}
      >
        Clear Grid
      </button>
      <button
        onClick={() => {
          if (isClicked) clearPath(grid, 0);
          else {
            clearPath(grid1, 1);
            clearPath(grid2, 2);
          }
        }}
      >
        Clear Path
      </button>
      <button onClick={() => resetPosition()}>Reset Position</button>

      {isClicked ? (
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
                        onMouseDown={(row, col) =>
                          handleMouseDown(grid, row, col, 0)
                        }
                        onMouseEnter={(row, col) =>
                          handleMouseEnter(grid, row, col, 0)
                        }
                        onMouseUp={() => handleMouseUp()}
                        row={row}
                        gridnum={0}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grids">
          <div className="grid1">
            {grid1.map((row, rowIdx) => {
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
                        onMouseDown={(row, col) =>
                          handleMouseDown(grid1, row, col, 1)
                        }
                        onMouseEnter={(row, col) =>
                          handleMouseEnter(grid1, row, col, 1)
                        }
                        onMouseUp={() => handleMouseUp()}
                        row={row}
                        gridnum={1}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="grid2">
            {grid2.map((row, rowIdx) => {
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
                        onMouseDown={(row, col) =>
                          handleMouseDown(grid2, row, col, 2)
                        }
                        onMouseEnter={(row, col) =>
                          handleMouseEnter(grid2, row, col, 2)
                        }
                        onMouseUp={() => handleMouseUp()}
                        row={row}
                        gridnum={2}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
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
