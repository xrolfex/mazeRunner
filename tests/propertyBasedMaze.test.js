/* global describe, it, expect */
const fc = require('fast-check');
const solveMazeAStar = require('../algorithms/solve/astar');

// Property: If a solution exists, the path starts at start and ends at end

describe('Property-based: A* finds valid path if possible', () => {
  it('A* path starts at start and ends at end if solution exists', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 10 }),
        (size) => {
          // Create open maze
          const maze = Array.from({ length: size }, () => Array(size).fill(0));
          const start = [0, 0];
          const end = [size - 1, size - 1];
          const steps = solveMazeAStar(maze, start, end);
          expect(Array.isArray(steps)).toBe(true);
          expect(steps[0]).toEqual(start);
          expect(steps[steps.length - 1]).toEqual(end);
        }
      )
    );
  });
});
