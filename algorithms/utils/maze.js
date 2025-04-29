// utils/maze.js
// Utility functions for maze algorithms

/**
 * Returns a string key for a cell coordinate.
 * @param {number[]} cell
 * @returns {string}
 */
function cellKey([x, y]) {
  return `${x},${y}`;
}

/**
 * Returns valid neighbor coordinates for a cell in a maze.
 * @param {number[][]} maze
 * @param {number[]} cell
 * @returns {number[][]}
 */
function getNeighbors(maze, [x, y]) {
  const directions = [
    [0, -1], [0, 1], [-1, 0], [1, 0]
  ];
  return directions
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([nx, ny]) =>
      nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length && maze[nx][ny] === 0
    );
}

module.exports = { cellKey, getNeighbors };
