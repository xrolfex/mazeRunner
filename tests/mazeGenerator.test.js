/* global describe, it, expect */
// tests/mazeGenerator.test.js
// Jest test for mazeGenerator.js

const MazeGenerator = require('../mazeGenerator');

describe('Maze Generator', () => {
  it('should generate a maze of the correct size', () => {
    const size = 10;
    const { maze } = MazeGenerator.generateMaze('dfs', size);
    expect(maze.length).toBe(size);
    expect(maze[0].length).toBe(size);
  });
});
