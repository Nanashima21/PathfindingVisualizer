import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    render() {
        const {
            col,
            isFinish,
            isStart,
            isWall,
            isVisited,
            isShortest,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
        } = this.props;
        const extraClassName = isFinish 
          ? 'node-finish' 
          : isStart 
          ? 'node-start' 
          : isWall
          ? 'node-wall'
          : isShortest
          ? "node node-shortest-path"
          : isVisited
          ? "node node-visited"
          : "node";

        return (
            <div 
              id={`node-${row}-${col}`}
              className={`node ${extraClassName}`}
              onMouseDown={() => onMouseDown(row, col)}
              onMouseEnter={() => onMouseEnter(row, col)}
              onMouseUp={() => onMouseUp()}
            ></div>
        );
    }
}

