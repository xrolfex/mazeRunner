/**
 * algorithms/solve/bfs.js
 *
 * Maze solving using Breadth-First Search (BFS) algorithm.
 *
 * Exports:
 *   solveMazeBFS(maze, start, end): Solves the maze using BFS.
 *
 * Returns:
 *   solutionSteps: Array of [x, y] steps from start to end (if found)
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

// Breadth-First Search Maze Solver
/**
 * Solves a maze using Breadth-First Search (BFS).
 *
 * @param {number[][]} maze - 2D maze array (0=open, 1=wall)
 * @param {number[]} start - [row, col] start cell
 * @param {number[]} end - [row, col] end cell
 * @returns {number[][]} solutionSteps - Array of [x, y] steps from start to end (if found)
 */
module.exports = function solveMazeBFS(maze, start, end) {
    const queue = [start];
    const visited = new Set();
    const parent = new Map();
    const solutionSteps = [];
    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];

    const isValid = (x, y) => x >= 0 && y >= 0 && x < maze.length && y < maze[0].length && maze[x][y] === 0;
    const key = (x, y) => `${x},${y}`;

    let found = false;
    while (queue.length > 0) {
        const [x, y] = queue.shift();
        const k = key(x, y);
        if (visited.has(k)) continue;
        visited.add(k);
        solutionSteps.push([x, y]);

        if (x === end[0] && y === end[1]) {
            found = true;
            break;
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const nk = key(nx, ny);
            if (isValid(nx, ny) && !visited.has(nk)) {
                queue.push([nx, ny]);
                if (!parent.has(nk)) {
                    parent.set(nk, [x, y]);
                }
            }
        }
    }

    // Reconstruct optimal path from end to start
    let optimalPath = [];
    if (found) {
        let curr = end;
        while (curr) {
            optimalPath.push(curr);
            if (curr[0] === start[0] && curr[1] === start[1]) break;
            curr = parent.get(key(curr[0], curr[1]));
        }
        optimalPath.reverse();
    }

    return { solutionSteps, optimalPath };
};
