/**
 * algorithms/solve/astar.js
 *
 * Maze solving using A* Search algorithm.
 *
 * Exports:
 *   solveMazeAStar(maze, start, end): Solves the maze using A* Search.
 *
 * Returns:
 *   solutionSteps: Array of [x, y] steps from start to end (if found)
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

/**
 * Solves a maze using A* Search algorithm.
 *
 * @param {number[][]} maze - 2D maze array (0=open, 1=wall)
 * @param {number[]} start - [row, col] start cell
 * @param {number[]} end - [row, col] end cell
 * @returns {number[][]} solutionSteps - Array of [x, y] steps from start to end (if found)
 */
module.exports = function solveMazeAStar(maze, start, end) {
    const openSet = [start];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    const solutionSteps = [];

    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];

    const heuristic = (x, y) => Math.abs(x - end[0]) + Math.abs(y - end[1]);

    const key = ([x, y]) => `${x},${y}`;
    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start[0], start[1]));

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));
        const current = openSet.shift();
        const [x, y] = current;
        solutionSteps.push([x, y]);

        if (x === end[0] && y === end[1]) {
            return solutionSteps; // Maze solved
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const neighborKey = key([nx, ny]);

            if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length && maze[nx][ny] === 0) {
                const tentativeGScore = gScore.get(key(current)) + 1;

                if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + heuristic(nx, ny));

                    if (!openSet.some(([ox, oy]) => ox === nx && oy === ny)) {
                        openSet.push([nx, ny]);
                    }
                }
            }
        }
    }

    return []; // No solution found
};
