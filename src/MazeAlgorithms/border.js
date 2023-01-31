export function border(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
      return false;
    }
    let walls = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          (row === startNode.row && col === startNode.col) ||
          (row === finishNode.row && col === finishNode.col)
        )
          continue;
        if(row === 0 || col === 0 || row === grid.length-1 || col === grid[0].length-1)  walls.push([row, col]);
      }
    }
    return walls;
  }