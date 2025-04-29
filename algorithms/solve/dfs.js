/**
 * algorithms/solve/dfs.js
 *
 * Maze solving using Depth-First Search (DFS) algorithm.
 *
 * Exports:
 *   solveMazeDFS(maze, start, end): Solves the maze using DFS.
 *
 * Returns:
 *   solutionSteps: Array of [x, y] steps from start to end (if found)
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

// Depth-First Search Maze Solver
/**
 * Solves a maze using Depth-First Search (DFS).
 *
 * @param {number[][]} maze - 2D maze array (0=open, 1=wall)
 * @param {number[]} start - [row, col] start cell
 * @param {number[]} end - [row, col] end cell
 * @returns {number[][]} solutionSteps - Array of [x, y] steps from start to end (if found)
 */
module.exports = function solveMazeDFS(maze, start, end) {
    const stack = [start];
    const visited = new Set();
    const solutionSteps = [];

    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];

    const isValid = (x, y) => x >= 0 && y >= 0 && x < maze.length && y < maze[0].length && maze[x][y] === 0;

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        visited.add(key);
        solutionSteps.push([x, y]);

        if (x === end[0] && y === end[1]) {
            return solutionSteps; // Maze solved
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny) && !visited.has(`${nx},${ny}`)) {
                stack.push([nx, ny]);
            }
        }
    }

    return []; // No solution found
};
