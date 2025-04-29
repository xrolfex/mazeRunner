/**
 * algorithms/generate/prim.js
 *
 * Maze generation using Prim's algorithm.
 *
 * Exports:
 *   generateMazePrim(size): Generates a size x size maze using Prim's algorithm.
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

// Prim's Algorithm Maze Generation
// Modernized: ensures full grid usage, clear logic, and maintainability

/**
 * Generates a maze using Prim's algorithm.
 *
 * @param {number} size - The width/height of the maze (number of cells per side).
 * @returns {{maze: number[][], steps: number[][], start: number[], end: number[]}}
 *   maze: 2D array (0=open, 1=wall)
 *   steps: Array of [x, y] for animation
 *   start: Start cell coordinates
 *   end: End cell coordinates
 */
module.exports = function generateMazePrim(size) {
    // Create a size x size grid filled with walls (1)
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const walls = [];
    const directions = [
        [0, -2], // left
        [0, 2],  // right
        [-2, 0], // up
        [2, 0]   // down
    ];
    const steps = [];

    /**
     * Checks if a cell is within bounds and is a wall.
     * @param {number} x - Row index
     * @param {number} y - Column index
     * @returns {boolean} True if cell is valid for carving
     */
    const isValid = (x, y) => x > 0 && y > 0 && x < size - 1 && y < size - 1 && maze[x][y] === 1;

    /**
     * Adds all valid walls around a cell to the wall list.
     * @param {number} x - Row index
     * @param {number} y - Column index
     */
    const addWalls = (x, y) => {
        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny)) walls.push([x, y, nx, ny]);
        });
    };

    // Start at (1,1)
    maze[1][1] = 0;
    steps.push([1, 1]);
    addWalls(1, 1);

    while (walls.length > 0) {
        const randomIndex = Math.floor(Math.random() * walls.length);
        const [x, y, nx, ny] = walls.splice(randomIndex, 1)[0];

        if (isValid(nx, ny)) {
            // Carve the wall between current and neighbor
            const mx = x + (nx - x) / 2;
            const my = y + (ny - y) / 2;
            maze[mx][my] = 0;
            steps.push([mx, my]);
            maze[nx][ny] = 0;
            steps.push([nx, ny]);
            addWalls(nx, ny);
        }
    }

    // Set start and end points
    const start = [1, 1];
    let end = [size - 2, size - 2];
    if (size > 2 && maze[size - 3][size - 2] === 0) {
        end = [size - 3, size - 2];
    } else if (size > 2 && maze[size - 2][size - 3] === 0) {
        end = [size - 2, size - 3];
    } else if (size > 2 && maze[size - 3][size - 3] === 0) {
        end = [size - 3, size - 3];
    }
    maze[start[0]][start[1]] = 0;
    maze[end[0]][end[1]] = 0;
    steps.push(start, end);
    return { maze, steps, start, end };
}
