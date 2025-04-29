/**
 * algorithms/generate/dfs.js
 *
 * Maze generation using Depth-First Search (DFS) algorithm.
 *
 * Exports:
 *   generateMazeDFS(size): Generates a size x size maze using DFS.
 *
 * Returns:
 *   { maze, steps, start, end }
 *     maze: 2D array (0=open, 1=wall)
 *     steps: Array of [x, y] for animation
 *     start: Start cell coordinates
 *     end: End cell coordinates
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

// Depth-First Search Maze Generation
// Modernized: ensures full grid usage, clear logic, and maintainability

/**
 * Generates a maze using the Depth-First Search (DFS) algorithm.
 *
 * @param {number} size - The width/height of the maze (number of cells per side).
 * @returns {{maze: number[][], steps: number[][], start: number[], end: number[]}}
 *   maze: 2D array (0=open, 1=wall)
 *   steps: Array of [x, y] for animation
 *   start: Start cell coordinates
 *   end: End cell coordinates
 */
module.exports = function generateMazeDFS(size) {
    // Create a size x size grid filled with walls (1)
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const stack = [];
    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];
    const steps = [];

    /**
     * Checks if a cell is within bounds and is a wall.
     * @param {number} x - Row index
     * @param {number} y - Column index
     * @returns {boolean} True if cell is valid for carving
     */
    const isValid = (x, y) => x >= 0 && y >= 0 && x < size && y < size && maze[x][y] === 1;

    /**
     * Carves a path in the maze using DFS from the given cell.
     * @param {number} x - Current row
     * @param {number} y - Current column
     */
    const carvePath = (x, y) => {
        maze[x][y] = 0;
        steps.push([x, y]);
        stack.push([x, y]);

        while (stack.length > 0) {
            const [cx, cy] = stack[stack.length - 1];
            // Find all valid neighbors two steps away
            const neighbors = directions
                .map(([dx, dy]) => [cx + dx * 2, cy + dy * 2])
                .filter(([nx, ny]) => isValid(nx, ny));

            if (neighbors.length > 0) {
                // Randomly pick a neighbor to visit
                const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
                // Carve the wall between current and neighbor
                const mx = cx + (nx - cx) / 2;
                const my = cy + (ny - cy) / 2;
                maze[mx][my] = 0;
                steps.push([mx, my]);
                maze[nx][ny] = 0;
                steps.push([nx, ny]);
                stack.push([nx, ny]);
            } else {
                stack.pop();
            }
        }
    };

    // Start carving from the top-left corner
    carvePath(0, 0);

    // Set start and end points
    const start = [0, 0];
    let end = [size - 1, size - 1];
    // Prefer an end that is open and on the border
    if (size > 1 && maze[size - 2][size - 1] === 0) {
        end = [size - 2, size - 1];
    } else if (size > 1 && maze[size - 1][size - 2] === 0) {
        end = [size - 1, size - 2];
    } else if (size > 1 && maze[size - 2][size - 2] === 0) {
        end = [size - 2, size - 2];
    }
    maze[start[0]][start[1]] = 0;
    maze[end[0]][end[1]] = 0;
    steps.push(start, end);
    return { maze, steps, start, end };
}
