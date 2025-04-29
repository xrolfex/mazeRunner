/* global describe, it, expect */

// tests/mazeGeneratorOrchestration.test.js
// Jest tests for MazeGenerator orchestration logic

const MazeGenerator = require('../mazeGenerator');

describe('MazeGenerator Orchestration', () => {
  describe('generateMaze', () => {
    it('generates maze with DFS', () => {
      const { maze, steps, start, end } = MazeGenerator.generateMaze('dfs', 7);
      expect(Array.isArray(maze)).toBe(true);
      expect(maze.length).toBe(7);
      expect(Array.isArray(steps)).toBe(true);
      expect(Array.isArray(start)).toBe(true);
      expect(Array.isArray(end)).toBe(true);
    });
    it('generates maze with Prim', () => {
      const { maze } = MazeGenerator.generateMaze('prim', 7);
      expect(maze.length).toBe(7);
    });
    it('generates maze with Kruskal', () => {
      const { maze } = MazeGenerator.generateMaze('kruskal', 7);
      expect(maze.length).toBe(7);
    });
    it('throws on unknown algorithm', () => {
      expect(() => MazeGenerator.generateMaze('foo', 7)).toThrow('Unknown algorithm');
    });
  });

  describe('extractOptimalPath', () => {
    it('extracts optimal path from valid steps', () => {
      const steps = [[0,0],[0,1],[1,1],[2,1]];
      const start = [0,0];
      const end = [2,1];
      const path = MazeGenerator.extractOptimalPath(steps, start, end);
      expect(Array.isArray(path)).toBe(true);
      expect(path[0]).toEqual(start);
      expect(path[path.length-1]).toEqual(end);
    });
    it('throws or returns falsy if no path exists', () => {
      const steps = [[0,0],[1,1]];
      let threw = false;
      try {
        MazeGenerator.extractOptimalPath(steps, [0,0], [2,2]);
      } catch {
        threw = true;
      }
      if (!threw) {
        const result = MazeGenerator.extractOptimalPath(steps, [0,0], [2,2]);
        expect(!result || result.length === 0).toBe(true);
      }
    });
  });

  describe('solveMazeDFS/BFS/AStar', () => {
    const maze = [
      [0,0,1],
      [1,0,1],
      [1,0,0]
    ];
    const start = [0,0];
    const end = [2,2];
    it('solves with DFS', () => {
      const steps = MazeGenerator.solveMazeDFS(maze, start, end);
      expect(Array.isArray(steps)).toBe(true);
    });
    it('solves with BFS', () => {
      const steps = MazeGenerator.solveMazeBFS(maze, start, end);
      expect(Array.isArray(steps)).toBe(true);
    });
    it('solves with A*', () => {
      const steps = MazeGenerator.solveMazeAStar(maze, start, end);
      expect(Array.isArray(steps)).toBe(true);
    });
  });
});
