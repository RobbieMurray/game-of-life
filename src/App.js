import produce from "immer";
import React, { useCallback, useRef, useState } from "react";
import "./App.css";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateGrid = (random) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    if (!random) {
      rows.push(Array.from(Array(numCols), () => 0));
    } else {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
      );
    }
  }
  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateGrid(false);
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const [loop, setLoop] = useState(false);
  const loopRef = useRef(loop);
  loopRef.current = loop;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              let newI = i + x;
              let newJ = j + y;
              if (loopRef.current) {
                if (newI < 0) newI += numRows;
                if (newI >= numRows) newI -= numRows;
                if (newJ < 0) newJ += numCols;
                if (newJ >= numCols) newJ -= numCols;
              }
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className="body">
      <h1>Conway's Game of Life</h1>
      <div className="controls">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {" "}
          {running ? "Stop Simulation" : "Start Simulation"}
        </button>
        <button
          onClick={() => {
            setGrid(generateGrid(true));
          }}
        >
          Random Board
        </button>
        <button
          onClick={() => {
            setLoop(!loop);
          }}
        >
          {loop ? "Static Board" : "Loop Board"}
        </button>
        <button
          onClick={() => {
            setGrid(generateGrid(false));
          }}
        >
          Clear Board
        </button>
      </div>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              className="box"
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                border: "solid 1px black",
                backgroundColor: grid[i][j] ? "black" : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
