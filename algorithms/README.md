# MazeRunner Algorithms

This folder contains all maze generation and solving algorithms as separate modules for the MazeRunner web application.

## Structure
- `generate/` — Maze generation algorithms
  - `dfs.js` — Depth-First Search maze generation
  - `prim.js` — Prim's Algorithm maze generation
  - `kruskal.js` — Kruskal's Algorithm maze generation
- `solve/` — Maze solving algorithms
  - `dfs.js` — Depth-First Search maze solving
  - `bfs.js` — Breadth-First Search maze solving
  - `astar.js` — A* Search maze solving

Each algorithm is implemented as a standalone module and can be imported independently.

## Usage
Algorithms are orchestrated by `mazeGenerator.js` at the project root, which provides a unified interface for generating and solving mazes.

All algorithms are documented with JSDoc comments for maintainability and clarity.
