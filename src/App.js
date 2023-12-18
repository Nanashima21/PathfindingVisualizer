import React from "react";
import "./App.css";
import { PathfindingVisualizer } from "./PathFindingVisualizer/PathFindingVisualizer";

export const App = () => {
  return (
    <div className="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
};

export default App;
