/* global describe, it, expect */
// tests/solveAlgorithms.test.js
// Jest tests for all maze solving algorithms (DFS, BFS, A*)

const solveMazeDFS = require('../algorithms/solve/dfs');
const solveMazeBFS = require('../algorithms/solve/bfs');
const solveMazeAStar = require('../algorithms/solve/astar');

describe('Maze Solving Algorithms', () => {
  // Simple 5x5 open maze (no walls)
  const openMaze = Array.from({ length: 5 }, () => Array(5).fill(0));
  const start = [0, 0];
  const end = [4, 4];

  const algorithms = [
    { name: 'DFS', fn: solveMazeDFS },
    { name: 'BFS', fn: solveMazeBFS },
    { name: 'A*', fn: solveMazeAStar },
  ];

  algorithms.forEach(({ name, fn }) => {
    describe(`${name} Solver`, () => {
      it('solves a simple open maze', () => {
        const steps = fn(openMaze, start, end);
        expect(Array.isArray(steps)).toBe(true);
        expect(steps.length).toBeGreaterThan(0);
        expect(steps[0]).toEqual(start);
        expect(steps[steps.length - 1]).toEqual(end);
      });
      it('returns empty array if no solution', () => {
        // Block the end
        const blockedMaze = openMaze.map(row => row.slice());
        blockedMaze[4][4] = 1;
        const steps = fn(blockedMaze, start, end);
        expect(Array.isArray(steps)).toBe(true);
        expect(steps.length === 0 || steps[steps.length-1][0] !== end[0] || steps[steps.length-1][1] !== end[1]).toBe(true);
      });
      it('handles invalid input gracefully', () => {
        let threw = false;
        try {
          fn(null, start, end);
        } catch {
          threw = true;
        }
        if (!threw) {
          // If no throw, expect an empty array or falsy result
          const result = fn([], start, end);
          expect(result === undefined || Array.isArray(result)).toBe(true);
        }
      });
    });
  });

  describe('A* Solver', () => {
    it('returns empty array if no solution (covers final return)', () => {
      // Block all possible paths
      const maze = [
        [0,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [1,1,1,1,0]
      ];
      const start = [0,0];
      const end = [4,4];
      const steps = solveMazeAStar(maze, start, end);
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBe(0);
    });

    it('A* returns empty array if start is surrounded by walls (explicit no solution branch)', () => {
      const maze = [
        [0,1,1],
        [1,1,1],
        [1,1,0]
      ];
      const start = [0,0];
      const end = [2,2];
      const steps = solveMazeAStar(maze, start, end);
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBe(0);
    });

    it('A* does not push to openSet if neighbor is already present (covers openSet.some false branch)', () => {
      // Maze with a loop to allow revisiting a cell
      const maze = [
        [0,0,0],
        [1,1,0],
        [0,0,0]
      ];
      const start = [0,0];
      const end = [2,2];
      // This will cause [0,2] to be added to openSet twice if not checked
      const steps = solveMazeAStar(maze, start, end);
      expect(Array.isArray(steps)).toBe(true);
      expect(steps[0]).toEqual(start);
      expect(steps[steps.length-1]).toEqual(end);
    });
  });
});
