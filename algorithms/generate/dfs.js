// Depth-First Search Maze Generation
// Modernized: ensures full grid usage, clear logic, and maintainability
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

    // Only allow carving if the cell is inside the grid and is a wall
    // size: The width/height of the maze (number of cells per side)
    // stack: Used for DFS backtracking
    // directions: [dx, dy] pairs for left, right, up, down
    // steps: Animation steps for UI
    const isValid = (x, y) => x >= 0 && y >= 0 && x < size && y < size && maze[x][y] === 1;

    // Carve a path using DFS
    // x, y: Current cell coordinates
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
    // start: Always [0, 0] (top-left)
    // end: Prefer a border cell in the bottom/right that is open
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
