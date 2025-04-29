/**
 * algorithms/generate/kruskal.js
 *
 * Maze generation using Kruskal's algorithm.
 *
 * Exports:
 *   generateMazeKruskal(size): Generates a size x size maze using Kruskal's algorithm.
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

// Kruskal's Algorithm Maze Generation
// Modernized: ensures full grid usage, clear logic, and maintainability

/**
 * Generates a maze using Kruskal's algorithm.
 *
 * @param {number} size - The width/height of the maze (number of cells per side).
 * @returns {{maze: number[][], steps: number[][], start: number[], end: number[]}}
 *   maze: 2D array (0=open, 1=wall)
 *   steps: Array of [x, y] for animation
 *   start: Start cell coordinates
 *   end: End cell coordinates
 */
module.exports = function generateMazeKruskal(size) {
    // Create a size x size grid filled with walls (1)
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const edges = [];
    const directions = [
        [0, -2], // left
        [0, 2],  // right
        [-2, 0], // up
        [2, 0]   // down
    ];
    const steps = [];

    // Disjoint set helpers

    /**
     * Disjoint set find operation.
     * @param {number[]} parent - Parent array
     * @param {number} x - Node index
     * @returns {number} Root of the set
     */
    const find = (parent, x) => (parent[x] === x ? x : (parent[x] = find(parent, parent[x])));

    /**
     * Disjoint set union operation.
     * @param {number[]} parent - Parent array
     * @param {number[]} rank - Rank array
     * @param {number} x - First node
     * @param {number} y - Second node
     * @returns {boolean} True if union was successful
     */
    const union = (parent, rank, x, y) => {
        const rootX = find(parent, x);
        const rootY = find(parent, y);
        if (rootX !== rootY) {
            if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            return true;
        }
        return false;
    };

    /**
     * Converts 2D cell coordinates to 1D index.
     * @param {number} x - Row index
     * @param {number} y - Column index
     * @returns {number} 1D index
     */
    const cellIndex = (x, y) => x * size + y;
    const parent = Array.from({ length: size * size }, (_, i) => i);
    const rank = Array(size * size).fill(0);

    // Add all possible edges between odd cells
    for (let x = 1; x < size; x += 2) {
        for (let y = 1; y < size; y += 2) {
            directions.forEach(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;
                if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1) {
                    edges.push([x, y, nx, ny]);
                }
            });
        }
    }

    maze[1][1] = 0;
    steps.push([1, 1]);
    while (edges.length > 0) {
        const randomIndex = Math.floor(Math.random() * edges.length);
        const [x, y, nx, ny] = edges.splice(randomIndex, 1)[0];

        if (union(parent, rank, cellIndex(x, y), cellIndex(nx, ny))) {
            // Carve the wall between current and neighbor
            const mx = x + (nx - x) / 2;
            const my = y + (ny - y) / 2;
            maze[x][y] = 0;
            steps.push([x, y]);
            maze[nx][ny] = 0;
            steps.push([nx, ny]);
            maze[mx][my] = 0;
            steps.push([mx, my]);
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
