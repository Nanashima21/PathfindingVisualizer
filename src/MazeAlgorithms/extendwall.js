export function extendwall(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
      return false;
    }
    let walls = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          if (is_start_or_goal(row,col,startNode,finishNode)) continue;
          if(row === 0 || col === 0 || row === grid.length-1 || col === grid[0].length-1)  {
              walls.push([row, col]);
              grid[row][col].isWall = true;
          }
        }
    }
    for (let col = 2; col < grid[0].length-2; col+=2) {
        if (is_start_or_goal(1,col,startNode,finishNode)) continue;
        if (is_start_or_goal(2,col,startNode,finishNode)) continue;
        if(Math.random() < 0.3 && grid[2][col].isWall === false)  {
            grid[2][col].isWall = true;
            walls.push([1, col]);
            walls.push([2, col]);
        }
    }
    for (let row = 2; row < grid.length-2; row+=2) {
        if (is_start_or_goal(row,1,startNode,finishNode)) continue;
        if (is_start_or_goal(row,2,startNode,finishNode)) continue;
        if(Math.random() < 0.4 && grid[row][2].isWall === false)  {
            grid[row][2].isWall = true;
            walls.push([row, 1]);
            walls.push([row, 2]);
        }
    }
    for (let col = 2; col < grid[0].length-2; col+=2) {
        if (is_start_or_goal(grid.length-2,col,startNode,finishNode)) continue;
        if (is_start_or_goal(grid.length-3,col,startNode,finishNode)) continue;
        if(Math.random() < 0.3 && grid[grid.length-3][col].isWall === false)  {
            grid[grid.length-3][col].isWall = true;
            walls.push([grid.length-2, col]);
            walls.push([grid.length-3, col]);
        }
    }
    for (let row = 2; row < grid.length-2; row+=2) {
        if (is_start_or_goal(row,grid[0].length-2,startNode,finishNode)) continue;
        if (is_start_or_goal(row,grid[0].length-3,startNode,finishNode)) continue;
        if(Math.random() < 0.4 && grid[row][grid[0].length-3].isWall === false)  {
            grid[row][grid[0].length-3].isWall = true;
            walls.push([row, grid[0].length-2]);
            walls.push([row, grid[0].length-3]);
        }
    }
    for(let i = 0; i < 50; i++) {
        if(i%2 === 0) {
            for (let row = 2; row < grid.length-2; row+=2) {
                for (let col = 2; col < grid[0].length-2; col+=2) {
                    if(grid[row][col].isWall === true) {
                        let num = Math.random() * 100;
                        if(grid[row-2][col].isWall === false && 0 <= num && num < 50)  {
                            if (is_start_or_goal(row-1,col,startNode,finishNode)) continue;
                            if (is_start_or_goal(row-2,col,startNode,finishNode)) continue;
                            grid[row-2][col].isWall = true;
                            walls.push([row-1, col]);
                            walls.push([row-2, col]);
                        } 
                        if(grid[row+2][col].isWall === false && 50 <= num && num < 67) {
                            if (is_start_or_goal(row+1,col,startNode,finishNode)) continue;
                            if (is_start_or_goal(row+2,col,startNode,finishNode)) continue;
                            grid[row+2][col].isWall = true;
                            walls.push([row+1, col]);
                            walls.push([row+2, col]);
                        }
                        if(grid[row][col-2].isWall === false && 67 <= num && num < 84) {
                            if (is_start_or_goal(row,col-1,startNode,finishNode)) continue;
                            if (is_start_or_goal(row,col-2,startNode,finishNode)) continue;
                            grid[row][col-2].isWall = true;
                            walls.push([row, col-1]);
                            walls.push([row, col-2]);
                        }  
                        if(grid[row][col+2].isWall === false && 84 <= num && num < 100) {
                            if (is_start_or_goal(row,col+1,startNode,finishNode)) continue;
                            if (is_start_or_goal(row,col+2,startNode,finishNode)) continue;
                            grid[row][col+2].isWall = true;
                            walls.push([row, col+1]);
                            walls.push([row, col+2]);
                        } 
                    }
                }
            }
        } else {
            for (let row = grid.length-2; row>=2 ;row-=2) {
                for (let col = grid[0].length-2; col>=2 ;col-=2) {
                    if(grid[row][col].isWall === true) {
                        let num = Math.random() * 100;
                        if(grid[row-2][col].isWall === false && 50 <= num && num < 67)  {
                            if (is_start_or_goal(row-1,col,startNode,finishNode)) continue;
                            if (is_start_or_goal(row-2,col,startNode,finishNode)) continue;
                            grid[row-2][col].isWall = true;
                            walls.push([row-1, col]);
                            walls.push([row-2, col]);
                        } 
                        if(grid[row+2][col].isWall === false && 0 <= num && num < 50) {
                            if (is_start_or_goal(row+1,col,startNode,finishNode)) continue;
                            if (is_start_or_goal(row+2,col,startNode,finishNode)) continue;
                            grid[row+2][col].isWall = true;
                            walls.push([row+1, col]);
                            walls.push([row+2, col]);
                        }
                        if(grid[row][col-2].isWall === false && 67 <= num && num < 84) {
                            if (is_start_or_goal(row,col-1,startNode,finishNode)) continue;
                            if (is_start_or_goal(row,col-2,startNode,finishNode)) continue;
                            grid[row][col-2].isWall = true;
                            walls.push([row, col-1]);
                            walls.push([row, col-2]);
                        }  
                        if(grid[row][col+2].isWall === false && 84 <= num && num < 100) {
                            if (is_start_or_goal(row,col+1,startNode,finishNode)) continue;
                            if (is_start_or_goal(row,col+2,startNode,finishNode)) continue;
                            grid[row][col+2].isWall = true;
                            walls.push([row, col+1]);
                            walls.push([row, col+2]);
                        } 
                    }
                }
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