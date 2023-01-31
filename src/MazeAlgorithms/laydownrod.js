export function laydownrod(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
      return false;
    }
    let walls = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          if (is_start_or_goal(row,col,startNode,finishNode)) continue;
          if(row === 0 || col === 0 || row === grid.length-1 || col === grid[0].length-1)  walls.push([row, col]);
        }
    }
    for (let row = 1; row < grid.length-1; row++) {
      for (let col = 1; col < grid[0].length-1; col++) {
        if (is_start_or_goal(row,col,startNode,finishNode)) continue;
        if(row%2 === 0 && col%2 === 0) {
            let num = Math.random() * 100;
            if(row === 2) {
                if(0 <= num && num < 25 && !is_start_or_goal(row-1,col,startNode,finishNode)) walls.push([row-1, col]);
                else if(25 <= num && num < 50 && !is_start_or_goal(row+1,col,startNode,finishNode)) walls.push([row+1, col]);
                else if(50 <= num && num < 75 && !is_start_or_goal(row,col-1,startNode,finishNode)) walls.push([row, col-1]);
                else {
                  if(!is_start_or_goal(row,col+1,startNode,finishNode)) walls.push([row, col+1]);
                }
            } else {
                if(0 <= num && num < 33 && !is_start_or_goal(row+1,col,startNode,finishNode)) walls.push([row+1, col]);
                else if(33 <= num && num < 66 && !is_start_or_goal(row,col-1,startNode,finishNode)) walls.push([row, col-1]);
                else {
                  if(!is_start_or_goal(row,col-1,startNode,finishNode)) walls.push([row, col+1]); 
                }
            }
            walls.push([row, col]);
        }
      }
    }
    return walls;
}

function is_start_or_goal(row, col, startNode, finishNode) {
  if (
      (row === startNode.row && col === startNode.col) ||
      (row === finishNode.row && col === finishNode.col)
  ) return true;
  else return false;
}