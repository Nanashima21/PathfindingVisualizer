import React, {Component} from 'react';
import Node from './Node/Node';

//Pathfinding
import {dijkstra, getNodesInShortestPathOrderDijkstra} from '../Algorithms/dijkstra';
import {dfs, getNodesInShortestPathOrderdfs} from '../Algorithms/dfs';
import {astar, getNodesInShortestPathOrderAstar} from '../Algorithms/astar';

//Maze
import {randomMaze} from '../MazeAlgorithms/randomMaze';
import {recursiveDivisionMaze} from '../MazeAlgorithms/recursiveDivision';
import {border} from '../MazeAlgorithms/border';
import {laydownrod} from '../MazeAlgorithms/laydownrod';
import {extendwall} from '../MazeAlgorithms/extendwall';

import './PathFindingVisualizer.css';

// (47,77),(39,61)
const ROW_RANGE = 47;
const COL_RANGE = 77;

let START_NODE_ROW = 1;
let START_NODE_COL = 1;
let FINISH_NODE_ROW = 45;
let FINISH_NODE_COL = 75;

const initialNum = getInitialNum(window.innerWidth, window.innerHeight);
const initialNumRows = initialNum[0];
const initialNumColumns = initialNum[1];

export default class PathfindingVisualizer extends Component {
    constructor() {
      super();
      this.state = {
          grid: [],
          mouseIsPressed: false,
          visualizingAlgorithm: false,
          generatingMaze: false,
          width: window.innerWidth,
          height: window.innerHeight,
          numRows: initialNumRows,
          numColumns: initialNumColumns,
          speed: 10,
          mazeSpeed: 10,
      };
    }

    //Grid
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    //HandleMouse
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }
    
    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    //Clear
    clearGrid() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
          return;
        }
        for (let row = 0; row < this.state.grid.length; row++) {
          for (let col = 0; col < this.state.grid[0].length; col++) {
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
        const newGrid = getInitialGrid(this.state.numRows, this.state.numColumns);
        this.setState({
          grid: newGrid,
          visualizingAlgorithm: false,
          generatingMaze: false,
        });
    }

    clearPath() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
          return;
        }
        for (let row = 0; row < this.state.grid.length; row++) {
          for (let col = 0; col < this.state.grid[0].length; col++) {
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
        const newGrid = getGridWithoutPath(this.state.grid);
        this.setState({
          grid: newGrid,
          visualizingAlgorithm: false,
          generatingMaze: false,
        });
    }

    resetPosition() {
      this.clearGrid();
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
      START_NODE_ROW = Math.floor(Math.random()*(ROW_RANGE-2))+1;
      START_NODE_COL = Math.floor(Math.random()*(COL_RANGE-2))+1;
      FINISH_NODE_ROW = Math.floor(Math.random()*(ROW_RANGE-2))+1;
      FINISH_NODE_COL = Math.floor(Math.random()*(COL_RANGE-2))+1;
      if(START_NODE_ROW === FINISH_NODE_ROW && START_NODE_COL === FINISH_NODE_COL) this.resetPosition();
      else this.componentDidMount();
    }

    //Pathfinding
    animateShortestPath(nodesInShortestPathOrder) {
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
              'node node-shortest-path';
          }, 50 * i);
        }
    }

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
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
              'node node-visited';
          }, this.state.speed * i);
        }
    }
    
    visualizeDijkstra() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    visualizedfs() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dfs(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrderdfs(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    visualizeastar() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = astar(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    //Maze
    animateMaze = (walls) => {
        for (let i = 0; i <= walls.length; i++) {
          if (i === walls.length) {
            setTimeout(() => {
              this.clearGrid();
              let newGrid = getNewGridWithMaze(this.state.grid, walls);
              this.setState({ grid: newGrid, generatingMaze: false })
            }, i * this.state.mazeSpeed);
            return;
          }
          let wall = walls[i];
          let node = this.state.grid[wall[0]][wall[1]];
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
          }, i * this.state.mazeSpeed);
        }
      };
    
    generateRandomMaze() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        this.setState({ generatingMaze: true });
        setTimeout(() => {
          const { grid } = this.state;
          const startNode = grid[START_NODE_ROW][START_NODE_COL];
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
          const walls = randomMaze(grid, startNode, finishNode);
          this.animateMaze(walls);
        }, this.state.mazeSpeed);
    }

    generateRecursiveDivisionMaze() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        this.setState({ generatingMaze: true });
        setTimeout(() => {
          const { grid } = this.state;
          const startNode = grid[START_NODE_ROW][START_NODE_COL];
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
          const walls = recursiveDivisionMaze(grid, startNode, finishNode);
          this.animateMaze(walls);
        }, this.state.mazeSpeed);
    }

    generateLayDownRodMaze() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        this.setState({ generatingMaze: true });
        setTimeout(() => {
          const { grid } = this.state;
          const startNode = grid[START_NODE_ROW][START_NODE_COL];
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
          const walls = laydownrod(grid, startNode, finishNode);
          this.animateMaze(walls);
        }, this.state.mazeSpeed);
    }

    generateExtendWall() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        setTimeout(() => {
          const { grid } = this.state;
          const startNode = grid[START_NODE_ROW][START_NODE_COL];
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
          const walls = extendwall(grid, startNode, finishNode);
          this.animateMaze(walls);
        }, this.state.mazeSpeed);
    }

    generateBorder() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) return;
        setTimeout(() => {
          const { grid } = this.state;
          const startNode = grid[START_NODE_ROW][START_NODE_COL];
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
          const walls = border(grid, startNode, finishNode);
          this.animateMaze(walls);
        }, this.state.mazeSpeed);
    }

    //Output
    render() {
        const {grid,mouseIsPressed}=this.state;

        return (
            <>
                <div className="grid">
                    {grid.map((row,rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node,nodeIdx) => {
                                    const {row,col,isStart,isFinish,isWall}=node;
                                    return (
                                        <Node
                                        key={nodeIdx}
                                        col={col}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                        row={row}>
                                        </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                    <button onClick={() => this.visualizeDijkstra()}>
                    Dijkstra's Algorithm
                    </button>
                    <button onClick={() => this.visualizedfs()}>
                        dfs
                    </button>
                    <button onClick={() => this.visualizeastar()}>
                        A*
                    </button>
                    <button onClick={() => this.generateRandomMaze()}>
                        Random Maze
                    </button>
                    <button onClick={() => this.generateRecursiveDivisionMaze()}>
                        RecursiveDivision Maze
                    </button>
                    <button onClick={() => this.generateLayDownRodMaze()}>
                        LayDownRod Maze
                    </button>
                    <button onClick={() => this.generateExtendWall()}>
                        ExtendWall Maze
                    </button>
                    <button onClick={() => this.clearGrid()}>
                        Clear Grid
                    </button>
                    <button onClick={() => this.clearPath()}>
                        Clear Path
                    </button>
                    <button onClick={() => this.resetPosition()}>
                        Reset Position
                    </button>
                </div>
            </>
        );
    }
}

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
    for(let row=0;row<ROW_RANGE;row++) {
        const currentRow = [];
        for(let col=0;col<COL_RANGE;col++) {
            currentRow.push(createNode(col,row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col,row) => {
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